import { unstable_cache } from 'next/cache';
import { createServerSupabaseClient } from './supabase-server';
import { deepResolveI18n, resolveI18n } from './i18n/resolve';
import { defaultLocale, locales, type Locale } from './i18n/config';

export type PageSlug = 'products' | 'services' | 'applications' | 'about' | 'contact' | 'gallery';

export interface PageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
}

export interface HomePageData {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_cta_primary: { label: string; href: string };
  hero_cta_secondary: { label: string; href: string };
  stats: { icon: string; value: string; label: string }[];
  show_company_teaser: boolean;
  show_contact_cta: boolean;
  contact_cta_title: string;
  contact_cta_body: string;
  contact_cta_button: { label: string; href: string };
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  parent_id: string | null;
  is_external: boolean;
  is_active: boolean;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterContent {
  id: string;
  columns: FooterColumn[];
  powered_by_text: string;
  copyright_name: string;
}

export interface SiteSettings {
  company_name?: string;
  company_tagline?: string;
  logo_url?: string;
  logo_alt?: string;
  whatsapp_number?: string;
  whatsapp_message?: string;
  show_whatsapp_float?: string;
  show_branches_in_footer?: string;
  footer_branches_title?: string;
  support_section_title?: string;
  support_section_enabled?: string;
  support_items?: string;
  [key: string]: string | undefined;
}

export interface PageSeo {
  route: string;
  title: string;
  description: string;
  og_image: string | null;
  keywords: string[];
  noindex: boolean;
}

const defaultHome: HomePageData = {
  id: 'default',
  hero_title: 'Pioneering the Future of Gas Technology',
  hero_subtitle:
    'Leading the industry with innovative solutions for gas mixing and compression systems. Trust DiveMix for reliability, precision, and excellence.',
  hero_image: '/img/hero/home.jpg',
  hero_cta_primary: { label: 'Explore Products', href: '/products' },
  hero_cta_secondary: { label: 'Contact Us', href: '/contact' },
  stats: [
    { icon: 'Award', value: '20+', label: 'Years Experience' },
    { icon: 'Users', value: '1000+', label: 'Projects Completed' },
    { icon: 'Globe', value: '50+', label: 'Countries Served' },
    { icon: 'Clock', value: '24/7', label: 'Support Available' },
  ],
  show_company_teaser: true,
  show_contact_cta: false,
  contact_cta_title: 'Ready to Get Started?',
  contact_cta_body:
    'Contact our team of experts for a consultation and discover how we can help optimize your operations',
  contact_cta_button: { label: 'Contact Us Today', href: '/contact' },
};

const pageTableBySlug: Record<PageSlug, string> = {
  products: 'products_page',
  services: 'services_page',
  applications: 'applications_page',
  about: 'about_page',
  contact: 'contact_page',
  gallery: 'gallery_page',
};

/**
 * Builds a per-locale cache tag (e.g. page:home:ar). Entities that are language-neutral
 * at the DB level still vary after resolving, so we always include locale in tags.
 */
export function localeTag(base: string, locale: Locale): string {
  return `${base}:${locale}`;
}

/**
 * Returns an array of cache tags fanning out across all locales for a base tag.
 * Use from admin save handlers to invalidate every language version at once.
 */
export function allLocaleTags(base: string): string[] {
  return [base, ...locales.map((l) => `${base}:${l}`)];
}

export function getHomeContent(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async (): Promise<HomePageData> => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from('home_page').select('*').single();
      if (!data) return defaultHome;
      const resolved = deepResolveI18n(data, locale);
      return {
        ...defaultHome,
        ...resolved,
        hero_cta_primary: resolved.hero_cta_primary || defaultHome.hero_cta_primary,
        hero_cta_secondary: resolved.hero_cta_secondary || defaultHome.hero_cta_secondary,
        stats: Array.isArray(resolved.stats) ? resolved.stats : defaultHome.stats,
        contact_cta_button: resolved.contact_cta_button || defaultHome.contact_cta_button,
      };
    },
    [`content-home-${locale}`],
    { tags: ['page:home', localeTag('page:home', locale)], revalidate: 1 }
  );
  return fetcher();
}

export async function getPageContent(slug: PageSlug, locale: Locale = defaultLocale): Promise<PageData | null> {
  const table = pageTableBySlug[slug];
  const cached = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from(table)
        .select('id,title,description,hero_image,intro_title,intro_description')
        .single();
      if (!data) return null;
      return deepResolveI18n(data, locale) as PageData;
    },
    [`content-page-${slug}-${locale}`],
    { tags: [`page:${slug}`, localeTag(`page:${slug}`, locale)], revalidate: 1 }
  );
  return cached();
}

export function getNav(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async (): Promise<NavItem[]> => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('nav_items')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!data || data.length === 0) {
        return [
          { id: '1', label: 'Home', href: '/', sort_order: 1, parent_id: null, is_external: false, is_active: true },
          { id: '2', label: 'Products', href: '/products', sort_order: 2, parent_id: null, is_external: false, is_active: true },
          { id: '3', label: 'Services', href: '/services', sort_order: 3, parent_id: null, is_external: false, is_active: true },
          { id: '4', label: 'Applications', href: '/applications', sort_order: 4, parent_id: null, is_external: false, is_active: true },
          { id: '5', label: 'Gallery', href: '/gallery', sort_order: 5, parent_id: null, is_external: false, is_active: true },
          { id: '6', label: 'Contact', href: '/contact', sort_order: 6, parent_id: null, is_external: false, is_active: true },
          { id: '7', label: 'About', href: '/about', sort_order: 7, parent_id: null, is_external: false, is_active: true },
        ];
      }

      return data.map((item: { label: unknown } & Record<string, unknown>) => ({
        ...item,
        label: resolveI18n(item.label as any, locale),
      })) as NavItem[];
    },
    [`content-nav-${locale}`],
    { tags: ['nav', localeTag('nav', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getFooter(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async (): Promise<FooterContent> => {
      const supabase = createServerSupabaseClient();
      const { data: rows } = await supabase
        .from('footer_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);
      const data = rows?.[0];

      const defaults = {
        columns: [
          {
            title: 'Company',
            links: [
              { label: 'About Us', href: '/about' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'Contact Us', href: '/contact' },
            ],
          },
          {
            title: 'Our Services',
            links: [
              { label: 'Products', href: '/products' },
              { label: 'Services', href: '/services' },
              { label: 'Applications', href: '/applications' },
            ],
          },
        ],
        powered_by_text: 'DevsDiamond',
        copyright_name: 'Divemix',
      };

      if (!data) {
        return { id: 'default', ...defaults };
      }

      const resolved = deepResolveI18n(data, locale) as {
        id: string;
        columns?: FooterColumn[] | null;
        powered_by_text?: string | null;
        copyright_name?: string | null;
      };

      return {
        id: resolved.id || 'default',
        columns: resolved.columns && resolved.columns.length > 0 ? resolved.columns : defaults.columns,
        powered_by_text: resolved.powered_by_text || defaults.powered_by_text,
        copyright_name: resolved.copyright_name || defaults.copyright_name,
      };
    },
    [`content-footer-${locale}`],
    { tags: ['footer', localeTag('footer', locale)], revalidate: 1 }
  );
  return fetcher();
}

/** Settings values may be plain strings or JSON-encoded i18n objects; we resolve both. */
export function getSettings(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async (): Promise<SiteSettings> => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from('settings').select('key, value');
      const settings: SiteSettings = {};
      for (const row of data || []) {
        const raw = row.value ?? '';
        // Try to parse JSON; if it's an i18n object, resolve it, else keep as string
        let resolved = raw;
        const trimmed = raw.trim?.() ?? '';
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed && typeof parsed === 'object') {
              const keys = Object.keys(parsed);
              const isI18n = keys.length > 0 && keys.every((k) => k === 'en' || k === 'ar' || k === 'de');
              if (isI18n) {
                resolved = resolveI18n(parsed, locale);
              }
            }
          } catch {
            // not JSON, keep raw
          }
        }
        settings[row.key] = resolved;
      }
      return settings;
    },
    [`content-settings-${locale}`],
    { tags: ['settings', localeTag('settings', locale)], revalidate: 1 }
  );
  return fetcher();
}

export async function getPageSeo(route: string, locale: Locale = defaultLocale): Promise<PageSeo | null> {
  const normalized = route || '/';
  const cached = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from('page_seo').select('*').eq('route', normalized).single();
      if (!data) return null;
      const row = data as Record<string, unknown>;
      const keywordsRaw = row.keywords;
      let keywords: string[] = [];
      if (Array.isArray(keywordsRaw)) {
        keywords = keywordsRaw.map((k) => resolveI18n(k as any, locale));
      } else if (keywordsRaw && typeof keywordsRaw === 'object') {
        const k = (keywordsRaw as Record<string, unknown>)[locale] ?? (keywordsRaw as Record<string, unknown>)[defaultLocale];
        if (Array.isArray(k)) keywords = k as string[];
      }
      return {
        route: String(row.route),
        title: resolveI18n(row.title as any, locale),
        description: resolveI18n(row.description as any, locale),
        og_image: (row.og_image as string | null) || null,
        keywords,
        noindex: Boolean(row.noindex),
      } as PageSeo;
    },
    [`content-seo-${normalized}-${locale}`],
    { tags: [`seo:${normalized}`, localeTag(`seo:${normalized}`, locale)], revalidate: 1 }
  );
  return cached();
}

export function getActiveCategories(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('product_categories')
        .select('*')
        .is('parent_id', null)
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      return (data || []).map((row) => deepResolveI18n(row, locale));
    },
    [`entity-categories-${locale}`],
    { tags: ['categories', localeTag('categories', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getFeaturedCategories(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(3);
      return (data || []).map((row) => deepResolveI18n(row, locale));
    },
    [`entity-categories-featured-${locale}`],
    { tags: ['categories', localeTag('categories', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getFeaturedServices(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(4);
      return (data || []).map((row) => deepResolveI18n(row, locale));
    },
    [`entity-services-featured-${locale}`],
    { tags: ['services', localeTag('services', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getServices(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      return (data || []).map((row) => deepResolveI18n(row, locale));
    },
    [`entity-services-${locale}`],
    { tags: ['services', localeTag('services', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getFeaturedApplications(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(3);
      return (data || []).map((row) => deepResolveI18n(row, locale));
    },
    [`entity-applications-featured-${locale}`],
    { tags: ['applications', localeTag('applications', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getApplications(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      return (data || []).map((row) => deepResolveI18n(row, locale));
    },
    [`entity-applications-${locale}`],
    { tags: ['applications', localeTag('applications', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getVendors(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      return (data || []).map((row) => deepResolveI18n(row, locale));
    },
    [`entity-vendors-${locale}`],
    { tags: ['vendors', localeTag('vendors', locale)], revalidate: 1 }
  );
  return fetcher();
}

export const getProductCategorySlugs = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('product_categories')
      .select('slug')
      .eq('is_active', true);
    return (data || []).map((row: { slug: string }) => row.slug).filter(Boolean);
  },
  ['entity-category-slugs'],
  { tags: ['categories'], revalidate: 1 }
);

export function getAboutPageData(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from('about_page').select('*').single();
      if (!data) return null;
      return deepResolveI18n(data, locale);
    },
    [`page-about-${locale}`],
    { tags: ['page:about', localeTag('page:about', locale)], revalidate: 1 }
  );
  return fetcher();
}

export function getContactPageData(locale: Locale = defaultLocale) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from('contact_page').select('*').single();
      if (!data) return null;
      return deepResolveI18n(data, locale);
    },
    [`page-contact-${locale}`],
    { tags: ['page:contact', localeTag('page:contact', locale)], revalidate: 1 }
  );
  return fetcher();
}
