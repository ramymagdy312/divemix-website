-- Add footer settings to control branch display and WhatsApp visibility
INSERT INTO settings (key, value, description) VALUES
  ('show_branches_in_footer', 'true', 'Show branch contact information in footer (true/false)'),
  ('show_whatsapp_float', 'true', 'Show floating WhatsApp button (true/false)'),
  ('footer_branches_title', 'Our Branches', 'Title for branches section in footer')
ON CONFLICT (key) DO NOTHING;