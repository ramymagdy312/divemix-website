-- Add vendors section copy fields to home_page for CMS-driven heading/description
ALTER TABLE IF EXISTS public.home_page
  ADD COLUMN IF NOT EXISTS vendors_section_title text NOT NULL DEFAULT 'Our Trusted Partners',
  ADD COLUMN IF NOT EXISTS vendors_section_description text NOT NULL DEFAULT 'We collaborate with industry-leading companies to deliver exceptional solutions and services to our clients.';

-- Convert to i18n JSONB shape when still plain text
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'home_page') THEN
    PERFORM _i18n_convert_text_column('home_page', 'vendors_section_title');
    PERFORM _i18n_convert_text_column('home_page', 'vendors_section_description');
  END IF;
END $$;
