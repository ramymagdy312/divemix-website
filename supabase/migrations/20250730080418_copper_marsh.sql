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

-- Insert L&W Compressor Products
('Mobile Compressors', 'Designed for easy transport and mobility, these compressors deliver reliable performance in a compact form. Available with gasoline, diesel, or electric motors, they are perfect for field operations and on-site tasks, offering convenience and efficiency.',  
ARRAY['/img/products/L&W Compressors/Mobile/1.png', '/img/products/L&W Compressors/Mobile/2.png', '/img/products/L&W Compressors/Mobile/3.png'], 
ARRAY[]::text[]),

('Compact Compressors', 'Ideal for small spaces, these compressors provide efficient performance without compromising power. With capacities from 230 to 570 liters per minute, they feature robust electric motors, ensuring versatility and efficiency.', 
ARRAY['/img/products/L&W Compressors/Compact/1.png', '/img/products/L&W Compressors/Compact/2.png', '/img/products/L&W Compressors/Compact/3.png'],
ARRAY[]::text[]),

('Stationary Compressors', 'Built for permanent installations, these compressors offer robust solutions for continuous, heavy-duty operations. Available in models with capacities ranging from 230 to 1300 liters per minute, they feature powerful electric and diesel motors for various industrial needs, ensuring consistent performance and long-term durability.', 
ARRAY['/img/products/L&W Compressors/Stationary/1.png', '/img/products/L&W Compressors/Stationary/2.png', '/img/products/L&W Compressors/Stationary/3.png'],
ARRAY[]::text[]),

('Silent Compressors', 'Engineered for noise-sensitive environments, these compressors combine efficient performance with low noise levels. Capacities range from 150 to 1300 liters per minute, featuring sound-insulated housing and robust electric motors for quiet yet powerful operation.', 
ARRAY['/img/products/L&W Compressors/Silent/1.png', '/img/products/L&W Compressors/Silent/2.png', '/img/products/L&W Compressors/Silent/3.png'],
ARRAY[]::text[]),

('Booster Compressors', 'Ideal for high-pressure industrial applications, these compressors deliver safety and robust performance. With delivery capacities from 6 to 250 m³/h and final pressures up to 420 bar, they are perfect for laser cutting, gas injection molding, and offshore platforms, featuring customizable options for specific needs.', 
ARRAY['/img/products/L&W Compressors/Booster/1.png', '/img/products/L&W Compressors/Booster/2.png', '/img/products/L&W Compressors/Booster/3.png'],
ARRAY[]::text[]);

-- Insert INMATEC Products
('Nitrogen Generators', 'At Divemix Gas & Compressor technologies, we proudly partner with INMATEC, a leading manufacturer of high-quality PSA gas generators. INMATEC specializes in providing innovative solutions for on-site nitrogen and oxygen generation, ensuring you have a continuous and reliable supply of these essential gases right at your facility.', 
ARRAY['/img/products/INMATEC/Nitrogen/1.png', '/img/products/INMATEC/Nitrogen/PNC-9300_PNC500.png', '/img/products/INMATEC/Nitrogen/PNC-9400_PNC750.png', '/img/products/INMATEC/Nitrogen/PNC-9900_PNC3000.png'],
ARRAY[]::text[]),

('Oxygen Generators', 'INMATEC''s oxygen generators provide a dependable source of oxygen for medical, industrial, and environmental applications. From healthcare facilities to wastewater treatment plants, these generators offer a versatile and efficient solution for producing high-purity oxygen on demand.', 
ARRAY['/img/products/INMATEC/Oxygen/1.png', '/img/products/INMATEC/Oxygen/PO8300_PO500.png', '/img/products/INMATEC/Oxygen/PO8400_PO750.png', '/img/products/INMATEC/Oxygen/PO8700_PO2000.png'],
ARRAY[]::text[]);

-- Insert ALMiG Products
INSERT INTO products (name, description, category_id, images, features) VALUES
('Custom Solutions', 'ALMiG offers bespoke compressed air solutions tailored to meet the specific requirements of your industry and application. From custom compressor packages to specialized air treatment systems, ALMiG provides comprehensive solutions to ensure your operations run smoothly and efficiently.', 
ARRAY['/img/products/ALMIG/Custom solutions/ALM-RD155.jpg', '/img/products/ALMIG/Custom solutions/ALM-RD-3300.jpg', '/img/products/ALMIG/Custom solutions/Filter_einzeln_ohne_Manometer.png.webp', '/img/products/ALMIG/Custom solutions/Keyvisual_Aufbereitung.png.webp'],
ARRAY['Tailored Solutions', 'Integrated Systems', 'Expert Support', 'Scalable Options']),

('Screw Compressors', 'ALMiG''s screw compressors are renowned for their efficiency and reliability, offering a continuous supply of compressed air with minimal energy consumption. Available in various models, these compressors are suitable for both small and large-scale applications.', 
ARRAY['/img/products/ALMIG/Screw compressors/BELT_XP4_web.png', '/img/products/ALMIG/Screw compressors/BELT_XP15_web.png', '/img/products/ALMIG/Screw compressors/BELT_XP37_web.png', '/img/products/ALMIG/Screw compressors/COMBI_2_5_geschlossen_web.jpg', '/img/products/ALMIG/Screw compressors/COMBI_6_15_geschlossen_web.jpg', '/img/products/ALMIG/Screw compressors/combi_offene-maschine_ohne-Behaelter_web.jpg', '/img/products/ALMIG/Screw compressors/GEAR_XP22_web.png', '/img/products/ALMIG/Screw compressors/GEAR_XP200_web.png'],
ARRAY['Variable Speed Drive (VSD)', 'Quiet Operation', 'Compact Design', 'High Efficiency']);

-- Insert BEKO Products
('Condensate Drains', 'BEKOMAT® condensate drains ensure efficient and reliable removal of condensate from compressed air systems. Engineered to prevent compressed air loss, these drains optimize system performance, reduce energy waste, and protect equipment from moisture-related damage.', 
ARRAY['/img/products/BEKO/Condensate drains/bm_12_co_00_00_iso-00.png', '/img/products/BEKO/Condensate drains/bm_13_00_00_iso-00.png', '/img/products/BEKO/Condensate drains/bm_14_co_pn25_00_00_iso-00.png', '/img/products/BEKO/Condensate drains/bm_20_00_00_00.png', '/img/products/BEKO/Condensate drains/bm_20_fm_00_00_00.png', '/img/products/BEKO/Condensate drains/bm_32u_00_00_00.png', '/img/products/BEKO/Condensate drains/bm_33u_co_00_00_iso_00.png'],
ARRAY['Smart level control prevents air loss', 'Energy-saving design reduces costs', 'Durable materials for long-term reliability', 'Easy maintenance with modular construction', 'Industry 4.0-ready for remote monitoring']),

('Compressed Air Dryers', 'The DRYPOINT® RA III refrigeration dryer from BEKO TECHNOLOGIES is engineered to provide highly efficient moisture removal, ensuring your compressed air system operates at its best. By delivering consistent dew point control and reducing energy consumption, it protects sensitive equipment and minimizes operational costs.', 
ARRAY['/img/products/BEKO/Dryers/DP RA 1300 - IV.png', '/img/products/BEKO/Dryers/drypoint-ra-eco-klein_01.png', '/img/products/BEKO/Dryers/drypoint-ra-ht_01.png', '/img/products/BEKO/Dryers/Drypoint-ra-titel.png'],
ARRAY['Advanced heat exchanger for reduced pressure loss', 'Stable dew point with patented bypass valve', 'Integrated condensate drain prevents air loss', 'Eco-friendly refrigerant for reduced environmental impact', 'IIoT-ready for remote monitoring and control']),

('Compressed Air Filtration', 'CLEARPOINT® compressed air filters are engineered to deliver exceptional air purity and efficiency for your compressed air systems. By effectively removing contaminants such as oil, water, and particulates, they safeguard your equipment, enhance product quality, and reduce operational costs.', '550e8400-e29b-41d4-a716-446655440004',
ARRAY['/img/products/BEKO/Filteration/cp_s050_fwt_with-bm_00_00_01.png', '/img/products/BEKO/Filteration/cp_s055_vwm_00_00_01.png', '/img/products/BEKO/Filteration/cp_s075-fldr-dipi_00_00_01.png'],
ARRAY['Efficiently removes oil, water, and particulates', 'Low pressure drop for energy savings', 'Durable materials ensure long-lasting use', 'Easy filter replacement for hassle-free maintenance', 'Versatile design suits various applications']);

-- Insert Maximator Products
('Amplifiers and Gas Boosters', 'Maximator''s amplifiers and gas boosters enhance gas pressure efficiently, suitable for the oil free compression of gases and air. Industrial gases like Argon, Helium, Hydrogen and Nitrogen can be compressed to operating pressures of 2,100 bar (30,000 psi), Oxygen to 350 bar (5,075 psi).', 
ARRAY['/img/products/MAXIMATOR/Gas Boosters/8DLE 165.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 15-1.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 15-2.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 15-30.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 30-75-3.jpg', '/img/products/MAXIMATOR/Gas Boosters/MPLV2.jpg', '/img/products/MAXIMATOR/Gas Boosters/MPLV4.jpg', '/img/products/MAXIMATOR/Gas Boosters/ROB 22.jpg', '/img/products/MAXIMATOR/Gas Boosters/SPLV2.jpg', '/img/products/MAXIMATOR/Gas Boosters/SPLV3.jpg', '/img/products/MAXIMATOR/Gas Boosters/Untitled-2.jpg'],
ARRAY['High-pressure capabilities for diverse gases', 'Reliable performance in harsh conditions', 'Customizable to different systems', 'Energy-efficient and air-driven designs']),

('High Pressure Pumps', 'Maximator''s high-pressure pumps can be used for many technical industrial applications – even in explosion-proof areas. They generate pressure using oil, water or special fluids in a reliable, cost-effective way. The pumps are driven with compressed air at 1 to 10 bars.', 
ARRAY['/img/products/MAXIMATOR/Gas Pumps/DPD.jpg', '/img/products/MAXIMATOR/Gas Pumps/G.jpg', '/img/products/MAXIMATOR/Gas Pumps/GPD.jpg', '/img/products/MAXIMATOR/Gas Pumps/GSF.jpg', '/img/products/MAXIMATOR/Gas Pumps/GX.jpg', '/img/products/MAXIMATOR/Gas Pumps/M.jpg', '/img/products/MAXIMATOR/Gas Pumps/MO.jpg', '/img/products/MAXIMATOR/Gas Pumps/MSF.jpg', '/img/products/MAXIMATOR/Gas Pumps/S.jpg', '/img/products/MAXIMATOR/Gas Pumps/SS.jpg'],
ARRAY['Outlet pressure ranges up to 5500 bar (79750 psi)', 'Suitable for most liquids and liquified gases', 'Air driven which allows use in explosion-proof areas', 'Automatically stops upon reaching pre-selected final pressure']),

('Valves and Fittings', 'We offers a comprehensive range of high-pressure valves and fittings, including ball valves and precision tubing, designed to meet the demands of high-pressure systems. These components are engineered for durability, leak-free performance, and compatibility with various industrial applications.',
ARRAY['/img/products/MAXIMATOR/Fittings/Fittings and valves (1).png', '/img/products/MAXIMATOR/Fittings/Fittings and valves (2).png', '/img/products/MAXIMATOR/Fittings/Fittings and valves (3).png', '/img/products/MAXIMATOR/Fittings/Fittings and valves (4).png'],
ARRAY['Precision-engineered to prevent leaks and maintain system integrity', 'Wide range of sizes and types to fit seamlessly into existing systems', 'High-grade materials to withstand high pressures and harsh conditions', 'Durable, corrosion-resistant materials']);
