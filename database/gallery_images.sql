-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT, -- Keep for backward compatibility
    category_id UUID REFERENCES gallery_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_gallery_images_updated_at 
    BEFORE UPDATE ON gallery_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample gallery images with correct categories (using existing images only)
INSERT INTO gallery_images (title, url, category, category_id) VALUES 
(
    'Industrial Compressor Installation',
    '/img/gallery/gallery (1).jpg',
    'installations',
    (SELECT id FROM gallery_categories WHERE slug = 'installations' LIMIT 1)
),
(
    'Maintenance Workshop',
    '/img/gallery/gallery (2).jpg',
    'maintenance',
    (SELECT id FROM gallery_categories WHERE slug = 'maintenance' LIMIT 1)
),
(
    'Quality Testing Process',
    '/img/gallery/gallery (3).jpg',
    'testing',
    (SELECT id FROM gallery_categories WHERE slug = 'testing' LIMIT 1)
),
(
    'Advanced Manufacturing Facility',
    '/img/gallery/gallery (4).jpg',
    'facilities',
    (SELECT id FROM gallery_categories WHERE slug = 'facilities' LIMIT 1)
),
(
    'Training Session',
    '/img/gallery/gallery (5).jpg',
    'training',
    (SELECT id FROM gallery_categories WHERE slug = 'training' LIMIT 1)
),
(
    'Manufacturing Facility Equipment',
    '/img/gallery/gallery (6).jpg',
    'facilities',
    (SELECT id FROM gallery_categories WHERE slug = 'facilities' LIMIT 1)
),
(
    'Advanced Installation Project',
    '/img/gallery/gallery (7).jpg',
    'installations',
    (SELECT id FROM gallery_categories WHERE slug = 'installations' LIMIT 1)
),
(
    'Industrial Installation - Qaliub',
    '/img/gallery/gallery (8).jpg',
    'installations',
    (SELECT id FROM gallery_categories WHERE slug = 'installations' LIMIT 1)
),
(
    'Maintenance Operations',
    '/img/gallery/gallery (9).jpg',
    'maintenance',
    (SELECT id FROM gallery_categories WHERE slug = 'maintenance' LIMIT 1)
),
(
    'Egyptian Methanex Testing',
    '/img/gallery/gallery (10).jpg',
    'testing',
    (SELECT id FROM gallery_categories WHERE slug = 'testing' LIMIT 1)
),
(
    'Installation Documentation',
    '/img/gallery/gallery (11).jpg',
    'installations',
    (SELECT id FROM gallery_categories WHERE slug = 'installations' LIMIT 1)
),
(
    'Best Analog Compressor Facility',
    '/img/gallery/gallery (12).jpg',
    'facilities',
    (SELECT id FROM gallery_categories WHERE slug = 'facilities' LIMIT 1)
),
(
    'Alex Pharma Installation',
    '/img/gallery/gallery (13).jpg',
    'installations',
    (SELECT id FROM gallery_categories WHERE slug = 'installations' LIMIT 1)
),
(
    'Danone Egypt Testing',
    '/img/gallery/gallery (14).jpg',
    'testing',
    (SELECT id FROM gallery_categories WHERE slug = 'testing' LIMIT 1)
),
(
    'EgyRoll Maintenance',
    '/img/gallery/gallery (15).jpg',
    'maintenance',
    (SELECT id FROM gallery_categories WHERE slug = 'maintenance' LIMIT 1)
),
(
    'Training Documentation',
    '/img/gallery/gallery (16).jpg',
    'training',
    (SELECT id FROM gallery_categories WHERE slug = 'training' LIMIT 1)
),
(
    'Training Documentation',
    '/img/gallery/gallery (17).jpg',
    'training',
    (SELECT id FROM gallery_categories WHERE slug = 'training' LIMIT 1)
),
(
    'Training Documentation',
    '/img/gallery/gallery (18).jpg',
    'training',
    (SELECT id FROM gallery_categories WHERE slug = 'training' LIMIT 1)
),
(
    'Training Documentation',
    '/img/gallery/gallery (19).jpg',
    'training',
    (SELECT id FROM gallery_categories WHERE slug = 'training' LIMIT 1)
)

ON CONFLICT DO NOTHING;