import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
  console.warn('Supabase URL not configured properly. Using fallback configuration.')
}
if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
  console.warn('Supabase Anon Key not configured properly. Using fallback configuration.')
}

// Create client with fallback values for development
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          short_description: string
          category_id: string
          image_url: string
          images: string[]
          features: string[]
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          short_description?: string
          category_id: string
          image_url?: string
          images?: string[]
          features?: string[]
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          short_description?: string
          category_id?: string
          image_url?: string
          images?: string[]
          features?: string[]
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
      }
      product_categories: {
        Row: {
          id: string
          name: string
          description: string
          slug: string
          image_url: string
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          slug: string
          image_url?: string
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          slug?: string
          image_url?: string
          is_active?: boolean
          display_order?: number
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
          title: string
          description: string
          icon: string
          features: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon: string
          features?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          features?: string[]
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          name: string
          description: string
          features: string[]
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          features?: string[]
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          features?: string[]
          images?: string[]
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
          title: string
          url: string
          category: string
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          category: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
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
          title: string
          description: string
          hero_image: string
          vision: string
          mission: string
          values: {
            title: string
            description: string
            icon: string
          }[]
          timeline: {
            year: string
            title: string
            description: string
          }[]
          company_overview: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          hero_image: string
          vision: string
          mission: string
          values: {
            title: string
            description: string
            icon: string
          }[]
          timeline: {
            year: string
            title: string
            description: string
          }[]
          company_overview: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          hero_image?: string
          vision?: string
          mission?: string
          values?: {
            title: string
            description: string
            icon: string
          }[]
          timeline?: {
            year: string
            title: string
            description: string
          }[]
          company_overview?: string
          updated_at?: string
        }
      }
      contact_page: {
        Row: {
          id: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          branches: {
            name: string
            address: string
            phone: string
            email: string
            coordinates: {
              lat: number
              lng: number
            }
          }[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          branches: {
            name: string
            address: string
            phone: string
            email: string
            coordinates: {
              lat: number
              lng: number
            }
          }[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          hero_image?: string
          intro_title?: string
          intro_description?: string
          branches?: {
            name: string
            address: string
            phone: string
            email: string
            coordinates: {
              lat: number
              lng: number
            }
          }[]
          updated_at?: string
        }
      }
      products_page: {
        Row: {
          id: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          hero_image?: string
          intro_title?: string
          intro_description?: string
          updated_at?: string
        }
      }
      services_page: {
        Row: {
          id: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          hero_image?: string
          intro_title?: string
          intro_description?: string
          updated_at?: string
        }
      }
      applications_page: {
        Row: {
          id: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          hero_image: string
          intro_title: string
          intro_description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          hero_image?: string
          intro_title?: string
          intro_description?: string
          updated_at?: string
        }
      }
    }
  }
}