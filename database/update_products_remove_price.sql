-- Create/Update Products Table - Remove Price Column and Add Multiple Images Support
-- Run this AFTER creating product_categories table

-- 1. First ensure product_categories table exists
-- (Run create_product_categories_table.sql first)

-- 2. Remove price column from products table (if exists)
ALTER TABLE products DROP COLUMN IF EXISTS price;

-- 3. Create or update products table with correct structure
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    image_url TEXT, -- Primary image URL
    images TEXT[] DEFAULT '{}', -- Array of all image URLs
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Update existing products table structure if needed
DO $$
BEGIN
    -- Add images array column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'images'
    ) THEN
        ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
    
    -- Ensure image_url column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE products ADD COLUMN image_url TEXT;
    END IF;
    
    -- Update category_id to reference product_categories
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category_id'
    ) THEN
        -- Drop existing foreign key if it exists
        ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
        -- Add new foreign key to product_categories
        ALTER TABLE products ADD CONSTRAINT products_category_id_fkey 
            FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Insert sample products without prices
INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Professional Diving Mask',
    'High-quality diving mask with anti-fog technology and comfortable silicone skirt for crystal clear underwater vision',
    'Crystal clear vision underwater',
    pc.id,
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600'
    ],
    ARRAY['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens', 'Adjustable strap'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'diving-equipment'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Professional Diving Fins',
    'Lightweight and efficient diving fins designed for better propulsion and enhanced underwater mobility',
    'Enhanced underwater mobility',
    pc.id,
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600'
    ],
    ARRAY['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket', 'Durable materials'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'diving-equipment'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Underwater Safety Light',
    'Bright LED safety light for underwater visibility and emergency signaling during diving activities',
    'Stay visible and safe underwater',
    pc.id,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600',
        'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=600'
    ],
    ARRAY['Waterproof to 100m', 'Long battery life', 'Multiple flash modes', 'Compact design'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'safety-gear'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Waterproof Action Camera',
    '4K underwater action camera with advanced stabilization for capturing stunning underwater footage',
    'Capture stunning underwater footage',
    pc.id,
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600'
    ],
    ARRAY['4K video recording', 'Image stabilization', 'Waterproof to 30m', 'Touch screen display'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'underwater-cameras'
ON CONFLICT DO NOTHING;

-- 7. Enable RLS (Row Level Security) if needed
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for products table
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- 9. Grant permissions
GRANT ALL ON products TO authenticated;
GRANT SELECT ON products TO anon;

-- Success message
SELECT 'Products table updated successfully! Price column removed and multiple images support added.' as result;