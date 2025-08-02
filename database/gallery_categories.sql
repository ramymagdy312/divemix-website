-- Create gallery_categories table
CREATE TABLE IF NOT EXISTS gallery_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_gallery_categories_updated_at 
    BEFORE UPDATE ON gallery_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO gallery_categories (name, description, slug, display_order) VALUES 
('All', 'All gallery images', 'all', 0),
('Installations', 'Industrial compressor installations and setup', 'installations', 1),
('Maintenance', 'Maintenance workshops and service operations', 'maintenance', 2),
('Testing', 'Quality testing processes and procedures', 'testing', 3),
('Facilities', 'Our manufacturing facilities and equipment', 'facilities', 4),
('Training', 'Training sessions and educational programs', 'training', 5)
ON CONFLICT (slug) DO NOTHING;

-- Note: gallery_images table should be created separately using gallery_images.sql
-- This script only handles gallery_categories table