// Database types for all tables

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  image_url?: string;
  category_id?: string;
  category?: string;
  price?: number;
  specifications?: any;
  features?: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  image_url?: string;
  icon?: string;
  features?: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  image_url?: string;
  industry?: string;
  use_cases?: string[];
  benefits?: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  category_id?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Page content types
export interface ProductsPage {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicesPage {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationsPage {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}