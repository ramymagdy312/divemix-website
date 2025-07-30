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
          category_id: string
          images: string[]
          features: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category_id: string
          images?: string[]
          features?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category_id?: string
          images?: string[]
          features?: string[]
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          category?: string
          updated_at?: string
        }
      }
    }
  }
}