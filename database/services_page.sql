-- Create services_page table
CREATE TABLE IF NOT EXISTS services_page (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    intro_title TEXT NOT NULL,
    intro_description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_services_page_updated_at 
    BEFORE UPDATE ON services_page 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO services_page (
    title,
    description,
    hero_image,
    intro_title,
    intro_description
) VALUES (
    'Our Services',
    'Professional services and support for all your gas mixing and compression needs',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2000',
    'Expert Support & Maintenance',
    'Our comprehensive service portfolio ensures your equipment operates at peak performance. From installation and commissioning to ongoing maintenance and emergency support, our certified technicians are here to help.'
) ON CONFLICT DO NOTHING;