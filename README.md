# 🌊 DiveMix Website

A modern, responsive website for DiveMix Gas & Compressor Technologies built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

- **🎨 Modern Design**: Clean, professional interface with smooth animations
- **📱 Responsive Layout**: Optimized for all device sizes
- **🗄️ Dynamic Content**: Database-driven content management with Supabase
- **🖼️ Image Gallery**: Interactive gallery with category filtering
- **👨‍💼 Admin Panel**: Complete content management system
- **🔍 SEO Optimized**: Built-in SEO best practices
- **⚡ Performance**: Optimized for speed and user experience
- **🔧 Development Tools**: Built-in diagnostic and setup tools
- **📱 WhatsApp Integration**: Direct customer contact via WhatsApp

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel Ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional for development)

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd divemix-website
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WhatsApp Integration
NEXT_PUBLIC_WHATSAPP_NUMBER=+201010606967
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 🗄️ Database Setup

### 📁 SQL Setup Files (Recommended for Production)

The `database/` directory contains production-ready SQL files:

- **`complete_database_setup.sql`** ⭐ - Complete setup with all features and sample data
- **`quick_deploy.sql`** ⚡ - Minimal setup for quick deployment
- **`sample_data.sql`** 🧪 - Additional testing data
- **`verify_setup.sql`** 🔍 - Database verification and health check
- **`backup_restore.sql`** 💾 - Backup and maintenance utilities
- **`README.md`** 📖 - Detailed database documentation

### 🚀 Quick Database Setup

**Option 1: Complete Setup (Recommended)**

```sql
-- Copy and run in your Supabase SQL Editor or PostgreSQL console
-- File: database/complete_database_setup.sql
```

**Option 2: Minimal Setup**

```sql
-- For quick deployment with custom content
-- File: database/quick_deploy.sql
```

### 🔧 Legacy Setup Tools (Still Available)

- **`/setup-all-db`** - Web-based database setup
- **`/test-db`** - Test database connectivity
- **`/fix-all-issues`** - Comprehensive diagnostic tool
- **`/test-all-pages`** - Test all pages functionality

### 📊 Database Schema

- **`settings`** - Application configuration & WhatsApp integration
- **`categories`** - Product categories (L&W, INMATEC, ALMiG, BEKO, Maximator)
- **`products`** - Products with images, features, and specifications
- **`services`** - Installation, Maintenance, Quality Tests, Cylinder Services
- **`applications`** - Oil & Gas, Pharmaceutical, Food & Beverage, etc.
- **`gallery_images`** - Image gallery with categories
- **`vendors`** - Partner companies and vendors
- **`contact_submissions`** - Contact form submissions
- **`branches`** - Company branch locations
- **`*_page`** - Dynamic page content management

### 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** for website content
- **Authenticated access** for admin operations
- **Secure contact form** submissions

## 🔧 Development Tools

### Built-in Diagnostic Tools:

- **`/fix-all-issues`** - Comprehensive system diagnostic
- **`/test-all-pages`** - Page functionality testing
- **`/setup-all-db`** - Database setup with original content
- **`/test-db`** - Database connectivity testing

## 🐛 Troubleshooting

### Common Issues:

1. **Empty pages/components:**

   - Run `/setup-all-db` to populate database
   - Check Supabase connection in `/fix-all-issues`

2. **Database connection errors:**
   - Verify environment variables
   - Check Supabase project status
   - Use `/test-db` for diagnostics

### Diagnostic Commands:

```bash
# Test all functionality
npm run dev
# Visit: http://localhost:3000/fix-all-issues

# Test individual pages
# Visit: http://localhost:3000/test-all-pages

# Setup database
# Visit: http://localhost:3000/setup-all-db
```

## 📝 Content Management

### Original Website Content Included:

- ✅ **5 Product Categories**: L&W Compressors, INMATEC, ALMiG, BEKO, Maximator
- ✅ **4 Services**: Installation, Maintenance, Air Quality Tests, Cylinder Services
- ✅ **7 Applications**: Oil & Gas, Food & Beverage, Pharmaceutical, Chemical, Laser Cutting, Marine, Recreational Diving
- ✅ **Gallery Images**: Organized by categories with proper metadata

### Status Management:

All content includes `is_active` field for easy enable/disable functionality.

---

**🎉 Ready to dive in? Start with `/fix-all-issues` to ensure everything is working perfectly!**

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/ramymagdy312/divemix)
