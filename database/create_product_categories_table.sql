-- Create Product Categories Table
-- Run this in your Supabase SQL Editor

-- 1. Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
CREATE TRIGGER update_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Insert sample categories
INSERT INTO product_categories (name, description, slug, image_url, is_active, display_order)
VALUES
('L&W Compressors',
 'Diverse range of high-pressure compressors designed for various industrial needs.',
 'lw-compressors',
 '/img/products/L&W Compressors/lw.jpg',
 true,
 1),

('INMATEC Gas Generators',
 'Advanced compression solutions for industrial applications.',
 'inmatec-gas-generators',
 '/img/products/INMATEC/inmatec.png',
 true,
 2),

('ALMiG',
 'At DiveMix we are proud to partner with ALMiG, a premier provider of state-of-the-art compressed air systems. ALMiG offers a comprehensive range of innovative products designed to meet the diverse needs of various industries, ensuring efficient, reliable, and high-quality compressed air supply.',
 'almig',
 '/img/products/ALMIG/almig.png',
 true,
 3),

('BEKO',
 'At DiveMix, we proudly partner with BEKO Technologies, a renowned leader in the field of compressed air and gas treatment solutions. BEKO Technologies offers a comprehensive range of products designed to optimize the quality and efficiency of your compressed air systems.',
 'beko',
 '/img/products/BEKO/beko.png',
 true,
 4),

('Maximator',
 'At DiveMix, we are proud to partner with MAXIMATOR, a global leader in high-pressure technology. MAXIMATOR specializes in providing top-of-the-line high-pressure components and systems designed to meet the rigorous demands of various industrial applications.',
 'maximator',
 '/img/products/MAXIMATOR/maximator.png',
 true,
 5);