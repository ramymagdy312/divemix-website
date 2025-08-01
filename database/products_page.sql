-- Create products_page table
CREATE TABLE IF NOT EXISTS products_page (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    intro_title TEXT NOT NULL,
    intro_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_products_page_updated_at 
    BEFORE UPDATE ON products_page 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO products_page (
    title,
    description,
    hero_image,
    intro_title,
    intro_description
) VALUES (
    'Our Products',
    'Discover our comprehensive range of high-quality gas mixing and compression solutions',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=2000',
    'Premium Gas Solutions',
    'From high-pressure compressors to advanced gas mixing systems, our products are engineered to meet the most demanding industrial requirements. Each solution is backed by German engineering excellence and decades of innovation.'
) ON CONFLICT DO NOTHING;