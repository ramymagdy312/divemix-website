-- Create about_page table
CREATE TABLE IF NOT EXISTS about_page (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission TEXT NOT NULL,
    company_overview TEXT NOT NULL,
    values JSONB NOT NULL DEFAULT '[]',
    timeline JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_about_page_updated_at 
    BEFORE UPDATE ON about_page 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO about_page (
    title,
    description,
    hero_image,
    vision,
    mission,
    company_overview,
    values,
    timeline
) VALUES (
    'About DiveMix',
    'Leading the industry in compressed air and gas solutions since 1990',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000',
    'To be the global leader in innovative gas mixing solutions, setting industry standards for quality, reliability, and technological advancement.',
    'To provide cutting-edge compressed air and gas solutions while maintaining the highest standards of safety, quality, and customer satisfaction.',
    'DiveMix has been at the forefront of compressed air and gas mixing technology for over three decades. Founded in 1990, we have consistently delivered innovative solutions that meet the evolving needs of industries worldwide. Our commitment to German engineering excellence and cutting-edge technology has made us a trusted partner for businesses seeking reliable, efficient, and safe gas mixing solutions.',
    '[
        {
            "title": "Quality",
            "description": "We deliver German-engineered excellence, ensuring reliable and long-lasting performance.",
            "icon": "Award"
        },
        {
            "title": "Innovation",
            "description": "We embrace new technologies to offer advanced, forward-thinking solutions.",
            "icon": "Focus"
        },
        {
            "title": "Customer-Focused",
            "description": "Your needs guide our approach, from personalized service to ongoing support.",
            "icon": "Users"
        },
        {
            "title": "Safety",
            "description": "We design every product with strict safety standards to ensure secure and dependable use.",
            "icon": "Shield"
        }
    ]'::jsonb,
    '[
        {
            "year": "1990",
            "title": "Company Founded",
            "description": "DiveMix was established with a vision to revolutionize gas mixing technology."
        },
        {
            "year": "1995",
            "title": "First Major Contract",
            "description": "Secured our first major industrial contract, marking our entry into large-scale operations."
        },
        {
            "year": "2000",
            "title": "International Expansion",
            "description": "Expanded operations internationally, bringing our solutions to global markets."
        },
        {
            "year": "2010",
            "title": "Technology Innovation",
            "description": "Launched our advanced digital control systems, setting new industry standards."
        },
        {
            "year": "2020",
            "title": "Sustainability Focus",
            "description": "Introduced eco-friendly solutions and sustainable manufacturing processes."
        },
        {
            "year": "2024",
            "title": "Digital Transformation",
            "description": "Launched our comprehensive digital platform for enhanced customer experience."
        }
    ]'::jsonb
) ON CONFLICT DO NOTHING;