-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    image_url TEXT,
    industry TEXT,
    use_cases TEXT[],
    benefits TEXT[],
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample applications (using original website content)
INSERT INTO applications (
    name, 
    description, 
    short_description, 
    image_url, 
    industry,
    use_cases,
    benefits,
    is_active, 
    display_order
) VALUES 
(
    'Oil and Gas Fields',
    'DiveMix provides robust and reliable compressed air and gas solutions tailored to the demanding environments of oil and gas fields. Our high-performance equipment ensures safe and efficient operations, supporting both upstream and downstream activities.',
    'Robust compressed air and gas solutions for oil and gas fields',
    '/img/applications/oilAndGas.jpg',
    'Oil & Gas',
    ARRAY['Upstream operations', 'Downstream activities', 'Field operations', 'Industrial processes'],
    ARRAY['Robust performance', 'Reliable operation', 'Safe operations', 'High efficiency'],
    true,
    1
),
(
    'Food & Beverage',
    'In the food and beverage industry, purity and reliability are paramount. DiveMix offers advanced compressed air and gas systems that meet stringent safety and quality standards, ensuring contamination-free production processes and enhancing product integrity.',
    'Advanced compressed air systems for food and beverage industry',
    '/img/applications/food_and_beverage.jpg',
    'Food & Beverage',
    ARRAY['Production processes', 'Quality control', 'Packaging', 'Food safety'],
    ARRAY['Contamination-free processes', 'Product integrity', 'Quality standards', 'Safety compliance'],
    true,
    2
),
(
    'Pharmaceutical Companies',
    'Pharmaceutical companies require precise and dependable gas solutions for critical applications. DiveMix delivers high-quality compressed air and gas systems that support stringent regulatory compliance and ensure the purity and reliability essential for pharmaceutical manufacturing.',
    'Precise gas solutions for pharmaceutical manufacturing',
    '/img/applications/Pharmaceutical.jpg',
    'Pharmaceutical',
    ARRAY['Manufacturing processes', 'Quality control', 'Regulatory compliance', 'Critical applications'],
    ARRAY['High purity', 'Regulatory compliance', 'Reliable operation', 'Quality assurance'],
    true,
    3
),
(
    'Chemical and Petrochemical Industries',
    'DiveMix understands the complex needs of the chemical and petrochemical industries. Our specialized compressed air and gas equipment is designed to handle corrosive and hazardous environments, ensuring safe and efficient operations while maximizing productivity.',
    'Specialized equipment for chemical and petrochemical industries',
    '/img/applications/Chemical and Petrochemical Industries.jpg',
    'Chemical & Petrochemical',
    ARRAY['Corrosive environments', 'Hazardous operations', 'Industrial processes', 'Safety systems'],
    ARRAY['Safe operations', 'Efficient performance', 'Maximum productivity', 'Specialized design'],
    true,
    4
),
(
    'Laser Cutting',
    'Precision and consistency are crucial in laser cutting applications. DiveMix provides cutting-edge gas solutions that deliver high-quality performance, enabling accurate and efficient cutting processes while reducing operational costs.',
    'Cutting-edge gas solutions for laser cutting applications',
    '/img/applications/laser_cutting.jpg',
    'Manufacturing',
    ARRAY['Precision cutting', 'Industrial manufacturing', 'Metal processing', 'Quality control'],
    ARRAY['High precision', 'Consistent performance', 'Reduced costs', 'Efficient processes'],
    true,
    5
),
(
    'Marine and Offshore Locations',
    'Marine and offshore environments demand durable and reliable compressed air and gas solutions. DiveMix offers equipment designed to withstand harsh marine conditions, ensuring safe and efficient operations for offshore drilling, shipping, and other maritime activities.',
    'Durable solutions for marine and offshore environments',
    '/img/applications/Marine-or-Offshore.jpg',
    'Marine & Offshore',
    ARRAY['Offshore drilling', 'Shipping operations', 'Maritime activities', 'Harsh environments'],
    ARRAY['Durable design', 'Reliable performance', 'Safe operations', 'Marine-resistant'],
    true,
    6
),
(
    'Recreational Diving',
    'Safety is paramount in the recreational diving tourism industry. DiveMix supplies high-quality compressed air systems that ensure pure breathing air for divers, enhancing safety and providing a superior diving experience for tourists around the world.',
    'High-quality compressed air systems for recreational diving',
    '/img/applications/2.jpg',
    'Tourism & Recreation',
    ARRAY['Recreational diving', 'Tourism industry', 'Breathing air supply', 'Safety systems'],
    ARRAY['Enhanced safety', 'Pure breathing air', 'Superior experience', 'Tourist satisfaction'],
    true,
    7
)
ON CONFLICT DO NOTHING;