-- 🔧 إصلاح ربط المنتجات بالفئات
-- انسخ هذا الكود وشغله في Supabase SQL Editor

-- 1. أولاً، تحقق من الفئات الموجودة
SELECT id, name, slug FROM product_categories ORDER BY display_order;

-- 2. تحقق من المنتجات الموجودة
SELECT id, name, category_id, category FROM products ORDER BY display_order;

-- 3. إضافة منتجات تجريبية مع ربط صحيح بالفئات
INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Professional Diving Mask',
    'High-quality diving mask with anti-fog technology and comfortable silicone skirt for crystal clear underwater vision',
    'Crystal clear vision underwater',
    pc.id,
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600'
    ],
    ARRAY['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens', 'Adjustable strap'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'diving-equipment'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Professional Diving Fins',
    'Lightweight and efficient diving fins designed for better propulsion and enhanced underwater mobility',
    'Enhanced underwater mobility',
    pc.id,
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600'
    ],
    ARRAY['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket', 'Durable materials'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'diving-equipment'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Underwater Safety Light',
    'Bright LED safety light for underwater visibility and emergency signaling',
    'Stay visible and safe underwater',
    pc.id,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600'
    ],
    ARRAY['Waterproof to 100m', 'Long battery life', 'Multiple flash modes', 'Compact design'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'safety-gear'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Emergency Whistle',
    'High-pitched emergency whistle for surface signaling and safety',
    'Emergency surface signaling',
    pc.id,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800'
    ],
    ARRAY['High-pitched sound', 'Corrosion resistant', 'Lightweight', 'Lanyard included'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'safety-gear'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Waterproof Action Camera',
    '4K underwater action camera with image stabilization for capturing stunning underwater footage',
    'Capture stunning underwater footage',
    pc.id,
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600'
    ],
    ARRAY['4K video recording', 'Image stabilization', 'Waterproof to 30m', 'Touch screen'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'underwater-cameras'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Underwater Housing',
    'Professional underwater housing for DSLR cameras with full control access',
    'Professional camera protection',
    pc.id,
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800'
    ],
    ARRAY['Waterproof to 60m', 'Full camera control', 'Clear optical glass', 'Ergonomic design'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'underwater-cameras'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Diving Gloves',
    'Neoprene diving gloves for thermal protection and grip enhancement',
    'Thermal protection and grip',
    pc.id,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800'
    ],
    ARRAY['3mm neoprene', 'Enhanced grip', 'Thermal protection', 'Flexible design'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'accessories'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Diving Boots',
    'Comfortable diving boots with non-slip sole for rocky entries',
    'Comfortable foot protection',
    pc.id,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800'
    ],
    ARRAY['Non-slip sole', 'Comfortable fit', 'Quick-dry material', 'Reinforced toe'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'accessories'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Full Wetsuit 3mm',
    'High-quality 3mm neoprene wetsuit for thermal protection in moderate waters',
    'Thermal protection for diving',
    pc.id,
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600'
    ],
    ARRAY['3mm neoprene', 'Full body coverage', 'Flexible design', 'YKK zipper'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'wetsuits-gear'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Diving Hood',
    'Neoprene diving hood for additional thermal protection in cold waters',
    'Extra thermal protection',
    pc.id,
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800'
    ],
    ARRAY['5mm neoprene', 'Comfortable fit', 'Thermal protection', 'Easy to wear'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'wetsuits-gear'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Regulator Service Kit',
    'Complete service kit for diving regulator maintenance and repair',
    'Professional regulator maintenance',
    pc.id,
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800'
    ],
    ARRAY['Complete service kit', 'Professional grade', 'All necessary tools', 'Instruction manual'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'maintenance-tools'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Equipment Cleaning Kit',
    'Specialized cleaning kit for diving equipment maintenance and care',
    'Keep your gear in top condition',
    pc.id,
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800'
    ],
    ARRAY['Specialized cleaners', 'Soft brushes', 'Microfiber cloths', 'Storage case'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'maintenance-tools'
ON CONFLICT (name) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    images = EXCLUDED.images,
    features = EXCLUDED.features;

-- 4. تحقق من النتائج
SELECT 
    p.id,
    p.name,
    p.category_id,
    pc.name as category_name,
    pc.slug as category_slug
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
ORDER BY pc.display_order, p.display_order;

-- 5. عدد المنتجات لكل فئة
SELECT 
    pc.name as category_name,
    pc.slug as category_slug,
    COUNT(p.id) as product_count
FROM product_categories pc
LEFT JOIN products p ON p.category_id = pc.id AND p.is_active = true
GROUP BY pc.id, pc.name, pc.slug
ORDER BY pc.display_order;

-- 🎉 تم! الآن كل منتج مربوط بفئة صحيحة