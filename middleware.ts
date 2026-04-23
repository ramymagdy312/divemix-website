import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales as staticLocales, defaultLocale as staticDefault } from '@/app/lib/i18n/config';
import { getLanguageSettingsEdge } from '@/app/lib/i18n/languages-edge';

const STATIC_LOCALE_SET = new Set<string>(staticLocales);

/**
 * Middleware responsibilities:
 *
 *  1. Protect the revalidate API: must have a Supabase auth cookie.
 *  2. Skip i18n routing for admin/api/static asset paths.
 *  3. Handle disabled locales: if the request hits `/ar/...` but Arabic
 *     has been disabled in the admin, redirect to `/<default>/...`.
 *  4. Delegate the normal locale handling (prefixing, negotiation) to
 *     next-intl. We build the intl middleware dynamically per-request so
 *     that changes to enabled locales / default locale in the admin take
 *     effect immediately (modulo the edge cache TTL of ~30s).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- 1. Revalidate API protection -----------------------------------------
  if (pathname.startsWith('/api/revalidate')) {
    const hasSupabaseSessionCookie = req.cookies
      .getAll()
      .some((cookie) => cookie.name.includes('auth-token') || cookie.name.startsWith('sb-'));
    if (!hasSupabaseSessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // --- 2. Bypass for admin, api, static -------------------------------------
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/img') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // --- 3. Resolve current language settings ---------------------------------
  const settings = await getLanguageSettingsEdge();

  // The intl middleware needs a non-empty locale list. Always fall back to
  // the compiled-in static list if, for whatever reason, the DB produced
  // an empty one - we must never 500 the whole public site from here.
  const enabled = settings.enabled.length > 0 ? settings.enabled : [...staticLocales];
  const effectiveDefault = enabled.includes(settings.default)
    ? settings.default
    : enabled[0] ?? staticDefault;

  // --- 4. Redirect disabled-locale URLs to the default locale ---------------
  // We only rewrite locale prefixes that the build knows about. Anything
  // else falls through to next-intl which will 404 / route normally.
  const firstSegment = pathname.split('/')[1] ?? '';
  if (
    firstSegment &&
    STATIC_LOCALE_SET.has(firstSegment) &&
    !enabled.includes(firstSegment)
  ) {
    const rest = pathname.slice(firstSegment.length + 1) || '/';
    const url = req.nextUrl.clone();
    url.pathname = `/${effectiveDefault}${rest === '/' ? '' : rest}`;
    return NextResponse.redirect(url);
  }

  // --- 5. Delegate to next-intl with the *current* enabled set --------------
  const intlMiddleware = createIntlMiddleware({
    locales: enabled as unknown as [string, ...string[]],
    defaultLocale: effectiveDefault,
    localePrefix: 'always',
  });

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon, image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
