-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    image_url TEXT,
    icon TEXT, -- For service icons
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample services (using original website content)
INSERT INTO services (
    name, 
    description, 
    short_description, 
    image_url, 
    icon,
    features, 
    is_active, 
    display_order
) VALUES 
(
    'Installation & Commissioning',
    'At DiveMix, we specialize in the installation and commissioning of high-quality gas equipment, including L&W High Pressure Compressors, Inmatec Oxygen & Nitrogen Generators, and Maximator High Pressure Technology products. Our experienced engineers ensure trouble-free installation, adhering to manufacturers warranty terms and guaranteeing the highest standard of service.',
    'Professional installation and commissioning of gas equipment',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
    '🔧',
    ARRAY['L&W High Pressure Compressors', 'Inmatec Oxygen & Nitrogen Generators', 'Maximator High Pressure Technology', 'Trouble-free installation', 'Manufacturers warranty compliance'],
    true,
    1
),
(
    'Preventive Maintenance',
    'Timely maintenance is essential for preventing major failures, and extending equipment life. maximizing parts reusability, our customizable maintenance contracts offer proactive solutions tailored to your specific needs, helping you schedule downtime and plan maintenance costs effectively. From routine inspections to full system overhauls, we ensure that your equipment operates at peak performance, lowering overall owning and operating costs.',
    'Customizable maintenance contracts for optimal equipment performance',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800',
    '🛠️',
    ARRAY['Prevent major failures', 'Extend equipment life', 'Maximize parts reusability', 'Customizable contracts', 'Schedule downtime planning', 'Cost-effective maintenance'],
    true,
    2
),
(
    'Air/Gas Quality Tests',
    'Ensuring the purity and safety of breathing air, including Oxygen Compatible Air and Medical Breathing Air, can be only achieved by continuous monitoring of compressed and filtered air. DiveMix provides comprehensive Air Quality Laboratory Checks, adhering to recognized standards such as DIN EN 12021 for breathing air compliance. To maintain optimal gas quality, we strongly advise conducting a minimum of one comprehensive check per compressor per quarter.',
    'Comprehensive air quality testing and monitoring services',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800',
    '💨',
    ARRAY['Breathing air purity', 'Oxygen Compatible Air', 'Medical Breathing Air', 'DIN EN 12021 compliance', 'Laboratory checks', 'Quarterly testing recommended'],
    true,
    3
),
(
    'Cylinder Services Station',
    'Our cylinder services station offers comprehensive inspection, testing, and maintenance services for pressurized cylinders. From hydrostatic testing to valve maintenance and requalification, DiveMix ensures the safety and integrity of your cylinders, meeting regulatory standards and industry best practices.',
    'Comprehensive cylinder inspection, testing, and maintenance services',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    '🔥',
    ARRAY['Comprehensive inspection', 'Hydrostatic testing', 'Valve maintenance', 'Cylinder requalification', 'Regulatory compliance', 'Industry best practices'],
    true,
    4
)
ON CONFLICT DO NOTHING;