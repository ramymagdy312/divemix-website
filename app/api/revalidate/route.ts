import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { locales } from '@/app/lib/i18n/config';
import {
  LANGUAGE_SETTINGS_CACHE_TAG,
  getLanguageSettings,
} from '@/app/lib/i18n/languages';
import { bustLanguageSettingsEdgeCache } from '@/app/lib/i18n/languages-edge';

/**
 * Expands a base tag into the base tag plus one per-locale variant.
 * Example: "page:home" -> ["page:home", "page:home:en", "page:home:ar", "page:home:de"].
 *
 * We fan out across both the currently-enabled locales and the full static
 * set, so that content caches for locales that were temporarily disabled
 * still get invalidated if they are re-enabled later.
 */
function fanOutLocales(tag: string, activeLocales: string[]): string[] {
  const all = Array.from(new Set<string>([...activeLocales, ...locales]));
  const localeSuffixes = all.map((l) => `:${l}`);
  if (localeSuffixes.some((suffix) => tag.endsWith(suffix))) {
    return [tag];
  }
  return [tag, ...all.map((l) => `${tag}:${l}`)];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tags: string[] = Array.isArray(body.tags)
      ? body.tags
      : body.tag
      ? [body.tag]
      : [];

    if (tags.length === 0) {
      return NextResponse.json({ error: 'Missing tag(s)' }, { status: 400 });
    }

    const expectedToken = process.env.REVALIDATE_TOKEN;
    if (expectedToken) {
      const token = req.headers.get('x-revalidate-token');
      if (token !== expectedToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    let activeLocales: string[] = [...locales];
    try {
      const settings = await getLanguageSettings();
      if (settings.enabled.length > 0) activeLocales = settings.enabled;
    } catch {
      // Fall back to static locales - revalidation must never crash.
    }

    const expanded = Array.from(
      new Set(tags.flatMap((t) => fanOutLocales(t, activeLocales)))
    );
    for (const tag of expanded) {
      revalidateTag(tag);
    }

    // When the language configuration itself changes, also clear the
    // middleware's in-memory edge cache so the new enabled/default/rtl
    // list applies on the very next request (not after the 30s TTL).
    if (expanded.includes(LANGUAGE_SETTINGS_CACHE_TAG)) {
      bustLanguageSettingsEdgeCache();
    }

    return NextResponse.json({ success: true, tags: expanded });
  } catch (error) {
    console.error('Revalidate route error:', error);
    return NextResponse.json({ error: 'Failed to revalidate tags' }, { status: 500 });
  }
}
