# 🗄️ Database Setup Instructions

## 📋 **Required Tables Setup**

Run these SQL commands in your Supabase SQL Editor to create the required tables:

### **1. Settings Table**
```sql
-- Create settings table for email and WhatsApp configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('contact_email', 'ramy.magdy@rockettravelsystem.com', 'Email address for contact form submissions'),
  ('whatsapp_number', '+201234567890', 'WhatsApp number for contact (with country code)'),
  ('whatsapp_message', 'Hello! I would like to get more information about your services.', 'Default WhatsApp message')
ON CONFLICT (key) DO NOTHING;
```

### **2. Vendors Table**
```sql
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

-- Insert sample vendors
INSERT INTO vendors (name, logo_url, website_url, description, display_order) VALUES
  ('Microsoft', 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=200&h=100&fit=crop', 'https://microsoft.com', 'Technology Partner', 1),
  ('Google', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&h=100&fit=crop', 'https://google.com', 'Cloud Services Partner', 2),
  ('Amazon AWS', 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=100&fit=crop', 'https://aws.amazon.com', 'Cloud Infrastructure Partner', 3),
  ('Oracle', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop', 'https://oracle.com', 'Database Solutions Partner', 4),
  ('IBM', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=100&fit=crop', 'https://ibm.com', 'Enterprise Solutions Partner', 5)
ON CONFLICT DO NOTHING;
```

### **3. Contact Submissions Table**
```sql
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
```

### **4. Create Indexes**
```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_vendors_display_order ON vendors(display_order);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
```

### **5. Enable RLS (Row Level Security)**
```sql
-- Enable RLS (Row Level Security)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
```

### **6. Create Policies**
```sql
-- Create policies for settings
CREATE POLICY "Allow read access to settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow full access to authenticated users for settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for vendors
CREATE POLICY "Allow read access to vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Allow full access to authenticated users for vendors" ON vendors FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_submissions
CREATE POLICY "Allow insert for contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users for contact submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
```

## 📧 **Email Configuration**

### **Setup SMTP for Email Sending:**

1. **For Gmail:**
   - Enable 2-Factor Authentication
   - Generate App Password
   - Update `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

2. **For Other Email Services:**
   - **Outlook/Hotmail:**
     ```env
     SMTP_HOST=smtp-mail.outlook.com
     SMTP_PORT=587
     ```
   - **Yahoo:**
     ```env
     SMTP_HOST=smtp.mail.yahoo.com
     SMTP_PORT=587
     ```

## 🚀 **Testing the Setup**

### **1. Test Database Tables:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('settings', 'vendors', 'contact_submissions');

-- Check sample data
SELECT * FROM settings;
SELECT * FROM vendors;
SELECT * FROM contact_submissions;
```

### **2. Test Contact Form:**
1. Go to: `http://localhost:3000/contact`
2. Fill out the contact form
3. Check if message appears in: `http://localhost:3000/admin/contact-messages`

### **3. Test WhatsApp:**
1. Go to contact page
2. Click "Start WhatsApp Chat" button
3. Verify it opens WhatsApp with correct number and message

### **4. Test Vendors Slider:**
1. Go to: `http://localhost:3000`
2. Scroll to "Our Trusted Partners" section
3. Verify vendors are displayed in slider format

### **5. Test Admin Settings:**
1. Go to: `http://localhost:3000/admin/settings`
2. Update email and WhatsApp settings
3. Test contact form and WhatsApp with new settings

## 🎯 **Admin Panel URLs**

```
# Settings Management
http://localhost:3000/admin/settings

# Vendors Management
http://localhost:3000/admin/vendors
http://localhost:3000/admin/vendors/new

# Contact Messages
http://localhost:3000/admin/contact-messages

# Test Pages
http://localhost:3000/contact
http://localhost:3000/
```

## ✅ **Verification Checklist**

- [ ] All tables created successfully
- [ ] Sample vendors data inserted
- [ ] Default settings configured
- [ ] RLS policies enabled
- [ ] Email SMTP configured
- [ ] Contact form sends emails
- [ ] WhatsApp contact works
- [ ] Vendors slider displays on homepage
- [ ] Admin panels accessible
- [ ] Newsletter removed from footer

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Email not sending:**
   - Check SMTP credentials in `.env.local`
   - Verify email service allows SMTP
   - Check spam folder

2. **WhatsApp not opening:**
   - Verify phone number format (+countrycode)
   - Check WhatsApp is installed on device

3. **Vendors not showing:**
   - Check vendors table has data
   - Verify `is_active = true`
   - Check console for errors

4. **Database connection issues:**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure tables exist

## 🎉 **Setup Complete!**

Once all steps are completed, your system will have:

- ✅ **Dynamic Email Configuration** - Change contact email from admin panel
- ✅ **WhatsApp Integration** - Configurable WhatsApp contact
- ✅ **Vendors Management** - Full CRUD for homepage vendors slider
- ✅ **Contact Form** - Saves to database and sends emails
- ✅ **Message Management** - Admin panel for contact messages
- ✅ **Clean Footer** - Newsletter section removed

**🚀 Ready for production use!**