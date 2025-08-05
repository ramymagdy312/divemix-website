-- Create branches table for contact locations
CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  working_hours JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table for email submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample branches
INSERT INTO branches (name, address, phone, email, latitude, longitude, working_hours, display_order) VALUES
('الفرع الرئيسي - القاهرة', 'شارع التحرير، وسط البلد، القاهرة، مصر', '+20123456789', 'cairo@divemix.com', 30.0444, 31.2357, '{"saturday": "9:00-18:00", "sunday": "9:00-18:00", "monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "closed"}', 1),
('فرع الإسكندرية', 'كورنيش الإسكندرية، الإسكندرية، مصر', '+20123456790', 'alexandria@divemix.com', 31.2001, 29.9187, '{"saturday": "9:00-18:00", "sunday": "9:00-18:00", "monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "closed"}', 2),
('فرع الغردقة', 'شارع الشيراتون، الغردقة، البحر الأحمر، مصر', '+20123456791', 'hurghada@divemix.com', 27.2579, 33.8116, '{"saturday": "8:00-20:00", "sunday": "8:00-20:00", "monday": "8:00-20:00", "tuesday": "8:00-20:00", "wednesday": "8:00-20:00", "thursday": "8:00-20:00", "friday": "8:00-20:00"}', 3);

-- Enable RLS
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for branches (public read, admin write)
CREATE POLICY "Allow public read access to active branches" ON branches
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to branches" ON branches
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_messages (public insert, admin read)
CREATE POLICY "Allow public insert to contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read access to contact_messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update contact_messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');