# DiveMix Database Setup Files

This directory contains SQL files for setting up the DiveMix Gas & Compressor Technologies website database. Choose the appropriate file based on your deployment needs.

## 📁 Available Files

### 1. `complete_database_setup.sql` ⭐ **RECOMMENDED**

**Complete database setup with full features and sample data**

- **Use for:** Production deployment, full-featured development
- **Contains:**

  - All database tables and relationships
  - Complete RLS (Row Level Security) policies
  - Comprehensive sample data
  - All product categories and products
  - Services, applications, and gallery content
  - Page content management tables
  - Settings and configuration
  - Vendor management
  - Contact form handling
  - Branch locations

- **Size:** ~1000+ lines
- **Setup time:** 2-3 minutes
- **Best for:** Complete website functionality

### 2. `quick_deploy.sql` ⚡ **FAST SETUP**

**Minimal database setup for quick deployment**

- **Use for:** Quick testing, minimal setup, production with custom content
- **Contains:**

  - Essential tables only
  - Basic RLS policies
  - Minimal sample data
  - Core functionality

- **Size:** ~200 lines
- **Setup time:** 30 seconds
- **Best for:** Fast deployment, custom content management

### 3. `sample_data.sql` 🧪 **TESTING DATA**

**Additional sample data for testing and demonstration**

- **Use for:** Testing, development, demonstration
- **Contains:**

  - Extended sample data
  - Additional vendors and partners
  - More gallery images
  - Test contact submissions
  - Admin user management
  - Reporting views

- **Size:** ~400 lines
- **Setup time:** 1 minute
- **Best for:** Development and testing environments

## 🚀 Quick Start Guide

### Option 1: Complete Setup (Recommended)

```sql
-- Run this single file for complete setup
\i complete_database_setup.sql
```

### Option 2: Minimal Setup + Custom Content

```sql
-- 1. Run minimal setup
\i quick_deploy.sql

-- 2. Add your own content through the admin panel
-- 3. Optionally add sample data later
\i sample_data.sql
```

### Option 3: Development Setup

```sql
-- 1. Complete setup
\i complete_database_setup.sql

-- 2. Add extra testing data
\i sample_data.sql
```

## 🔧 Database Requirements

### Supported Databases

- **PostgreSQL 12+** ✅
- **Supabase** ✅ (Recommended)
- **Other PostgreSQL-compatible databases** ✅

### Required Extensions

- `uuid-ossp` (for UUID generation)
- `pgcrypto` (for additional crypto functions)

_These extensions are automatically enabled by the setup scripts._

## 📊 Database Schema Overview

### Core Tables

- `settings` - Application configuration
- `categories` - Product categories
- `products` - Product catalog
- `services` - Company services
- `applications` - Industry applications
- `contact_submissions` - Contact form data
- `branches` - Company locations

### Content Management Tables

- `about_page` - About page content
- `services_page` - Services page content
- `products_page` - Products page content
- `applications_page` - Applications page content
- `contact_page` - Contact page content

### Media & Gallery

- `gallery_images` - Image gallery
- `gallery_categories` - Gallery organization
- `vendors` - Partner companies

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** for website content
- **Authenticated access** for admin operations
- **Secure contact form** submissions

## 🔐 Security Configuration

### RLS Policies

All tables have appropriate RLS policies:

- **Public users:** Read access to published content
- **Authenticated users:** Full CRUD access for admin operations
- **Contact forms:** Public insert, admin read/manage

### Environment Variables Required

```env
# Database Connection
DATABASE_URL=your_database_connection_string

# Supabase (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Contact & WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+201010606967
```

## 📱 WhatsApp Integration

The database includes WhatsApp integration settings:

- **WhatsApp Number:** Stored in settings table
- **Default Message:** Customizable through admin panel
- **Contact Integration:** Seamless contact form to WhatsApp flow

## 🛠️ Deployment Instructions

### For Supabase:

1. Create a new Supabase project
2. Go to SQL Editor
3. Copy and paste the contents of `complete_database_setup.sql`
4. Run the script
5. Update your `.env.local` file with connection details

### For PostgreSQL:

1. Connect to your PostgreSQL database
2. Run: `psql -d your_database -f complete_database_setup.sql`
3. Update your connection string in `.env.local`

### For Other Platforms:

1. Use your platform's SQL console
2. Execute the appropriate SQL file
3. Configure environment variables

## 🔍 Verification

After running the setup, verify your installation:

```sql
-- Check table creation
SELECT * FROM database_setup_status;

-- Verify sample data
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM services;

-- Test settings
SELECT * FROM settings WHERE key IN ('whatsapp_number', 'contact_email');
```

## 📈 Performance Optimization

The database includes several performance optimizations:

- **Indexes** on frequently queried columns
- **Efficient queries** for product catalogs
- **Optimized RLS policies**
- **Proper foreign key relationships**

## 🆘 Troubleshooting

### Common Issues:

1. **Extension not found:**

   ```sql
   -- Enable required extensions manually
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. **Permission denied:**

   - Ensure your database user has CREATE privileges
   - For Supabase, use the SQL Editor with admin privileges

3. **RLS blocking queries:**

   - Check your authentication setup
   - Verify RLS policies are correctly configured

4. **Missing environment variables:**
   - Ensure all required env vars are set
   - Check `.env.local` file configuration

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify your database permissions
3. Ensure all environment variables are configured
4. Test with the minimal `quick_deploy.sql` first

## 🔄 Updates and Migrations

For future updates:

1. Backup your existing database
2. Run new migration files
3. Test thoroughly before production deployment

---

**Ready to deploy?** Start with `complete_database_setup.sql` for the full experience! 🚀
