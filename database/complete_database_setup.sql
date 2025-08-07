/*
  DiveMix Website - Complete Database Setup
  
  This file contains the complete database schema and initial data
  for the DiveMix Gas & Compressor Technologies website.
  
  Execute this file on a fresh PostgreSQL/Supabase database to set up
  the entire project structure with sample data.
  
  Author: DiveMix Development Team
  Date: January 2025
  Version: 1.0
*/

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for additional cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Settings table for application configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table for partner companies
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions table
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

-- Categories table for product categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
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

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Settings',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery categories table
CREATE TABLE IF NOT EXISTS gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches table for company locations
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

-- Page content tables for dynamic content management
CREATE TABLE IF NOT EXISTS about_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  mission_title TEXT NOT NULL,
  mission_content TEXT NOT NULL,
  vision_title TEXT NOT NULL,
  vision_content TEXT NOT NULL,
  values_title TEXT NOT NULL,
  values_content TEXT NOT NULL,
  team_title TEXT NOT NULL,
  team_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  intro_title TEXT NOT NULL,
  intro_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  intro_title TEXT NOT NULL,
  intro_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  intro_title TEXT NOT NULL,
  intro_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  contact_title TEXT NOT NULL,
  contact_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Settings indexes
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Vendors indexes
CREATE INDEX IF NOT EXISTS idx_vendors_display_order ON vendors(display_order);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);

-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at);

-- ============================================================================
-- 4. CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at column
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_categories_updated_at BEFORE UPDATE ON gallery_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_page_updated_at BEFORE UPDATE ON about_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_page_updated_at BEFORE UPDATE ON services_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_page_updated_at BEFORE UPDATE ON products_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_page_updated_at BEFORE UPDATE ON applications_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_page_updated_at BEFORE UPDATE ON contact_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_page ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Settings policies
CREATE POLICY "Allow public read access to settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Vendors policies
CREATE POLICY "Allow public read access to vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage vendors" ON vendors FOR ALL USING (auth.role() = 'authenticated');

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

-- Gallery images policies
CREATE POLICY "Allow public read access to gallery images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage gallery images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- Gallery categories policies
CREATE POLICY "Allow public read access to gallery categories" ON gallery_categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage gallery categories" ON gallery_categories FOR ALL USING (auth.role() = 'authenticated');

-- Branches policies
CREATE POLICY "Allow public read access to branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage branches" ON branches FOR ALL USING (auth.role() = 'authenticated');

-- Page content policies
CREATE POLICY "Allow public read access to about page" ON about_page FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage about page" ON about_page FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to services page" ON services_page FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage services page" ON services_page FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to products page" ON products_page FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage products page" ON products_page FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to applications page" ON applications_page FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage applications page" ON applications_page FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to contact page" ON contact_page FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage contact page" ON contact_page FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 7. INSERT INITIAL DATA
-- ============================================================================

-- Insert application settings
INSERT INTO settings (key, value, description) VALUES
  ('contact_email', 'ramy.magdy@rockettravelsystem.com', 'Email address for contact form submissions'),
  ('whatsapp_number', '+201010606967', 'WhatsApp number for contact (with country code)'),
  ('whatsapp_message', 'Hello! I would like to get more information about your services.', 'Default WhatsApp message'),
  ('company_name', 'DiveMix Gas & Compressor Technologies', 'Company name'),
  ('company_tagline', 'Leading the industry in compressed air and gas solutions since 1990', 'Company tagline'),
  ('company_address', 'Cairo, Egypt', 'Main company address'),
  ('company_phone', '+20 123 456 7890', 'Main company phone'),
  ('facebook_url', 'https://facebook.com/divemix', 'Facebook page URL'),
  ('linkedin_url', 'https://linkedin.com/company/divemix', 'LinkedIn page URL'),
  ('twitter_url', 'https://twitter.com/divemix', 'Twitter page URL')
ON CONFLICT (key) DO NOTHING;

-- Insert sample vendors
INSERT INTO vendors (name, logo_url, website_url, description, display_order) VALUES
  ('L&W Compressors', '/img/products/L&W Compressors/lw.jpg', 'https://lw-compressors.com', 'High-pressure compressor technology partner', 1),
  ('INMATEC', '/img/products/INMATEC/inmatec.png', 'https://inmatec.de', 'Gas generation technology partner', 2),
  ('ALMiG', '/img/products/ALMIG/almig.png', 'https://almig.com', 'Compressed air systems partner', 3),
  ('BEKO', '/img/products/BEKO/beko.png', 'https://beko-technologies.com', 'Air treatment solutions partner', 4),
  ('Maximator', '/img/products/MAXIMATOR/maximator.png', 'https://maximator.de', 'High-pressure technology partner', 5)
ON CONFLICT DO NOTHING;

-- Insert gallery categories
INSERT INTO gallery_categories (name, description) VALUES
  ('installations', 'Equipment installation projects'),
  ('maintenance', 'Maintenance and service work'),
  ('testing', 'Quality testing and certification'),
  ('facilities', 'Company facilities and workshops'),
  ('training', 'Training sessions and workshops'),
  ('projects', 'Completed projects and case studies')
ON CONFLICT (name) DO NOTHING;

-- Insert branches
INSERT INTO branches (name, address, phone, email, city, country, is_main) VALUES
  ('Main Office', '123 Industrial Street, New Cairo', '+20 2 1234 5678', 'info@divemix.com', 'Cairo', 'Egypt', true),
  ('Alexandria Branch', '456 Port Said Street, Alexandria', '+20 3 1234 5678', 'alexandria@divemix.com', 'Alexandria', 'Egypt', false),
  ('Suez Branch', '789 Canal Street, Suez', '+20 62 1234 5678', 'suez@divemix.com', 'Suez', 'Egypt', false)
ON CONFLICT DO NOTHING;

-- Insert product categories
INSERT INTO categories (name, description, hero_image, image) VALUES
('L&W Compressors', 'Diverse range of high-pressure compressors designed for various industrial needs.', '/img/products/L&W Compressors/lw.jpg', '/img/products/L&W Compressors/lw.jpg'),
('INMATEC Gas Generators', 'Advanced compression solutions for industrial applications.', '/img/products/INMATEC/inmatec.png', '/img/products/INMATEC/inmatec.png'),
('ALMiG', 'State-of-the-art compressed air systems for various industries.', '/img/products/ALMIG/almig.png', '/img/products/ALMIG/almig.png'),
('BEKO', 'Compressed air and gas treatment solutions.', '/img/products/BEKO/beko.png', '/img/products/BEKO/beko.png'),
('Maximator', 'High-pressure technology components and systems.', '/img/products/MAXIMATOR/maximator.png', '/img/products/MAXIMATOR/maximator.png')
ON CONFLICT DO NOTHING;

-- Insert services
INSERT INTO services (title, description, icon, features) VALUES
('Installation & Commissioning', 'At DiveMix, we specialize in the installation and commissioning of high-quality gas equipment, including L&W High Pressure Compressors, Inmatec Oxygen & Nitrogen Generators, and Maximator High Pressure Technology products.', 'Settings', ARRAY['Professional Installation', 'System Commissioning', 'Performance Testing', 'Documentation']),
('Preventive Maintenance', 'Timely maintenance is essential for preventing major failures, and extending equipment life. Our customizable maintenance contracts offer proactive solutions tailored to your specific needs.', 'Wrench', ARRAY['Scheduled Maintenance', 'Preventive Care', 'Parts Replacement', 'Performance Monitoring']),
('Air/Gas Quality Tests', 'Ensuring the purity and safety of breathing air, including Oxygen Compatible Air and Medical Breathing Air, can be only achieved by continuous monitoring of compressed and filtered air.', 'Droplets', ARRAY['Quality Testing', 'Purity Analysis', 'Safety Certification', 'Compliance Reports']),
('Cylinder Services Station', 'Our cylinder services station offers comprehensive inspection, testing, and maintenance services for pressurized cylinders.', 'FireExtinguisher', ARRAY['Cylinder Inspection', 'Pressure Testing', 'Maintenance Services', 'Certification'])
ON CONFLICT DO NOTHING;

-- Insert applications
INSERT INTO applications (name, description, features, images) VALUES
('Oil and Gas Fields', 'DiveMix provides robust and reliable compressed air and gas solutions tailored to the demanding environments of oil and gas fields.', ARRAY['High-pressure systems', 'Corrosion-resistant equipment', 'Explosion-proof designs', '24/7 support'], ARRAY['/img/applications/oilAndGas.jpg']),
('Food & Beverage', 'In the food and beverage industry, purity and reliability are paramount. DiveMix offers advanced compressed air and gas systems.', ARRAY['Food-grade materials', 'Hygienic design', 'Quality assurance', 'Regulatory compliance'], ARRAY['/img/applications/food_and_beverage.jpg']),
('Pharmaceutical Companies', 'Pharmaceutical companies require precise and dependable gas solutions for critical applications.', ARRAY['Medical-grade purity', 'Sterile conditions', 'Precise control', 'Validation support'], ARRAY['/img/applications/Pharmaceutical.jpg']),
('Chemical and Petrochemical Industries', 'DiveMix understands the complex needs of the chemical and petrochemical industries.', ARRAY['Chemical compatibility', 'Safety systems', 'Process integration', 'Custom solutions'], ARRAY['/img/applications/Chemical and Petrochemical Industries.jpg']),
('Laser Cutting', 'Precision and consistency are crucial in laser cutting applications.', ARRAY['High-purity gases', 'Consistent pressure', 'Minimal contamination', 'Reliable supply'], ARRAY['/img/applications/laser_cutting.jpg']),
('Marine and Offshore Locations', 'Marine and offshore environments demand durable and reliable compressed air and gas solutions.', ARRAY['Corrosion resistance', 'Compact design', 'Remote monitoring', 'Weather protection'], ARRAY['/img/applications/Marine-or-Offshore.jpg']),
('Recreational Diving', 'Safety is paramount in the recreational diving tourism industry.', ARRAY['Breathing air quality', 'Safety standards', 'Portable solutions', 'Training support'], ARRAY['/img/applications/2.jpg'])
ON CONFLICT DO NOTHING;

-- Insert sample gallery images
INSERT INTO gallery_images (title, url, category) VALUES
('Industrial Compressor Installation', '/img/gallery/4big.jpg', 'installations'),
('Maintenance Workshop', '/img/gallery/11big.jpg', 'maintenance'),
('Quality Testing Process', '/img/gallery/12big.jpg', 'testing'),
('Advanced Manufacturing Facility', '/img/gallery/Al Ahmadeya.jpg', 'facilities'),
('Training Session', '/img/gallery/Al Ahram.jpg', 'training'),
('Product Development Lab', '/img/gallery/Al_Ahmadeya.jpg', 'facilities'),
('Service Vehicle', '/img/gallery/maintenence.jpg', 'maintenance'),
('Equipment Testing', '/img/gallery/IMG_4019.jpg', 'testing')
ON CONFLICT DO NOTHING;

-- Insert page content
INSERT INTO about_page (hero_title, hero_subtitle, hero_image, mission_title, mission_content, vision_title, vision_content, values_title, values_content, team_title, team_content) VALUES
('About DiveMix', 'Leading the industry in compressed air and gas solutions since 1990', '/img/hero/about-hero.jpg', 
'Our Mission', 'To provide innovative, reliable, and efficient compressed air and gas solutions that meet the highest industry standards while ensuring customer satisfaction and environmental responsibility.',
'Our Vision', 'To be the leading provider of compressed air and gas technologies in the Middle East and Africa, recognized for our technical excellence, customer service, and commitment to sustainability.',
'Our Values', 'Quality, Innovation, Reliability, Customer Focus, Environmental Responsibility, and Continuous Improvement drive everything we do.',
'Our Team', 'Our experienced team of engineers and technicians brings decades of expertise in compressed air and gas technologies, ensuring the highest level of service and support for our customers.')
ON CONFLICT DO NOTHING;

INSERT INTO services_page (hero_title, hero_subtitle, hero_image, intro_title, intro_content) VALUES
('Our Services', 'Comprehensive solutions for all your compressed air and gas needs', '/img/hero/services-hero.jpg',
'Professional Services', 'DiveMix offers a complete range of professional services to ensure your compressed air and gas systems operate at peak performance. From installation and commissioning to maintenance and quality testing, our experienced team provides the expertise you need.')
ON CONFLICT DO NOTHING;

INSERT INTO products_page (hero_title, hero_subtitle, hero_image, intro_title, intro_content) VALUES
('Our Products', 'High-quality compressed air and gas equipment from leading manufacturers', '/img/hero/products-hero.jpg',
'Premium Equipment', 'We partner with the world''s leading manufacturers to bring you the highest quality compressed air and gas equipment. Our product range includes compressors, gas generators, air treatment systems, and high-pressure technology solutions.')
ON CONFLICT DO NOTHING;

INSERT INTO applications_page (hero_title, hero_subtitle, hero_image, intro_title, intro_content) VALUES
('Applications', 'Serving diverse industries with specialized solutions', '/img/hero/applications-hero.jpg',
'Industry Solutions', 'Our compressed air and gas solutions serve a wide range of industries, each with unique requirements and challenges. We provide specialized equipment and services tailored to meet the specific needs of each application.')
ON CONFLICT DO NOTHING;

INSERT INTO contact_page (hero_title, hero_subtitle, hero_image, contact_title, contact_content) VALUES
('Contact Us', 'Get in touch with our team of experts', '/img/hero/contact-hero.jpg',
'Let''s Connect', 'Ready to discuss your compressed air and gas needs? Our team of experts is here to help you find the perfect solution for your application. Contact us today to learn more about our products and services.')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. INSERT SAMPLE PRODUCTS
-- ============================================================================

-- Get category IDs for product insertion
DO $$
DECLARE
    lw_category_id UUID;
    inmatec_category_id UUID;
    almig_category_id UUID;
    beko_category_id UUID;
    maximator_category_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO lw_category_id FROM categories WHERE name = 'L&W Compressors';
    SELECT id INTO inmatec_category_id FROM categories WHERE name = 'INMATEC Gas Generators';
    SELECT id INTO almig_category_id FROM categories WHERE name = 'ALMiG';
    SELECT id INTO beko_category_id FROM categories WHERE name = 'BEKO';
    SELECT id INTO maximator_category_id FROM categories WHERE name = 'Maximator';

    -- Insert L&W Compressor Products
    INSERT INTO products (name, description, category_id, images, features) VALUES
    ('Mobile Compressors', 'Designed for easy transport and mobility, these compressors deliver reliable performance in a compact form. Available with gasoline, diesel, or electric motors, they are perfect for field operations and on-site tasks, offering convenience and efficiency.', lw_category_id,
    ARRAY['/img/products/L&W Compressors/Mobile/1.png', '/img/products/L&W Compressors/Mobile/2.png', '/img/products/L&W Compressors/Mobile/3.png'], 
    ARRAY['Portable Design', 'Multiple Power Options', 'Field Operations', 'Compact Form']),

    ('Compact Compressors', 'Ideal for small spaces, these compressors provide efficient performance without compromising power. With capacities from 230 to 570 liters per minute, they feature robust electric motors, ensuring versatility and efficiency.', lw_category_id,
    ARRAY['/img/products/L&W Compressors/Compact/1.png', '/img/products/L&W Compressors/Compact/2.png', '/img/products/L&W Compressors/Compact/3.png'],
    ARRAY['Space Efficient', '230-570 L/min Capacity', 'Electric Motors', 'High Efficiency']),

    ('Stationary Compressors', 'Built for permanent installations, these compressors offer robust solutions for continuous, heavy-duty operations. Available in models with capacities ranging from 230 to 1300 liters per minute, they feature powerful electric and diesel motors for various industrial needs, ensuring consistent performance and long-term durability.', lw_category_id,
    ARRAY['/img/products/L&W Compressors/Stationary/1.png', '/img/products/L&W Compressors/Stationary/2.png', '/img/products/L&W Compressors/Stationary/3.png'],
    ARRAY['Permanent Installation', '230-1300 L/min Capacity', 'Heavy-duty Operations', 'Long-term Durability']),

    ('Silent Compressors', 'Engineered for noise-sensitive environments, these compressors combine efficient performance with low noise levels. Capacities range from 150 to 1300 liters per minute, featuring sound-insulated housing and robust electric motors for quiet yet powerful operation.', lw_category_id,
    ARRAY['/img/products/L&W Compressors/Silent/1.png', '/img/products/L&W Compressors/Silent/2.png', '/img/products/L&W Compressors/Silent/3.png'],
    ARRAY['Low Noise Operation', '150-1300 L/min Capacity', 'Sound Insulation', 'Noise-sensitive Environments']),

    ('Booster Compressors', 'Ideal for high-pressure industrial applications, these compressors deliver safety and robust performance. With delivery capacities from 6 to 250 m³/h and final pressures up to 420 bar, they are perfect for laser cutting, gas injection molding, and offshore platforms, featuring customizable options for specific needs.', lw_category_id,
    ARRAY['/img/products/L&W Compressors/Booster/1.png', '/img/products/L&W Compressors/Booster/2.png', '/img/products/L&W Compressors/Booster/3.png'],
    ARRAY['High-pressure Applications', '6-250 m³/h Capacity', 'Up to 420 bar', 'Customizable Options']);

    -- Insert INMATEC Products
    INSERT INTO products (name, description, category_id, images, features) VALUES
    ('Nitrogen Generators', 'At Divemix Gas & Compressor technologies, we proudly partner with INMATEC, a leading manufacturer of high-quality PSA gas generators. INMATEC specializes in providing innovative solutions for on-site nitrogen and oxygen generation, ensuring you have a continuous and reliable supply of these essential gases right at your facility.', inmatec_category_id,
    ARRAY['/img/products/INMATEC/Nitrogen/1.png', '/img/products/INMATEC/Nitrogen/PNC-9300_PNC500.png', '/img/products/INMATEC/Nitrogen/PNC-9400_PNC750.png', '/img/products/INMATEC/Nitrogen/PNC-9900_PNC3000.png'],
    ARRAY['PSA Technology', 'On-site Generation', 'Continuous Supply', 'High Purity']),

    ('Oxygen Generators', 'INMATEC''s oxygen generators provide a dependable source of oxygen for medical, industrial, and environmental applications. From healthcare facilities to wastewater treatment plants, these generators offer a versatile and efficient solution for producing high-purity oxygen on demand.', inmatec_category_id,
    ARRAY['/img/products/INMATEC/Oxygen/1.png', '/img/products/INMATEC/Oxygen/PO8300_PO500.png', '/img/products/INMATEC/Oxygen/PO8400_PO750.png', '/img/products/INMATEC/Oxygen/PO8700_PO2000.png'],
    ARRAY['Medical Grade', 'Industrial Applications', 'High Purity', 'On-demand Production']);

    -- Insert ALMiG Products
    INSERT INTO products (name, description, category_id, images, features) VALUES
    ('Custom Solutions', 'ALMiG offers bespoke compressed air solutions tailored to meet the specific requirements of your industry and application. From custom compressor packages to specialized air treatment systems, ALMiG provides comprehensive solutions to ensure your operations run smoothly and efficiently.', almig_category_id,
    ARRAY['/img/products/ALMIG/Custom solutions/ALM-RD155.jpg', '/img/products/ALMIG/Custom solutions/ALM-RD-3300.jpg', '/img/products/ALMIG/Custom solutions/Filter_einzeln_ohne_Manometer.png.webp', '/img/products/ALMIG/Custom solutions/Keyvisual_Aufbereitung.png.webp'],
    ARRAY['Tailored Solutions', 'Integrated Systems', 'Expert Support', 'Scalable Options']),

    ('Screw Compressors', 'ALMiG''s screw compressors are renowned for their efficiency and reliability, offering a continuous supply of compressed air with minimal energy consumption. Available in various models, these compressors are suitable for both small and large-scale applications.', almig_category_id,
    ARRAY['/img/products/ALMIG/Screw compressors/BELT_XP4_web.png', '/img/products/ALMIG/Screw compressors/BELT_XP15_web.png', '/img/products/ALMIG/Screw compressors/BELT_XP37_web.png', '/img/products/ALMIG/Screw compressors/COMBI_2_5_geschlossen_web.jpg'],
    ARRAY['Variable Speed Drive (VSD)', 'Quiet Operation', 'Compact Design', 'High Efficiency']);

    -- Insert BEKO Products
    INSERT INTO products (name, description, category_id, images, features) VALUES
    ('Compressed Air Treatment', 'BEKO TECHNOLOGIES offers comprehensive compressed air treatment solutions to ensure the highest quality of compressed air for your applications. From filtration to drying, our systems remove contaminants and moisture to protect your equipment and processes.', beko_category_id,
    ARRAY['/img/products/BEKO/Compressed Air Treatment/1.png', '/img/products/BEKO/Compressed Air Treatment/2.png'],
    ARRAY['Filtration Systems', 'Moisture Removal', 'Contaminant Control', 'Equipment Protection']),

    ('Condensate Management', 'Proper condensate management is essential for efficient compressed air systems. BEKO''s condensate management solutions help you handle and treat condensate effectively, ensuring environmental compliance and system efficiency.', beko_category_id,
    ARRAY['/img/products/BEKO/Condensate Management/1.png', '/img/products/BEKO/Condensate Management/2.png'],
    ARRAY['Environmental Compliance', 'Efficient Treatment', 'System Optimization', 'Cost Savings']);

    -- Insert Maximator Products
    INSERT INTO products (name, description, category_id, images, features) VALUES
    ('High Pressure Technology', 'Maximator specializes in high-pressure technology solutions for demanding industrial applications. Our products are designed to handle extreme pressures safely and reliably, making them ideal for testing, processing, and specialized industrial applications.', maximator_category_id,
    ARRAY['/img/products/MAXIMATOR/High Pressure Technology/1.png', '/img/products/MAXIMATOR/High Pressure Technology/2.png'],
    ARRAY['Extreme Pressure Handling', 'Safety Features', 'Industrial Applications', 'Reliable Performance']);

END $$;

-- ============================================================================
-- 9. FINAL SETUP CONFIRMATION
-- ============================================================================

-- Create a view to check database setup status
CREATE OR REPLACE VIEW database_setup_status AS
SELECT 
    'Tables' as component,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'settings', 'vendors', 'contact_submissions', 'categories', 
        'products', 'services', 'applications', 'gallery_images', 
        'gallery_categories', 'branches', 'about_page', 'services_page', 
        'products_page', 'applications_page', 'contact_page'
    )
UNION ALL
SELECT 
    'Settings' as component,
    COUNT(*) as count
FROM settings
UNION ALL
SELECT 
    'Categories' as component,
    COUNT(*) as count
FROM categories
UNION ALL
SELECT 
    'Products' as component,
    COUNT(*) as count
FROM products
UNION ALL
SELECT 
    'Services' as component,
    COUNT(*) as count
FROM services
UNION ALL
SELECT 
    'Applications' as component,
    COUNT(*) as count
FROM applications;

-- Display setup completion message
DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'DiveMix Database Setup Complete!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Database schema and initial data have been successfully created.';
    RAISE NOTICE 'You can now run your DiveMix application.';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update your .env.local file with the correct database connection string';
    RAISE NOTICE '2. Test the application by running: npm run dev';
    RAISE NOTICE '3. Access the admin panel to manage content';
    RAISE NOTICE '============================================================================';
END $$;