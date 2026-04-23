import type { Metadata } from 'next';
import { getPageSeo, getSettings } from './content';
import { defaultLocale, locales, type Locale } from './i18n/config';

/**
 * Builds Next.js Metadata for a given route and locale, including language alternates.
 * `route` should be the canonical path WITHOUT the locale prefix (e.g. "/about").
 */
export async function buildRouteMetadata(
  route: string,
  fallback: { title: string; description: string },
  locale: Locale = defaultLocale
): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getPageSeo(route, locale), getSettings(locale)]);

  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const ogImage = seo?.og_image || settings.logo_url || '/img/faveicon.ico';

  const canonical = `/${locale}${route === '/' ? '' : route}`;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `/${l}${route === '/' ? '' : route}`;
  }

  return {
    title,
    description,
    robots: seo?.noindex ? 'noindex, nofollow' : 'index, follow',
    keywords: seo?.keywords || [],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      type: 'website',
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
    },
  };
}
