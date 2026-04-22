import type { Metadata } from 'next';
import { getPageSeo, getSettings } from './content';

export async function buildRouteMetadata(route: string, fallback: { title: string; description: string }): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getPageSeo(route), getSettings()]);

  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const ogImage = seo?.og_image || settings.logo_url || '/img/faveicon.ico';

  return {
    title,
    description,
    robots: seo?.noindex ? 'noindex, nofollow' : 'index, follow',
    keywords: seo?.keywords || [],
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      type: 'website',
    },
  };
}
