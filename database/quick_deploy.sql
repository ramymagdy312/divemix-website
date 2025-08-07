/*
  DiveMix Website - Quick Deploy Script
  
  This is a minimal database setup for quick deployment.
  Contains only essential tables and basic data needed to run the application.
  
  Perfect for:
  - Production deployment
  - Quick testing
  - Minimal setup requirements
  
  Author: DiveMix Development Team
  Date: January 2025
  Version: 1.0
*/

-- ============================================================================
-- ESSENTIAL EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES (MINIMAL SETUP)
-- ============================================================================

-- Settings table (Essential)
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions (Essential)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories (Essential)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (Essential)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services (Essential)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Settings',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications (Essential)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches (Essential)
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Egypt',
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE POLICIES
-- ============================================================================

-- Settings policies
CREATE POLICY "Allow public read access to settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Contact submissions policies
CREATE POLICY "Allow public insert for contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage contact submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- Categories policies
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Products policies
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Allow public read access to services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Applications policies
CREATE POLICY "Allow public read access to applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage applications" ON applications FOR ALL USING (auth.role() = 'authenticated');

-- Branches policies
CREATE POLICY "Allow public read access to branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage branches" ON branches FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- ESSENTIAL DATA ONLY
-- ============================================================================

-- Critical settings
INSERT INTO settings (key, value, description) VALUES
  ('contact_email', 'info@divemix.com', 'Contact email address'),
  ('whatsapp_number', '+201010606967', 'WhatsApp contact number'),
  ('whatsapp_message', 'Hello! I would like to get more information about your services.', 'Default WhatsApp message'),
  ('company_name', 'DiveMix Gas & Compressor Technologies', 'Company name'),
  ('company_tagline', 'Leading the industry in compressed air and gas solutions since 1990', 'Company tagline')
ON CONFLICT (key) DO NOTHING;

-- Essential categories
INSERT INTO categories (name, description, hero_image, image) VALUES
('L&W Compressors', 'High-pressure compressors for industrial applications', '/img/products/L&W Compressors/lw.jpg', '/img/products/L&W Compressors/lw.jpg'),
('INMATEC Gas Generators', 'Advanced gas generation solutions', '/img/products/INMATEC/inmatec.png', '/img/products/INMATEC/inmatec.png'),
('ALMiG', 'Compressed air systems', '/img/products/ALMIG/almig.png', '/img/products/ALMIG/almig.png')
ON CONFLICT DO NOTHING;

-- Essential services
INSERT INTO services (title, description, icon, features) VALUES
('Installation & Commissioning', 'Professional installation and commissioning services for all equipment types.', 'Settings', ARRAY['Professional Installation', 'System Testing', 'Documentation']),
('Maintenance Services', 'Comprehensive maintenance programs to keep your equipment running optimally.', 'Wrench', ARRAY['Preventive Maintenance', 'Emergency Repairs', '24/7 Support'])
ON CONFLICT DO NOTHING;

-- Essential applications
INSERT INTO applications (name, description, features, images) VALUES
('Industrial Applications', 'Compressed air solutions for various industrial needs.', ARRAY['High Pressure', 'Reliable Operation', 'Energy Efficient'], ARRAY['/img/applications/industrial.jpg']),
('Marine Applications', 'Specialized solutions for marine and offshore environments.', ARRAY['Corrosion Resistant', 'Compact Design', 'Weather Protection'], ARRAY['/img/applications/marine.jpg'])
ON CONFLICT DO NOTHING;

-- Main branch
INSERT INTO branches (name, address, phone, email, city, country, is_main) VALUES
('Main Office', 'Cairo, Egypt', '+20 123 456 7890', 'info@divemix.com', 'Cairo', 'Egypt', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'DiveMix Quick Deploy Complete!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Minimal database setup completed successfully.';
    RAISE NOTICE 'Your application is ready to run with basic functionality.';
    RAISE NOTICE '';
    RAISE NOTICE 'To add more content, you can:';
    RAISE NOTICE '1. Use the admin panel to add products, services, etc.';
    RAISE NOTICE '2. Run the complete_database_setup.sql for full features';
    RAISE NOTICE '3. Run sample_data.sql for testing data';
    RAISE NOTICE '============================================================================';
END $$;