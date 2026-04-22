import { unstable_cache } from 'next/cache';
import { createServerSupabaseClient } from './supabase-server';

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

export const getHomeContent = unstable_cache(
  async (): Promise<HomePageData> => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from('home_page').select('*').single();
    if (!data) return defaultHome;
    return {
      ...defaultHome,
      ...data,
      hero_cta_primary: data.hero_cta_primary || defaultHome.hero_cta_primary,
      hero_cta_secondary: data.hero_cta_secondary || defaultHome.hero_cta_secondary,
      stats: Array.isArray(data.stats) ? data.stats : defaultHome.stats,
      contact_cta_button: data.contact_cta_button || defaultHome.contact_cta_button,
    };
  },
  ['content-home'],
  { tags: ['page:home'], revalidate: 1 }
);

export async function getPageContent(slug: PageSlug): Promise<PageData | null> {
  const table = pageTableBySlug[slug];
  const cached = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from(table)
        .select('id,title,description,hero_image,intro_title,intro_description')
        .single();
      return (data as PageData | null) || null;
    },
    [`content-page-${slug}`],
    { tags: [`page:${slug}`], revalidate: 1 }
  );
  return cached();
}

export const getNav = unstable_cache(
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

    return data as NavItem[];
  },
  ['content-nav'],
  { tags: ['nav'], revalidate: 1 }
);

export const getFooter = unstable_cache(
  async (): Promise<FooterContent> => {
    const supabase = createServerSupabaseClient();
    const { data: rows } = await supabase
      .from('footer_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);
    const data = rows?.[0];

    return {
      id: data?.id || 'default',
      columns:
        data?.columns ||
        [
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
      powered_by_text: data?.powered_by_text || 'DevsDiamond',
      copyright_name: data?.copyright_name || 'Divemix',
    };
  },
  ['content-footer'],
  { tags: ['footer'], revalidate: 1 }
);

export const getSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from('settings').select('key, value');
    const settings: SiteSettings = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }
    return settings;
  },
  ['content-settings'],
  { tags: ['settings'], revalidate: 1 }
);

export async function getPageSeo(route: string): Promise<PageSeo | null> {
  const normalized = route || '/';
  const cached = unstable_cache(
    async () => {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from('page_seo').select('*').eq('route', normalized).single();
      return (data as PageSeo | null) || null;
    },
    [`content-seo-${normalized}`],
    { tags: [`seo:${normalized}`], revalidate: 1 }
  );
  return cached();
}

export const getActiveCategories = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    return data || [];
  },
  ['entity-categories'],
  { tags: ['categories'], revalidate: 1 }
);

export const getFeaturedCategories = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(3);
    return data || [];
  },
  ['entity-categories-featured'],
  { tags: ['categories'], revalidate: 1 }
);

export const getFeaturedServices = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(4);
    return data || [];
  },
  ['entity-services-featured'],
  { tags: ['services'], revalidate: 1 }
);

export const getServices = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    return data || [];
  },
  ['entity-services'],
  { tags: ['services'], revalidate: 1 }
);

export const getFeaturedApplications = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(3);
    return data || [];
  },
  ['entity-applications-featured'],
  { tags: ['applications'], revalidate: 1 }
);

export const getApplications = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    return data || [];
  },
  ['entity-applications'],
  { tags: ['applications'], revalidate: 1 }
);

export const getVendors = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    return data || [];
  },
  ['entity-vendors'],
  { tags: ['vendors'], revalidate: 1 }
);

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

export const getAboutPageData = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from('about_page').select('*').single();
    return data;
  },
  ['page-about'],
  { tags: ['page:about'], revalidate: 1 }
);

export const getContactPageData = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from('contact_page').select('*').single();
    return data;
  },
  ['page-contact'],
  { tags: ['page:contact'], revalidate: 1 }
);
