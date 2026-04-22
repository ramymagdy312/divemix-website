/*
  # CMS completeness for dynamic platform

  Adds missing content-model tables for dynamic navigation, homepage,
  footer links, gallery page header, and route-level SEO.
*/

-- 1) Homepage singleton
CREATE TABLE IF NOT EXISTS home_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Pioneering the Future of Gas Technology',
  hero_subtitle TEXT NOT NULL DEFAULT 'Leading the industry with innovative solutions for gas mixing and compression systems. Trust DiveMix for reliability, precision, and excellence.',
  hero_image TEXT NOT NULL DEFAULT '/img/hero/home.jpg',
  hero_cta_primary JSONB NOT NULL DEFAULT '{"label":"Explore Products","href":"/products"}',
  hero_cta_secondary JSONB NOT NULL DEFAULT '{"label":"Contact Us","href":"/contact"}',
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  show_company_teaser BOOLEAN NOT NULL DEFAULT true,
  show_contact_cta BOOLEAN NOT NULL DEFAULT false,
  contact_cta_title TEXT NOT NULL DEFAULT 'Ready to Get Started?',
  contact_cta_body TEXT NOT NULL DEFAULT 'Contact our team of experts for a consultation and discover how we can help optimize your operations',
  contact_cta_button JSONB NOT NULL DEFAULT '{"label":"Contact Us Today","href":"/contact"}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Gallery page singleton
CREATE TABLE IF NOT EXISTS gallery_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Gallery',
  description TEXT NOT NULL DEFAULT 'Experience our world-class facilities and installations through our curated collection of images',
  hero_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=2000',
  intro_title TEXT NOT NULL DEFAULT 'Our Work in Action',
  intro_description TEXT NOT NULL DEFAULT 'Explore installations, maintenance workflows, and project highlights from our partners and clients.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) Dynamic nav items
CREATE TABLE IF NOT EXISTS nav_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  parent_id UUID NULL REFERENCES nav_items(id) ON DELETE CASCADE,
  is_external BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (label, href)
);

-- 4) Footer content singleton
CREATE TABLE IF NOT EXISTS footer_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  powered_by_text TEXT NOT NULL DEFAULT 'DevsDiamond',
  copyright_name TEXT NOT NULL DEFAULT 'Divemix',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Route-level SEO
CREATE TABLE IF NOT EXISTS page_seo (
  route TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  og_image TEXT,
  keywords TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  noindex BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (matching existing repo convention)
ALTER TABLE home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'home_page' AND policyname = 'home_page_public_read') THEN
    CREATE POLICY home_page_public_read ON home_page FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'home_page' AND policyname = 'home_page_auth_all') THEN
    CREATE POLICY home_page_auth_all ON home_page FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_page' AND policyname = 'gallery_page_public_read') THEN
    CREATE POLICY gallery_page_public_read ON gallery_page FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_page' AND policyname = 'gallery_page_auth_all') THEN
    CREATE POLICY gallery_page_auth_all ON gallery_page FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nav_items' AND policyname = 'nav_items_public_read') THEN
    CREATE POLICY nav_items_public_read ON nav_items FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nav_items' AND policyname = 'nav_items_auth_all') THEN
    CREATE POLICY nav_items_auth_all ON nav_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'footer_content' AND policyname = 'footer_content_public_read') THEN
    CREATE POLICY footer_content_public_read ON footer_content FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'footer_content' AND policyname = 'footer_content_auth_all') THEN
    CREATE POLICY footer_content_auth_all ON footer_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'page_seo' AND policyname = 'page_seo_public_read') THEN
    CREATE POLICY page_seo_public_read ON page_seo FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'page_seo' AND policyname = 'page_seo_auth_all') THEN
    CREATE POLICY page_seo_auth_all ON page_seo FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS home_page_set_updated_at ON home_page;
CREATE TRIGGER home_page_set_updated_at BEFORE UPDATE ON home_page FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS gallery_page_set_updated_at ON gallery_page;
CREATE TRIGGER gallery_page_set_updated_at BEFORE UPDATE ON gallery_page FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS nav_items_set_updated_at ON nav_items;
CREATE TRIGGER nav_items_set_updated_at BEFORE UPDATE ON nav_items FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS footer_content_set_updated_at ON footer_content;
CREATE TRIGGER footer_content_set_updated_at BEFORE UPDATE ON footer_content FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS page_seo_set_updated_at ON page_seo;
CREATE TRIGGER page_seo_set_updated_at BEFORE UPDATE ON page_seo FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- Seed singleton rows (idempotent)
INSERT INTO home_page (
  hero_title,
  hero_subtitle,
  hero_image,
  hero_cta_primary,
  hero_cta_secondary,
  stats,
  show_company_teaser,
  show_contact_cta,
  contact_cta_title,
  contact_cta_body,
  contact_cta_button
)
SELECT
  'Pioneering the Future of Gas Technology',
  'Leading the industry with innovative solutions for gas mixing and compression systems. Trust DiveMix for reliability, precision, and excellence.',
  '/img/hero/home.jpg',
  '{"label":"Explore Products","href":"/products"}'::jsonb,
  '{"label":"Contact Us","href":"/contact"}'::jsonb,
  '[
    {"icon":"Award","value":"20+","label":"Years Experience"},
    {"icon":"Users","value":"1000+","label":"Projects Completed"},
    {"icon":"Globe","value":"50+","label":"Countries Served"},
    {"icon":"Clock","value":"24/7","label":"Support Available"}
  ]'::jsonb,
  true,
  false,
  'Ready to Get Started?',
  'Contact our team of experts for a consultation and discover how we can help optimize your operations',
  '{"label":"Contact Us Today","href":"/contact"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM home_page);

INSERT INTO gallery_page (title, description, hero_image, intro_title, intro_description)
SELECT
  'Gallery',
  'Experience our world-class facilities and installations through our curated collection of images',
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=2000',
  'Our Work in Action',
  'Explore installations, maintenance workflows, and project highlights from our partners and clients.'
WHERE NOT EXISTS (SELECT 1 FROM gallery_page);

INSERT INTO footer_content (columns, powered_by_text, copyright_name)
SELECT
  '[
    {"title":"Company","links":[{"label":"About Us","href":"/about"},{"label":"Gallery","href":"/gallery"},{"label":"Contact Us","href":"/contact"}]},
    {"title":"Our Services","links":[{"label":"Products","href":"/products"},{"label":"Services","href":"/services"},{"label":"Applications","href":"/applications"}]}
  ]'::jsonb,
  'DevsDiamond',
  'Divemix'
WHERE NOT EXISTS (SELECT 1 FROM footer_content);

INSERT INTO nav_items (label, href, sort_order, is_external, is_active)
VALUES
  ('Home', '/', 1, false, true),
  ('Products', '/products', 2, false, true),
  ('Services', '/services', 3, false, true),
  ('Applications', '/applications', 4, false, true),
  ('Gallery', '/gallery', 5, false, true),
  ('Contact', '/contact', 6, false, true),
  ('About', '/about', 7, false, true)
ON CONFLICT (label, href) DO UPDATE
SET sort_order = EXCLUDED.sort_order,
    is_external = EXCLUDED.is_external,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO page_seo (route, title, description, og_image, keywords, noindex)
VALUES
  ('/', 'DiveMix - Gas & Compressor Technologies', 'Leading the industry in compressed air and gas solutions since 1990', '/img/faveicon.ico', ARRAY['gas technology','compressors','industrial solutions','divemix'], false),
  ('/about', 'About DiveMix', 'Learn about DiveMix vision, mission, and journey in gas and compressor technologies.', NULL, ARRAY['about divemix','mission','vision'], false),
  ('/products', 'DiveMix Products', 'Explore DiveMix products for gas mixing and compression systems.', NULL, ARRAY['products','compressors','gas systems'], false),
  ('/services', 'DiveMix Services', 'Discover DiveMix maintenance, installation, and support services.', NULL, ARRAY['services','installation','maintenance'], false),
  ('/applications', 'DiveMix Applications', 'See how DiveMix solutions serve multiple industrial applications.', NULL, ARRAY['applications','industry','solutions'], false),
  ('/gallery', 'DiveMix Gallery', 'Browse projects, installations, and maintenance galleries from DiveMix.', NULL, ARRAY['gallery','projects','installations'], false),
  ('/contact', 'Contact DiveMix', 'Get in touch with DiveMix experts for products and services.', NULL, ARRAY['contact','support','divemix'], false)
ON CONFLICT (route) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    og_image = EXCLUDED.og_image,
    keywords = EXCLUDED.keywords,
    noindex = EXCLUDED.noindex,
    updated_at = NOW();

-- Extend settings defaults used by global dynamic layout
INSERT INTO settings (key, value, description)
VALUES
  ('company_name', 'DiveMix', 'Company display name'),
  ('company_tagline', 'Gas & Compressor Technologies', 'Company short tagline'),
  ('logo_url', '/img/logoWhite.png', 'Primary logo URL'),
  ('logo_alt', 'DiveMix Logo', 'Logo alt text'),
  ('facebook_url', '', 'Facebook profile URL'),
  ('linkedin_url', '', 'LinkedIn profile URL'),
  ('twitter_url', '', 'Twitter/X profile URL')
ON CONFLICT (key) DO NOTHING;
