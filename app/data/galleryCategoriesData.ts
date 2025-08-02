export interface GalleryCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const galleryCategoriesData: GalleryCategory[] = [
  {
    id: "cat-1",
    name: "All",
    description: "All gallery images",
    slug: "all",
    display_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Installations",
    description: "Industrial compressor installations and setup",
    slug: "installations",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "Maintenance",
    description: "Maintenance workshops and service operations",
    slug: "maintenance",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-4",
    name: "Testing",
    description: "Quality testing processes and procedures",
    slug: "testing",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-5",
    name: "Facilities",
    description: "Our manufacturing facilities and equipment",
    slug: "facilities",
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-6",
    name: "Training",
    description: "Training sessions and educational programs",
    slug: "training",
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];