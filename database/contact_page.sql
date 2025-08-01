-- Create contact_page table
CREATE TABLE IF NOT EXISTS contact_page (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    intro_title TEXT NOT NULL,
    intro_description TEXT NOT NULL,
    branches JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_contact_page_updated_at 
    BEFORE UPDATE ON contact_page 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO contact_page (
    title,
    description,
    hero_image,
    intro_title,
    intro_description,
    branches
) VALUES (
    'Contact Us',
    'Get in touch with our team of experts for all your gas mixing and compression needs',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000',
    'Ready to Transform Your Operations?',
    'Whether you''re looking to upgrade your current systems, need expert consultation, or want to explore our latest innovations, our team is here to help. With decades of experience and a commitment to excellence, we provide personalized solutions that meet your specific requirements.',
    '[
        {
            "name": "Main Office - Cairo",
            "address": "123 Industrial Zone, New Cairo, Egypt",
            "phone": "+20 2 1234 5678",
            "email": "cairo@divemix.com",
            "coordinates": {
                "lat": 30.0444,
                "lng": 31.2357
            }
        },
        {
            "name": "Alexandria Branch",
            "address": "456 Port Area, Alexandria, Egypt",
            "phone": "+20 3 9876 5432",
            "email": "alexandria@divemix.com",
            "coordinates": {
                "lat": 31.2001,
                "lng": 29.9187
            }
        },
        {
            "name": "Red Sea Operations",
            "address": "789 Marine District, Hurghada, Egypt",
            "phone": "+20 65 1111 2222",
            "email": "redsea@divemix.com",
            "coordinates": {
                "lat": 27.2579,
                "lng": 33.8116
            }
        }
    ]'::jsonb
) ON CONFLICT DO NOTHING;