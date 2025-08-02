-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_product_categories_updated_at 
    BEFORE UPDATE ON product_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default product categories (using original website content)
INSERT INTO product_categories (name, description, slug, image_url, is_active, display_order) VALUES 
(
    'L&W Compressors',
    'Diverse range of high-pressure compressors designed for various industrial needs.',
    'lw-compressors',
    '/img/products/L&W Compressors/lw.jpg',
    true,
    1
),
(
    'INMATEC Gas Generators',
    'Advanced compression solutions for industrial applications.',
    'inmatec-gas-generators',
    '/img/products/INMATEC/inmatec.png',
    true,
    2
),
(
    'ALMiG',
    'At DiveMix we are proud to partner with ALMiG, a premier provider of state-of-the-art compressed air systems.',
    'almig',
    '/img/products/ALMIG/almig.png',
    true,
    3
),
(
    'BEKO',
    'At DiveMix, we proudly partner with BEKO Technologies, a renowned leader in the field of compressed air and gas treatment solutions.',
    'beko',
    '/img/products/BEKO/beko.png',
    true,
    4
),
(
    'Maximator',
    'At DiveMix, we are proud to partner with MAXIMATOR, a global leader in high-pressure technology.',
    'maximator',
    '/img/products/MAXIMATOR/maximator.png',
    true,
    5
)
ON CONFLICT (slug) DO NOTHING;