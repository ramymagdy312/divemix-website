/*
  # Create Complete DiveMix Database Schema

  1. New Tables
    - `categories` - Product categories
    - `products` - Products with images and features
    - `services` - Company services
    - `applications` - Industry applications
    - `news` - News articles
    - `gallery_images` - Gallery images

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access

  3. Sample Data
    - Insert initial categories and products
    - Insert services and applications
    - Insert sample news and gallery images
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  hero_image text NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Admin access for categories
CREATE POLICY "Allow authenticated users to manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  images text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Admin access for products
CREATE POLICY "Allow authenticated users to manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Settings',
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read access for services
CREATE POLICY "Allow public read access to services"
  ON services
  FOR SELECT
  TO public
  USING (true);

-- Admin access for services
CREATE POLICY "Allow authenticated users to manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  features text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public read access for applications
CREATE POLICY "Allow public read access to applications"
  ON applications
  FOR SELECT
  TO public
  USING (true);

-- Admin access for applications
CREATE POLICY "Allow authenticated users to manage applications"
  ON applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public read access for gallery images
CREATE POLICY "Allow public read access to gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

-- Admin access for gallery images
CREATE POLICY "Allow authenticated users to manage gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, description, hero_image, image) VALUES
('L&W Compressors', 'Diverse range of high-pressure compressors designed for various industrial needs.', '/img/products/L&W Compressors/lw.jpg', '/img/products/L&W Compressors/lw.jpg'),
('INMATEC Gas Generators', 'Advanced compression solutions for industrial applications.', '/img/products/INMATEC/inmatec.png', '/img/products/INMATEC/inmatec.png'),
('ALMiG', 'State-of-the-art compressed air systems for various industries.', '/img/products/ALMIG/almig.png', '/img/products/ALMIG/almig.png'),
('BEKO', 'Compressed air and gas treatment solutions.', '/img/products/BEKO/beko.png', '/img/products/BEKO/beko.png'),
('Maximator', 'High-pressure technology components and systems.', '/img/products/MAXIMATOR/maximator.png', '/img/products/MAXIMATOR/maximator.png');

-- Insert sample services
INSERT INTO services (title, description, icon, features) VALUES
('Installation & Commissioning', 'At DiveMix, we specialize in the installation and commissioning of high-quality gas equipment, including L&W High Pressure Compressors, Inmatec Oxygen & Nitrogen Generators, and Maximator High Pressure Technology products.', 'Settings', '{}'),
('Preventive Maintenance', 'Timely maintenance is essential for preventing major failures, and extending equipment life. Our customizable maintenance contracts offer proactive solutions tailored to your specific needs.', 'Wrench', '{}'),
('Air/Gas Quality Tests', 'Ensuring the purity and safety of breathing air, including Oxygen Compatible Air and Medical Breathing Air, can be only achieved by continuous monitoring of compressed and filtered air.', 'Droplets', '{}'),
('Cylinder Services Station', 'Our cylinder services station offers comprehensive inspection, testing, and maintenance services for pressurized cylinders.', 'FireExtinguisher', '{}');

-- Insert sample applications
INSERT INTO applications (name, description, features, images) VALUES
('Oil and Gas Fields', 'DiveMix provides robust and reliable compressed air and gas solutions tailored to the demanding environments of oil and gas fields.', '{}', '{"/img/applications/oilAndGas.jpg"}'),
('Food & Beverage', 'In the food and beverage industry, purity and reliability are paramount. DiveMix offers advanced compressed air and gas systems.', '{}', '{"/img/applications/food_and_beverage.jpg"}'),
('Pharmaceutical Companies', 'Pharmaceutical companies require precise and dependable gas solutions for critical applications.', '{}', '{"/img/applications/Pharmaceutical.jpg"}'),
('Chemical and Petrochemical Industries', 'DiveMix understands the complex needs of the chemical and petrochemical industries.', '{}', '{"/img/applications/Chemical and Petrochemical Industries.jpg"}'),
('Laser Cutting', 'Precision and consistency are crucial in laser cutting applications.', '{}', '{"/img/applications/laser_cutting.jpg"}'),
('Marine and Offshore Locations', 'Marine and offshore environments demand durable and reliable compressed air and gas solutions.', '{}', '{"/img/applications/Marine-or-Offshore.jpg"}'),
('Recreational Diving', 'Safety is paramount in the recreational diving tourism industry.', '{}', '{"/img/applications/2.jpg"}');

-- Insert sample news
INSERT INTO news (title, summary, content, image_url, published_date) VALUES
('DiveMix Launches New Pro Series', 'Introducing our latest professional-grade gas mixing system', 'DiveMix is proud to announce the launch of our new Pro Series gas mixing systems, designed for professional diving operations worldwide.', '/img/gallery/IMG_4019.jpg', '2024-03-15'),
('Safety Certification Achievement', 'DiveMix receives ISO certification for safety standards', 'We are pleased to announce that DiveMix has achieved ISO certification for our safety standards and quality management systems.', '/img/gallery/maintenence.jpg', '2024-03-10'),
('New Training Program Announced', 'Comprehensive training program for diving professionals', 'DiveMix announces a new comprehensive training program designed for diving professionals and equipment operators.', '/img/gallery/Al_Ahmadeya.jpg', '2024-03-05');

-- Insert sample gallery images
INSERT INTO gallery_images (title, url, category) VALUES
('Industrial Compressor Installation', '/img/gallery/4big.jpg', 'installations'),
('Maintenance Workshop', '/img/gallery/11big.jpg', 'maintenance'),
('Quality Testing Process', '/img/gallery/12big.jpg', 'testing'),
('Advanced Manufacturing Facility', '/img/gallery/Al Ahmadeya.jpg', 'facilities'),
('Training Session', '/img/gallery/Al Ahram.jpg', 'training'),
('Product Development Lab', '/img/gallery/Al_Ahmadeya.jpg', 'facilities'),
('Service Vehicle', '/img/gallery/maintenence.jpg', 'maintenance'),
('Equipment Testing', '/img/gallery/IMG_4019.jpg', 'testing');