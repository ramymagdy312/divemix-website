/*
  DiveMix Website - Sample Data
  
  This file contains additional sample data for testing and demonstration purposes.
  Run this after the main database setup to populate the database with more content.
  
  Author: DiveMix Development Team
  Date: January 2025
  Version: 1.0
*/

-- ============================================================================
-- ADDITIONAL SAMPLE DATA
-- ============================================================================

-- Insert more detailed settings
INSERT INTO settings (key, value, description) VALUES
  ('site_maintenance', 'false', 'Enable/disable site maintenance mode'),
  ('max_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
  ('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx', 'Allowed file types for uploads'),
  ('email_notifications', 'true', 'Enable/disable email notifications'),
  ('google_analytics_id', 'GA-XXXXXXXXX', 'Google Analytics tracking ID'),
  ('meta_description', 'DiveMix Gas & Compressor Technologies - Leading provider of compressed air and gas solutions in Egypt and the Middle East', 'Default meta description'),
  ('meta_keywords', 'compressed air, gas compressors, industrial equipment, Egypt, Middle East', 'Default meta keywords')
ON CONFLICT (key) DO NOTHING;

-- Insert more vendors
INSERT INTO vendors (name, logo_url, website_url, description, display_order) VALUES
  ('Siemens', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop', 'https://siemens.com', 'Industrial automation partner', 6),
  ('Schneider Electric', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=100&fit=crop', 'https://schneider-electric.com', 'Energy management solutions', 7),
  ('ABB', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=100&fit=crop', 'https://abb.com', 'Power and automation technologies', 8)
ON CONFLICT DO NOTHING;

-- Insert more gallery images
INSERT INTO gallery_images (title, url, category) VALUES
  ('Compressor Room Installation', '/img/gallery/compressor-room-1.jpg', 'installations'),
  ('Pipeline Installation', '/img/gallery/pipeline-install.jpg', 'installations'),
  ('Control Panel Setup', '/img/gallery/control-panel.jpg', 'installations'),
  ('Routine Maintenance Check', '/img/gallery/maintenance-check.jpg', 'maintenance'),
  ('Filter Replacement', '/img/gallery/filter-replacement.jpg', 'maintenance'),
  ('System Calibration', '/img/gallery/calibration.jpg', 'maintenance'),
  ('Pressure Testing', '/img/gallery/pressure-test.jpg', 'testing'),
  ('Air Quality Analysis', '/img/gallery/air-quality.jpg', 'testing'),
  ('Leak Detection', '/img/gallery/leak-detection.jpg', 'testing'),
  ('Main Workshop', '/img/gallery/workshop-main.jpg', 'facilities'),
  ('Storage Warehouse', '/img/gallery/warehouse.jpg', 'facilities'),
  ('Office Building', '/img/gallery/office.jpg', 'facilities'),
  ('Technical Training', '/img/gallery/tech-training.jpg', 'training'),
  ('Safety Training', '/img/gallery/safety-training.jpg', 'training'),
  ('Customer Workshop', '/img/gallery/customer-workshop.jpg', 'training'),
  ('Oil Refinery Project', '/img/gallery/oil-refinery.jpg', 'projects'),
  ('Hospital Installation', '/img/gallery/hospital.jpg', 'projects'),
  ('Manufacturing Plant', '/img/gallery/manufacturing.jpg', 'projects')
ON CONFLICT DO NOTHING;

-- Insert more branches
INSERT INTO branches (name, address, phone, email, city, country, is_main) VALUES
  ('Red Sea Branch', '321 Marina Street, Hurghada', '+20 65 1234 5678', 'redsea@divemix.com', 'Hurghada', 'Egypt', false),
  ('Upper Egypt Branch', '654 Nile Street, Aswan', '+20 97 1234 5678', 'aswan@divemix.com', 'Aswan', 'Egypt', false)
ON CONFLICT DO NOTHING;

-- Insert contact form test submissions
INSERT INTO contact_submissions (name, email, subject, message, status) VALUES
  ('Ahmed Mohamed', 'ahmed@example.com', 'Inquiry about L&W Compressors', 'I am interested in learning more about your L&W compressor products for our manufacturing facility.', 'new'),
  ('Sarah Johnson', 'sarah@company.com', 'Maintenance Contract', 'We would like to discuss a maintenance contract for our existing compressed air system.', 'in_progress'),
  ('Mohamed Ali', 'mohamed@industrial.com', 'Gas Generator Quote', 'Please provide a quote for an INMATEC nitrogen generator for our pharmaceutical facility.', 'completed'),
  ('Lisa Chen', 'lisa@tech.com', 'Technical Support', 'We are experiencing issues with our current system and need technical support.', 'new')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SAMPLE PRODUCT DATA WITH MORE DETAILS
-- ============================================================================

-- Update existing products with more detailed information
DO $$
DECLARE
    product_record RECORD;
BEGIN
    -- Update L&W Mobile Compressors with more features
    UPDATE products 
    SET features = ARRAY[
        'Portable Design for Easy Transport',
        'Gasoline, Diesel, or Electric Motor Options',
        'Perfect for Field Operations',
        'Compact Form Factor',
        'Reliable Performance',
        'Low Maintenance Requirements',
        'Weather-Resistant Construction',
        'Quick Setup and Operation'
    ]
    WHERE name = 'Mobile Compressors';

    -- Update L&W Compact Compressors
    UPDATE products 
    SET features = ARRAY[
        'Space-Efficient Design',
        '230-570 L/min Capacity Range',
        'Robust Electric Motors',
        'High Energy Efficiency',
        'Low Noise Operation',
        'Easy Installation',
        'Minimal Footprint',
        'Cost-Effective Solution'
    ]
    WHERE name = 'Compact Compressors';

    -- Update INMATEC Nitrogen Generators
    UPDATE products 
    SET features = ARRAY[
        'PSA (Pressure Swing Adsorption) Technology',
        'On-site Gas Generation',
        'Continuous Reliable Supply',
        'High Purity Output (up to 99.999%)',
        'Energy Efficient Operation',
        'Automated Control System',
        'Low Operating Costs',
        'Environmentally Friendly'
    ]
    WHERE name = 'Nitrogen Generators';

    -- Update services with more detailed features
    UPDATE services 
    SET features = ARRAY[
        'Site Survey and Assessment',
        'Professional Installation Team',
        'System Commissioning and Testing',
        'Performance Optimization',
        'Documentation and Certification',
        'Training for Operators',
        'Warranty Coverage',
        '24/7 Support Hotline'
    ]
    WHERE title = 'Installation & Commissioning';

    UPDATE services 
    SET features = ARRAY[
        'Customized Maintenance Schedules',
        'Preventive Care Programs',
        'Genuine Parts and Components',
        'Performance Monitoring',
        'Predictive Maintenance',
        'Emergency Response',
        'Maintenance Reports',
        'Cost-Effective Contracts'
    ]
    WHERE title = 'Preventive Maintenance';

END $$;

-- ============================================================================
-- CREATE SAMPLE ADMIN USER (FOR TESTING ONLY)
-- ============================================================================

-- Note: This is for testing purposes only. In production, users should be created through Supabase Auth
-- This creates a sample user record that can be referenced in the application

-- Create a users table for admin management (if not exists)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users
CREATE POLICY "Allow authenticated users to manage admin users" 
ON admin_users FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert sample admin user
INSERT INTO admin_users (email, full_name, role) VALUES
  ('admin@divemix.com', 'System Administrator', 'super_admin'),
  ('manager@divemix.com', 'Content Manager', 'admin'),
  ('editor@divemix.com', 'Content Editor', 'editor')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- CREATE USEFUL VIEWS FOR REPORTING
-- ============================================================================

-- View for product statistics
CREATE OR REPLACE VIEW product_statistics AS
SELECT 
    c.name as category_name,
    COUNT(p.id) as product_count,
    AVG(array_length(p.images, 1)) as avg_images_per_product,
    AVG(array_length(p.features, 1)) as avg_features_per_product
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- View for contact form statistics
CREATE OR REPLACE VIEW contact_statistics AS
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM contact_submissions
GROUP BY status
ORDER BY count DESC;

-- View for gallery statistics
CREATE OR REPLACE VIEW gallery_statistics AS
SELECT 
    category,
    COUNT(*) as image_count
FROM gallery_images
GROUP BY category
ORDER BY image_count DESC;

-- View for recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    'Contact Submission' as activity_type,
    name as title,
    created_at
FROM contact_submissions
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
    'Product Added' as activity_type,
    name as title,
    created_at
FROM products
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
    'Gallery Image Added' as activity_type,
    title,
    created_at
FROM gallery_images
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 20;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Sample Data Installation Complete!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Additional sample data has been successfully added to your database.';
    RAISE NOTICE '';
    RAISE NOTICE 'Added:';
    RAISE NOTICE '- Extended settings configuration';
    RAISE NOTICE '- Additional vendor partners';
    RAISE NOTICE '- More gallery images and categories';
    RAISE NOTICE '- Extra branch locations';
    RAISE NOTICE '- Sample contact form submissions';
    RAISE NOTICE '- Enhanced product features';
    RAISE NOTICE '- Admin user management table';
    RAISE NOTICE '- Reporting views for statistics';
    RAISE NOTICE '';
    RAISE NOTICE 'Your DiveMix database is now fully populated with sample data!';
    RAISE NOTICE '============================================================================';
END $$;