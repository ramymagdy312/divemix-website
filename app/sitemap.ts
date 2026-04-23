import type { MetadataRoute } from 'next';
import { locales } from './lib/i18n/config';
import { getProductCategorySlugs } from './lib/content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://divemix.com';

const staticRoutes = ['', '/about', '/products', '/services', '/applications', '/gallery', '/contact'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProductCategorySlugs().catch(() => [] as string[]);
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      const url = `${BASE_URL}/${locale}${route}`;
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l] = `${BASE_URL}/${l}${route}`;
      }
      entries.push({
        url,
        lastModified: now,
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.7,
        alternates: { languages },
      });
    }

    for (const slug of slugs) {
      const route = `/products/${slug}`;
      const url = `${BASE_URL}/${locale}${route}`;
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l] = `${BASE_URL}/${l}${route}`;
      }
      entries.push({
        url,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
