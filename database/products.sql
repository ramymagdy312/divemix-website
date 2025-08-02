-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    image_url TEXT,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    category TEXT, -- Keep for backward compatibility
    price DECIMAL(10,2),
    specifications JSONB,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (
    name, 
    description, 
    short_description, 
    image_url, 
    category, 
    features, 
    is_active, 
    display_order
) VALUES 
(
    'High-Pressure Gas Compressor HP-500',
    'Industrial-grade high-pressure gas compressor designed for demanding applications. Features advanced cooling systems and precision control for optimal performance.',
    'Industrial high-pressure gas compressor with advanced cooling',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800',
    'compressors',
    ARRAY['High-pressure capability up to 500 bar', 'Advanced cooling system', 'Precision pressure control', 'Low maintenance design'],
    true,
    1
),
(
    'Gas Mixing System GM-Pro',
    'Professional gas mixing system for precise gas blend preparation. Ideal for diving, welding, and industrial applications requiring exact gas compositions.',
    'Professional gas mixing system for precise blends',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800',
    'mixing-systems',
    ARRAY['Precise gas mixing ratios', 'Multiple gas inputs', 'Digital control panel', 'Safety monitoring systems'],
    true,
    2
),
(
    'Portable Diving Compressor DC-300',
    'Compact and portable diving compressor perfect for small dive operations and personal use. Delivers clean, dry air for safe diving operations.',
    'Compact portable diving compressor',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    'diving-equipment',
    ARRAY['Portable design', 'Clean air filtration', 'Low noise operation', 'Easy maintenance'],
    true,
    3
),
(
    'Industrial Gas Analyzer GA-2000',
    'Advanced gas analyzer for real-time monitoring and analysis of gas compositions. Essential for quality control and safety monitoring.',
    'Advanced gas analyzer for real-time monitoring',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
    'analyzers',
    ARRAY['Real-time analysis', 'Multiple gas detection', 'Digital display', 'Data logging capability'],
    true,
    4
),
(
    'Gas Storage Tank System TS-1000',
    'High-capacity gas storage system with advanced safety features. Suitable for industrial and commercial applications.',
    'High-capacity gas storage system',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800',
    'storage-systems',
    ARRAY['High capacity storage', 'Safety relief valves', 'Corrosion resistant', 'Modular design'],
    false, -- This one is inactive for testing
    5
)
ON CONFLICT DO NOTHING;