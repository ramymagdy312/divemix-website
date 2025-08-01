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

## Setup Instructions

### For Supabase:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following scripts in order:
   - `about_page.sql`
   - `contact_page.sql`

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

The admin interface allows you to:
- Edit all text content
- Manage core values and timeline items
- Update branch information and locations
- Change hero images and other media

## Development Mode

If Supabase is not configured, the application will automatically use mock data from:
- `app/data/aboutData.ts`
- `app/data/contactData.ts`

This allows for development without requiring a database connection.