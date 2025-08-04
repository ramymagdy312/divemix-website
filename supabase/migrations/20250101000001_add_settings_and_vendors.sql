-- Create settings table for email and WhatsApp configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table for vendor management
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table for contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('contact_email', 'ramy.magdy@rockettravelsystem.com', 'Email address for contact form submissions'),
  ('whatsapp_number', '+201010606967', 'WhatsApp number for contact (with country code)'),
  ('whatsapp_message', 'Hello! I would like to get more information about your services.', 'Default WhatsApp message')
ON CONFLICT (key) DO NOTHING;

-- Insert sample vendors
INSERT INTO vendors (name, logo_url, website_url, description, display_order) VALUES
  ('Microsoft', 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=200&h=100&fit=crop', 'https://microsoft.com', 'Technology Partner', 1),
  ('Google', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&h=100&fit=crop', 'https://google.com', 'Cloud Services Partner', 2),
  ('Amazon AWS', 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=100&fit=crop', 'https://aws.amazon.com', 'Cloud Infrastructure Partner', 3),
  ('Oracle', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop', 'https://oracle.com', 'Database Solutions Partner', 4),
  ('IBM', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=100&fit=crop', 'https://ibm.com', 'Enterprise Solutions Partner', 5)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_vendors_display_order ON vendors(display_order);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for settings
CREATE POLICY "Allow read access to settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow full access to authenticated users for settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for vendors
CREATE POLICY "Allow read access to vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Allow full access to authenticated users for vendors" ON vendors FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_submissions
CREATE POLICY "Allow insert for contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users for contact submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');