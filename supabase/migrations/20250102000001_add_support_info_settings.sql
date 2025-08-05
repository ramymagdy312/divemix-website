-- Add support info settings to control footer support section
INSERT INTO settings (key, value, description) VALUES
  ('support_section_title', 'Support', 'Title for support section in footer'),
  ('support_section_enabled', 'true', 'Show support section in footer (true/false)'),
  ('support_items', '[
    {
      "id": "working_hours",
      "icon": "Clock",
      "title": "Working Hours",
      "subtitle": "Mon - Fri: 9:00 AM - 6:00 PM",
      "enabled": true
    },
    {
      "id": "languages",
      "icon": "Globe",
      "title": "Languages",
      "subtitle": "Arabic, English",
      "enabled": true
    },
    {
      "id": "quality_certified",
      "icon": "Shield",
      "title": "Quality Certified",
      "subtitle": "ISO 9001:2015",
      "enabled": true
    }
  ]', 'JSON array of support items to display in footer')
ON CONFLICT (key) DO NOTHING;