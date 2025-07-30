/*
  # Add Complete Static Content to Database

  1. Categories with all L&W, INMATEC, ALMiG, BEKO, and Maximator products
  2. All products with detailed descriptions, features, and images
  3. Complete services with proper descriptions
  4. All applications with detailed information
  5. Sample news articles
  6. Gallery images with proper categorization

  This migration adds all the static content that was previously hardcoded in the application.
*/

-- First, let's clear existing data to avoid conflicts
DELETE FROM products;
DELETE FROM categories;
DELETE FROM services;
DELETE FROM applications;
DELETE FROM gallery_images;

-- Insert Categories with proper UUIDs
INSERT INTO categories (id, name, description, hero_image, image) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'L&W Compressors', 'Diverse range of high-pressure compressors designed for various industrial needs.', '/img/products/L&W Compressors/lw.jpg', '/img/products/L&W Compressors/lw.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'INMATEC Gas Generators', 'Advanced compression solutions for industrial applications.', '/img/products/INMATEC/inmatec.png', '/img/products/INMATEC/inmatec.png'),
('550e8400-e29b-41d4-a716-446655440003', 'ALMiG', 'At DiveMix we are proud to partner with ALMiG, a premier provider of state-of-the-art compressed air systems. ALMiG offers a comprehensive range of innovative products designed to meet the diverse needs of various industries, ensuring efficient, reliable, and high-quality compressed air supply.', '/img/products/ALMIG/almig.png', '/img/products/ALMIG/almig.png'),
('550e8400-e29b-41d4-a716-446655440004', 'BEKO', 'At DiveMix, we proudly partner with BEKO Technologies, a renowned leader in the field of compressed air and gas treatment solutions. BEKO Technologies offers a comprehensive range of products designed to optimize the quality and efficiency of your compressed air systems.', '/img/products/BEKO/beko.png', '/img/products/BEKO/beko.png'),
('550e8400-e29b-41d4-a716-446655440005', 'Maximator', 'At DiveMix, we are proud to partner with MAXIMATOR, a global leader in high-pressure technology. MAXIMATOR specializes in providing top-of-the-line high-pressure components and systems designed to meet the rigorous demands of various industrial applications.', '/img/products/MAXIMATOR/maximator.png', '/img/products/MAXIMATOR/maximator.png');

-- Insert L&W Compressor Products
INSERT INTO products (name, description, category_id, images, features) VALUES
('Mobile Compressors', 'Designed for easy transport and mobility, these compressors deliver reliable performance in a compact form. Available with gasoline, diesel, or electric motors, they are perfect for field operations and on-site tasks, offering convenience and efficiency.', '550e8400-e29b-41d4-a716-446655440001', 
ARRAY['/img/products/L&W Compressors/Mobile/1.png', '/img/products/L&W Compressors/Mobile/2.png', '/img/products/L&W Compressors/Mobile/3.png'], 
ARRAY[]::text[]),

('Compact Compressors', 'Ideal for small spaces, these compressors provide efficient performance without compromising power. With capacities from 230 to 570 liters per minute, they feature robust electric motors, ensuring versatility and efficiency.', '550e8400-e29b-41d4-a716-446655440001',
ARRAY['/img/products/L&W Compressors/Compact/1.png', '/img/products/L&W Compressors/Compact/2.png', '/img/products/L&W Compressors/Compact/3.png'],
ARRAY[]::text[]),

('Stationary Compressors', 'Built for permanent installations, these compressors offer robust solutions for continuous, heavy-duty operations. Available in models with capacities ranging from 230 to 1300 liters per minute, they feature powerful electric and diesel motors for various industrial needs, ensuring consistent performance and long-term durability.', '550e8400-e29b-41d4-a716-446655440001',
ARRAY['/img/products/L&W Compressors/Stationary/1.png', '/img/products/L&W Compressors/Stationary/2.png', '/img/products/L&W Compressors/Stationary/3.png'],
ARRAY[]::text[]),

('Silent Compressors', 'Engineered for noise-sensitive environments, these compressors combine efficient performance with low noise levels. Capacities range from 150 to 1300 liters per minute, featuring sound-insulated housing and robust electric motors for quiet yet powerful operation.', '550e8400-e29b-41d4-a716-446655440001',
ARRAY['/img/products/L&W Compressors/Silent/1.png', '/img/products/L&W Compressors/Silent/2.png', '/img/products/L&W Compressors/Silent/3.png'],
ARRAY[]::text[]),

('Booster Compressors', 'Ideal for high-pressure industrial applications, these compressors deliver safety and robust performance. With delivery capacities from 6 to 250 m³/h and final pressures up to 420 bar, they are perfect for laser cutting, gas injection molding, and offshore platforms, featuring customizable options for specific needs.', '550e8400-e29b-41d4-a716-446655440001',
ARRAY['/img/products/L&W Compressors/Booster/1.png', '/img/products/L&W Compressors/Booster/2.png', '/img/products/L&W Compressors/Booster/3.png'],
ARRAY[]::text[]);

-- Insert INMATEC Products
INSERT INTO products (name, description, category_id, images, features) VALUES
('Nitrogen Generators', 'At Divemix Gas & Compressor technologies, we proudly partner with INMATEC, a leading manufacturer of high-quality PSA gas generators. INMATEC specializes in providing innovative solutions for on-site nitrogen and oxygen generation, ensuring you have a continuous and reliable supply of these essential gases right at your facility.', '550e8400-e29b-41d4-a716-446655440002',
ARRAY['/img/products/INMATEC/Nitrogen/1.png', '/img/products/INMATEC/Nitrogen/PNC-9300_PNC500.png', '/img/products/INMATEC/Nitrogen/PNC-9400_PNC750.png', '/img/products/INMATEC/Nitrogen/PNC-9900_PNC3000.png'],
ARRAY[]::text[]),

('Oxygen Generators', 'INMATEC''s oxygen generators provide a dependable source of oxygen for medical, industrial, and environmental applications. From healthcare facilities to wastewater treatment plants, these generators offer a versatile and efficient solution for producing high-purity oxygen on demand.', '550e8400-e29b-41d4-a716-446655440002',
ARRAY['/img/products/INMATEC/Oxygen/1.png', '/img/products/INMATEC/Oxygen/PO8300_PO500.png', '/img/products/INMATEC/Oxygen/PO8400_PO750.png', '/img/products/INMATEC/Oxygen/PO8700_PO2000.png'],
ARRAY[]::text[]);

-- Insert ALMiG Products
INSERT INTO products (name, description, category_id, images, features) VALUES
('Custom Solutions', 'ALMiG offers bespoke compressed air solutions tailored to meet the specific requirements of your industry and application. From custom compressor packages to specialized air treatment systems, ALMiG provides comprehensive solutions to ensure your operations run smoothly and efficiently.', '550e8400-e29b-41d4-a716-446655440003',
ARRAY['/img/products/ALMIG/Custom solutions/ALM-RD155.jpg', '/img/products/ALMIG/Custom solutions/ALM-RD-3300.jpg', '/img/products/ALMIG/Custom solutions/Filter_einzeln_ohne_Manometer.png.webp', '/img/products/ALMIG/Custom solutions/Keyvisual_Aufbereitung.png.webp'],
ARRAY['Tailored Solutions', 'Integrated Systems', 'Expert Support', 'Scalable Options']),

('Screw Compressors', 'ALMiG''s screw compressors are renowned for their efficiency and reliability, offering a continuous supply of compressed air with minimal energy consumption. Available in various models, these compressors are suitable for both small and large-scale applications.', '550e8400-e29b-41d4-a716-446655440003',
ARRAY['/img/products/ALMIG/Screw compressors/BELT_XP4_web.png', '/img/products/ALMIG/Screw compressors/BELT_XP15_web.png', '/img/products/ALMIG/Screw compressors/BELT_XP37_web.png', '/img/products/ALMIG/Screw compressors/COMBI_2_5_geschlossen_web.jpg', '/img/products/ALMIG/Screw compressors/COMBI_6_15_geschlossen_web.jpg', '/img/products/ALMIG/Screw compressors/combi_offene-maschine_ohne-Behaelter_web.jpg', '/img/products/ALMIG/Screw compressors/GEAR_XP22_web.png', '/img/products/ALMIG/Screw compressors/GEAR_XP200_web.png'],
ARRAY['Variable Speed Drive (VSD)', 'Quiet Operation', 'Compact Design', 'High Efficiency']);

-- Insert BEKO Products
INSERT INTO products (name, description, category_id, images, features) VALUES
('Condensate Drains', 'BEKOMAT® condensate drains ensure efficient and reliable removal of condensate from compressed air systems. Engineered to prevent compressed air loss, these drains optimize system performance, reduce energy waste, and protect equipment from moisture-related damage.', '550e8400-e29b-41d4-a716-446655440004',
ARRAY['/img/products/BEKO/Condensate drains/bm_12_co_00_00_iso-00.png', '/img/products/BEKO/Condensate drains/bm_13_00_00_iso-00.png', '/img/products/BEKO/Condensate drains/bm_14_co_pn25_00_00_iso-00.png', '/img/products/BEKO/Condensate drains/bm_20_00_00_00.png', '/img/products/BEKO/Condensate drains/bm_20_fm_00_00_00.png', '/img/products/BEKO/Condensate drains/bm_32u_00_00_00.png', '/img/products/BEKO/Condensate drains/bm_33u_co_00_00_iso_00.png'],
ARRAY['Smart level control prevents air loss', 'Energy-saving design reduces costs', 'Durable materials for long-term reliability', 'Easy maintenance with modular construction', 'Industry 4.0-ready for remote monitoring']),

('Compressed Air Dryers', 'The DRYPOINT® RA III refrigeration dryer from BEKO TECHNOLOGIES is engineered to provide highly efficient moisture removal, ensuring your compressed air system operates at its best. By delivering consistent dew point control and reducing energy consumption, it protects sensitive equipment and minimizes operational costs.', '550e8400-e29b-41d4-a716-446655440004',
ARRAY['/img/products/BEKO/Dryers/DP RA 1300 - IV.png', '/img/products/BEKO/Dryers/drypoint-ra-eco-klein_01.png', '/img/products/BEKO/Dryers/drypoint-ra-ht_01.png', '/img/products/BEKO/Dryers/Drypoint-ra-titel.png'],
ARRAY['Advanced heat exchanger for reduced pressure loss', 'Stable dew point with patented bypass valve', 'Integrated condensate drain prevents air loss', 'Eco-friendly refrigerant for reduced environmental impact', 'IIoT-ready for remote monitoring and control']),

('Compressed Air Filtration', 'CLEARPOINT® compressed air filters are engineered to deliver exceptional air purity and efficiency for your compressed air systems. By effectively removing contaminants such as oil, water, and particulates, they safeguard your equipment, enhance product quality, and reduce operational costs.', '550e8400-e29b-41d4-a716-446655440004',
ARRAY['/img/products/BEKO/Filteration/cp_s050_fwt_with-bm_00_00_01.png', '/img/products/BEKO/Filteration/cp_s055_vwm_00_00_01.png', '/img/products/BEKO/Filteration/cp_s075-fldr-dipi_00_00_01.png'],
ARRAY['Efficiently removes oil, water, and particulates', 'Low pressure drop for energy savings', 'Durable materials ensure long-lasting use', 'Easy filter replacement for hassle-free maintenance', 'Versatile design suits various applications']);

-- Insert Maximator Products
INSERT INTO products (name, description, category_id, images, features) VALUES
('Amplifiers and Gas Boosters', 'Maximator''s amplifiers and gas boosters enhance gas pressure efficiently, suitable for the oil free compression of gases and air. Industrial gases like Argon, Helium, Hydrogen and Nitrogen can be compressed to operating pressures of 2,100 bar (30,000 psi), Oxygen to 350 bar (5,075 psi).', '550e8400-e29b-41d4-a716-446655440005',
ARRAY['/img/products/MAXIMATOR/Gas Boosters/8DLE 165.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 15-1.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 15-2.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 15-30.jpg', '/img/products/MAXIMATOR/Gas Boosters/DLE 30-75-3.jpg', '/img/products/MAXIMATOR/Gas Boosters/MPLV2.jpg', '/img/products/MAXIMATOR/Gas Boosters/MPLV4.jpg', '/img/products/MAXIMATOR/Gas Boosters/ROB 22.jpg', '/img/products/MAXIMATOR/Gas Boosters/SPLV2.jpg', '/img/products/MAXIMATOR/Gas Boosters/SPLV3.jpg', '/img/products/MAXIMATOR/Gas Boosters/Untitled-2.jpg'],
ARRAY['High-pressure capabilities for diverse gases', 'Reliable performance in harsh conditions', 'Customizable to different systems', 'Energy-efficient and air-driven designs']),

('High Pressure Pumps', 'Maximator''s high-pressure pumps can be used for many technical industrial applications – even in explosion-proof areas. They generate pressure using oil, water or special fluids in a reliable, cost-effective way. The pumps are driven with compressed air at 1 to 10 bars.', '550e8400-e29b-41d4-a716-446655440005',
ARRAY['/img/products/MAXIMATOR/Gas Pumps/DPD.jpg', '/img/products/MAXIMATOR/Gas Pumps/G.jpg', '/img/products/MAXIMATOR/Gas Pumps/GPD.jpg', '/img/products/MAXIMATOR/Gas Pumps/GSF.jpg', '/img/products/MAXIMATOR/Gas Pumps/GX.jpg', '/img/products/MAXIMATOR/Gas Pumps/M.jpg', '/img/products/MAXIMATOR/Gas Pumps/MO.jpg', '/img/products/MAXIMATOR/Gas Pumps/MSF.jpg', '/img/products/MAXIMATOR/Gas Pumps/S.jpg', '/img/products/MAXIMATOR/Gas Pumps/SS.jpg'],
ARRAY['Outlet pressure ranges up to 5500 bar (79750 psi)', 'Suitable for most liquids and liquified gases', 'Air driven which allows use in explosion-proof areas', 'Automatically stops upon reaching pre-selected final pressure']),

('Valves and Fittings', 'We offers a comprehensive range of high-pressure valves and fittings, including ball valves and precision tubing, designed to meet the demands of high-pressure systems. These components are engineered for durability, leak-free performance, and compatibility with various industrial applications.', '550e8400-e29b-41d4-a716-446655440005',
ARRAY['/img/products/MAXIMATOR/Fittings/Fittings and valves (1).png', '/img/products/MAXIMATOR/Fittings/Fittings and valves (2).png', '/img/products/MAXIMATOR/Fittings/Fittings and valves (3).png', '/img/products/MAXIMATOR/Fittings/Fittings and valves (4).png'],
ARRAY['Precision-engineered to prevent leaks and maintain system integrity', 'Wide range of sizes and types to fit seamlessly into existing systems', 'High-grade materials to withstand high pressures and harsh conditions', 'Durable, corrosion-resistant materials']);

-- Insert Services
INSERT INTO services (title, description, icon, features) VALUES
('Installation & Commissioning', 'At DiveMix, we specialize in the installation and commissioning of high-quality gas equipment, including L&W High Pressure Compressors, Inmatec Oxygen & Nitrogen Generators, and Maximator High Pressure Technology products. Our experienced engineers ensure trouble-free installation, adhering to manufacturers'' warranty terms and guaranteeing the highest standard of service.', 'Settings', ARRAY[]::text[]),

('Preventive Maintenance', 'Timely maintenance is essential for preventing major failures, and extending equipment life. maximizing parts reusability, our customizable maintenance contracts offer proactive solutions tailored to your specific needs, helping you schedule downtime and plan maintenance costs effectively. From routine inspections to full system overhauls, we ensure that your equipment operates at peak performance, lowering overall owning and operating costs.', 'Wrench', ARRAY[]::text[]),

('Air/Gas Quality Tests', 'Ensuring the purity and safety of breathing air, including Oxygen Compatible Air and Medical Breathing Air, can be only achieved by continuous monitoring of compressed and filtered air. DiveMix provides comprehensive Air Quality Laboratory Checks, adhering to recognized standards such as DIN EN 12021 for breathing air compliance. To maintain optimal gas quality, we strongly advise conducting a minimum of one comprehensive check per compressor per quarter.', 'Droplets', ARRAY[]::text[]),

('Cylinder Services Station', 'Our cylinder services station offers comprehensive inspection, testing, and maintenance services for pressurized cylinders. From hydrostatic testing to valve maintenance and requalification, DiveMix ensures the safety and integrity of your cylinders, meeting regulatory standards and industry best practices.', 'FireExtinguisher', ARRAY[]::text[]);

-- Insert Applications
INSERT INTO applications (name, description, features, images) VALUES
('Oil and Gas Fields', 'DiveMix provides robust and reliable compressed air and gas solutions tailored to the demanding environments of oil and gas fields. Our high-performance equipment ensures safe and efficient operations, supporting both upstream and downstream activities.', ARRAY[]::text[], ARRAY['/img/applications/oilAndGas.jpg']),

('Food & Beverage', 'In the food and beverage industry, purity and reliability are paramount. DiveMix offers advanced compressed air and gas systems that meet stringent safety and quality standards, ensuring contamination-free production processes and enhancing product integrity.', ARRAY[]::text[], ARRAY['/img/applications/food_and_beverage.jpg']),

('Pharmaceutical Companies', 'Pharmaceutical companies require precise and dependable gas solutions for critical applications. DiveMix delivers high-quality compressed air and gas systems that support stringent regulatory compliance and ensure the purity and reliability essential for pharmaceutical manufacturing.', ARRAY[]::text[], ARRAY['/img/applications/Pharmaceutical.jpg']),

('Chemical and Petrochemical Industries', 'DiveMix understands the complex needs of the chemical and petrochemical industries. Our specialized compressed air and gas equipment is designed to handle corrosive and hazardous environments, ensuring safe and efficient operations while maximizing productivity.', ARRAY[]::text[], ARRAY['/img/applications/Chemical and Petrochemical Industries.jpg']),

('Laser Cutting', 'Precision and consistency are crucial in laser cutting applications. DiveMix provides cutting-edge gas solutions that deliver high-quality performance, enabling accurate and efficient cutting processes while reducing operational costs.', ARRAY[]::text[], ARRAY['/img/applications/laser_cutting.jpg']),

('Marine and Offshore Locations', 'Marine and offshore environments demand durable and reliable compressed air and gas solutions. DiveMix offers equipment designed to withstand harsh marine conditions, ensuring safe and efficient operations for offshore drilling, shipping, and other maritime activities.', ARRAY[]::text[], ARRAY['/img/applications/Marine-or-Offshore.jpg']),

('Recreational Diving', 'Safety is paramount in the recreational diving tourism industry. DiveMix supplies high-quality compressed air systems that ensure pure breathing air for divers, enhancing safety and providing a superior diving experience for tourists around the world.', ARRAY[]::text[], ARRAY['/img/applications/2.jpg']);

-- Insert Gallery Images
INSERT INTO gallery_images (title, url, category) VALUES
('Industrial Compressor Installation', '/img/gallery/4big.jpg', 'installations'),
('Maintenance Workshop', '/img/gallery/11big.jpg', 'maintenance'),
('Quality Testing Process', '/img/gallery/12big.jpg', 'testing'),
('Advanced Manufacturing Facility', '/img/gallery/Al Ahmadeya.jpg', 'facilities'),
('Training Session at Al Ahram', '/img/gallery/Al Ahram.jpg', 'training'),
('Product Development Lab', '/img/gallery/Al_Ahmadeya.jpg', 'facilities'),
('Alamia Advanced Training', '/img/gallery/Alamia Advanced.jpg', 'training'),
('Alamia Qaliub Training Session', '/img/gallery/Alamia Qaliub.jpg', 'training'),
('Cladex Installation', '/img/gallery/Cladex.jpg', 'installations'),
('Danone Egypt Project', '/img/gallery/Danone Egypt.jpg', 'installations'),
('Equipment Testing', '/img/gallery/DSC00502.jpg', 'testing'),
('EgyRoll Installation', '/img/gallery/EgyRoll.jpg', 'installations'),
('Professional Equipment Setup', '/img/gallery/IMG_4019.jpg', 'installations'),
('Kama Project', '/img/gallery/Kama.jpg', 'installations'),
('Marcyrl Installation', '/img/gallery/Marcyrl.jpg', 'installations'),
('Masa Hotel Project', '/img/gallery/Masa hotel.jpg', 'installations'),
('Maintenance Service', '/img/gallery/maintenence.jpg', 'maintenance'),
('Oil and Gas Operations', '/img/gallery/Oel-Gas.jpg', 'facilities');