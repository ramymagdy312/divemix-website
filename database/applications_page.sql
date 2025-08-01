-- Create applications_page table
CREATE TABLE IF NOT EXISTS applications_page (
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
CREATE TRIGGER update_applications_page_updated_at 
    BEFORE UPDATE ON applications_page 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO applications_page (
    title,
    description,
    hero_image,
    intro_title,
    intro_description
) VALUES (
    'Applications',
    'Explore the diverse applications of our gas mixing and compression technologies',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2000',
    'Versatile Solutions Across Industries',
    'Our advanced gas mixing and compression technologies serve a wide range of industries, from diving and marine operations to industrial manufacturing and research facilities. Discover how our solutions can enhance your operations.'
) ON CONFLICT DO NOTHING;