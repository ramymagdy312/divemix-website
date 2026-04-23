import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
  console.warn('Supabase URL not configured properly. Using fallback configuration.')
}
if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
  console.warn('Supabase Anon Key not configured properly. Using fallback configuration.')
}

// Create client with fallback values for development
export const supabase = createSupabaseClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Export createClient function for components that need to create their own client
export const createClient = () => {
  return createSupabaseClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  )
}

/**
 * Localized text payload stored as JSONB per translatable column.
 * Accepts plain strings too for backward compatibility with legacy rows.
 */
export type I18nText = string | { en?: string | null; ar?: string | null; de?: string | null };

/** Array of localized text entries (e.g. features[] / keywords[]). */
export type I18nTextArray = Array<I18nText>;

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: I18nText
          description: I18nText
          short_description: I18nText
          category_id: string
          subcategory_id?: string | null
          image_url: string
          images: string[]
          features: I18nTextArray
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: I18nText
          description: I18nText
          short_description?: I18nText
          category_id: string
          subcategory_id?: string | null
          image_url?: string
          images?: string[]
          features?: I18nTextArray
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: I18nText
          description?: I18nText
          short_description?: I18nText
          category_id?: string
          subcategory_id?: string | null
          image_url?: string
          images?: string[]
          features?: I18nTextArray
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
      }
      product_categories: {
        Row: {
          id: string
          name: I18nText
          description: I18nText
          slug: string
          image_url: string
          is_active: boolean
          display_order: number
          parent_id?: string | null
          features?: I18nTextArray
          images?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: I18nText
          description?: I18nText
          slug: string
          image_url?: string
          is_active?: boolean
          display_order?: number
          parent_id?: string | null
          features?: I18nTextArray
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: I18nText
          description?: I18nText
          slug?: string
          image_url?: string
          is_active?: boolean
          display_order?: number
          parent_id?: string | null
          features?: I18nTextArray
          images?: string[]
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          hero_image: string
          image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          hero_image: string
          image: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          hero_image?: string
          image?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          icon: string
          features: I18nTextArray
          is_active?: boolean
          display_order?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description: I18nText
          icon: string
          features?: I18nTextArray
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          icon?: string
          features?: I18nTextArray
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          name: I18nText
          description: I18nText
          features: I18nTextArray
          images: string[]
          is_active?: boolean
          display_order?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: I18nText
          description: I18nText
          features?: I18nTextArray
          images?: string[]
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: I18nText
          description?: I18nText
          features?: I18nTextArray
          images?: string[]
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: I18nText
          description: I18nText
          image_url?: string | null
          website_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: I18nText
          description?: I18nText
          image_url?: string | null
          website_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: I18nText
          description?: I18nText
          image_url?: string | null
          website_url?: string | null
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          summary: string
          content: string
          image_url: string
          published_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          content: string
          image_url: string
          published_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          content?: string
          image_url?: string
          published_date?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          title: I18nText
          description?: I18nText
          url: string
          category: string
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description?: I18nText
          url: string
          category: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          url?: string
          category?: string
          category_id?: string | null
          updated_at?: string
        }
      }
      gallery_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          display_order?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      about_page: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          hero_image: string
          vision: I18nText
          mission: I18nText
          values: {
            title: I18nText
            description: I18nText
            icon: string
          }[]
          timeline: {
            year: string
            title: I18nText
            description: I18nText
          }[]
          company_overview: I18nText
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description: I18nText
          hero_image: string
          vision: I18nText
          mission: I18nText
          values: {
            title: I18nText
            description: I18nText
            icon: string
          }[]
          timeline: {
            year: string
            title: I18nText
            description: I18nText
          }[]
          company_overview: I18nText
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          hero_image?: string
          vision?: I18nText
          mission?: I18nText
          values?: {
            title: I18nText
            description: I18nText
            icon: string
          }[]
          timeline?: {
            year: string
            title: I18nText
            description: I18nText
          }[]
          company_overview?: I18nText
          updated_at?: string
        }
      }
      contact_page: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          branches: {
            name: I18nText
            address: I18nText
            phone: string
            email: string
            coordinates: {
              lat: number
              lng: number
            }
            show_in_footer?: boolean
          }[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          branches: {
            name: I18nText
            address: I18nText
            phone: string
            email: string
            coordinates: {
              lat: number
              lng: number
            }
            show_in_footer?: boolean
          }[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          hero_image?: string
          intro_title?: I18nText
          intro_description?: I18nText
          branches?: {
            name: I18nText
            address: I18nText
            phone: string
            email: string
            coordinates: {
              lat: number
              lng: number
            }
            show_in_footer?: boolean
          }[]
          updated_at?: string
        }
      }
      products_page: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          hero_image?: string
          intro_title?: I18nText
          intro_description?: I18nText
          updated_at?: string
        }
      }
      services_page: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          hero_image?: string
          intro_title?: I18nText
          intro_description?: I18nText
          updated_at?: string
        }
      }
      applications_page: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          hero_image?: string
          intro_title?: I18nText
          intro_description?: I18nText
          updated_at?: string
        }
      }
      gallery_page: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description: I18nText
          hero_image: string
          intro_title: I18nText
          intro_description: I18nText
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          hero_image?: string
          intro_title?: I18nText
          intro_description?: I18nText
          updated_at?: string
        }
      }
      home_page: {
        Row: {
          id: string
          hero_title: I18nText
          hero_subtitle: I18nText
          hero_image: string
          hero_cta_primary: { label: I18nText; href: string }
          hero_cta_secondary: { label: I18nText; href: string }
          stats: { icon: string; value: string; label: I18nText }[]
          show_company_teaser: boolean
          show_contact_cta: boolean
          contact_cta_title: I18nText
          contact_cta_body: I18nText
          contact_cta_button: { label: I18nText; href: string }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hero_title: I18nText
          hero_subtitle: I18nText
          hero_image: string
          hero_cta_primary: { label: I18nText; href: string }
          hero_cta_secondary: { label: I18nText; href: string }
          stats: { icon: string; value: string; label: I18nText }[]
          show_company_teaser?: boolean
          show_contact_cta?: boolean
          contact_cta_title: I18nText
          contact_cta_body: I18nText
          contact_cta_button: { label: I18nText; href: string }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_title?: I18nText
          hero_subtitle?: I18nText
          hero_image?: string
          hero_cta_primary?: { label: I18nText; href: string }
          hero_cta_secondary?: { label: I18nText; href: string }
          stats?: { icon: string; value: string; label: I18nText }[]
          show_company_teaser?: boolean
          show_contact_cta?: boolean
          contact_cta_title?: I18nText
          contact_cta_body?: I18nText
          contact_cta_button?: { label: I18nText; href: string }
          updated_at?: string
        }
      }
      nav_items: {
        Row: {
          id: string
          label: I18nText
          href: string
          sort_order: number
          parent_id: string | null
          is_external: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label: I18nText
          href: string
          sort_order?: number
          parent_id?: string | null
          is_external?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: I18nText
          href?: string
          sort_order?: number
          parent_id?: string | null
          is_external?: boolean
          is_active?: boolean
          updated_at?: string
        }
      }
      footer_content: {
        Row: {
          id: string
          columns: { title: I18nText; links: { label: I18nText; href: string }[] }[]
          powered_by_text: I18nText
          copyright_name: I18nText
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          columns: { title: I18nText; links: { label: I18nText; href: string }[] }[]
          powered_by_text?: I18nText
          copyright_name?: I18nText
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          columns?: { title: I18nText; links: { label: I18nText; href: string }[] }[]
          powered_by_text?: I18nText
          copyright_name?: I18nText
          updated_at?: string
        }
      }
      page_seo: {
        Row: {
          route: string
          title: I18nText
          description: I18nText
          og_image: string | null
          keywords: I18nTextArray
          noindex: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          route: string
          title: I18nText
          description: I18nText
          og_image?: string | null
          keywords?: I18nTextArray
          noindex?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          route?: string
          title?: I18nText
          description?: I18nText
          og_image?: string | null
          keywords?: I18nTextArray
          noindex?: boolean
          updated_at?: string
        }
      }
      settings: {
        Row: {
          key: string
          value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          description?: string | null
          updated_at?: string
        }
      }
      language_settings: {
        Row: {
          code: string
          name: string
          native_name: string
          flag: string | null
          enabled: boolean
          is_default: boolean
          is_fallback: boolean
          is_rtl: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          code: string
          name: string
          native_name: string
          flag?: string | null
          enabled?: boolean
          is_default?: boolean
          is_fallback?: boolean
          is_rtl?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          code?: string
          name?: string
          native_name?: string
          flag?: string | null
          enabled?: boolean
          is_default?: boolean
          is_fallback?: boolean
          is_rtl?: boolean
          display_order?: number
          updated_at?: string
        }
      }
    }
  }
}