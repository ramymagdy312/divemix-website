# Database Setup

This folder contains SQL scripts to set up the database tables for the DiveMix website.

## Tables

### 1. about_page
Contains content for the About page including:
- Basic information (title, description, hero image)
- Vision and mission statements
- Company overview
- Core values (stored as JSONB array)
- Company timeline (stored as JSONB array)

### 2. contact_page
Contains content for the Contact page including:
- Basic information (title, description, hero image)
- Introduction section
- Branch locations with contact details and coordinates (stored as JSONB array)

### 3. products_page
Contains content for the Products page including:
- Basic information (title, description, hero image)
- Introduction section (intro title and description)

### 4. services_page
Contains content for the Services page including:
- Basic information (title, description, hero image)
- Introduction section (intro title and description)

### 5. applications_page
Contains content for the Applications page including:
- Basic information (title, description, hero image)
- Introduction section (intro title and description)

## Setup Instructions

### For Supabase:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following scripts in order:
   - `about_page.sql`
   - `contact_page.sql`
   - `products_page.sql`
   - `services_page.sql`
   - `applications_page.sql`
   - `gallery_categories.sql`
   - `gallery_images.sql`

### Environment Variables

Make sure to set up your environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Features

- **Auto-updating timestamps**: Both tables have `updated_at` columns that automatically update when records are modified
- **Default data**: Scripts include sample data to get you started
- **JSONB storage**: Complex data structures (values, timeline, branches) are stored as JSONB for flexibility
- **UUID primary keys**: All tables use UUID primary keys for better scalability

## Admin Interface

Once the database is set up, you can manage the content through the admin interface:

- About Page: `/admin/about`
- Contact Page: `/admin/contact`
- Products Page: `/admin/products-page`
- Services Page: `/admin/services-page`
- Applications Page: `/admin/applications-page`
- Gallery Categories: `/admin/gallery-categories`

The admin interface allows you to:
- Edit all text content
- Upload and manage hero images
- Manage core values and timeline items (About page)
- Update branch information and locations (Contact page)
- Edit introduction sections for all pages
- Create and manage gallery categories
- Organize gallery images by categories
- Default gallery categories: Installations, Maintenance, Testing, Facilities, Training

## Development Mode

If Supabase is not configured, the application will automatically use mock data from:
- `app/data/aboutData.ts`
- `app/data/contactData.ts`
- `app/data/productsPageData.ts`
- `app/data/servicesPageData.ts`
- `app/data/applicationsPageData.ts`
- `app/data/galleryCategoriesData.ts`
- `app/data/galleryImages.ts`

This allows for development without requiring a database connection.