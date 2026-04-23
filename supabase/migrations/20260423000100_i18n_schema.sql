/*
  # I18n schema: convert translatable TEXT/TEXT[] columns to JSONB {en,ar,de}

  - Adds helper function `i18n_text(val jsonb, loc text)` to resolve a JSONB
    localized value with fallback to English.
  - For every translatable column across CMS tables, converts the column in
    place to JSONB, wrapping the existing value as {"en": <old>, "ar": <old>, "de": <old>}
    so the website keeps rendering while admins refine AR/DE translations.
  - Non-text data (slugs, image URLs, flags, ordering, uuids) is left untouched.
  - Uses DO $$ IF EXISTS $$ guards so the script is idempotent and safe against
    schemas whose optional tables were never created.
*/

-- =============================================================================
-- Helper function to resolve a localized JSONB value to text with fallback.
-- =============================================================================
CREATE OR REPLACE FUNCTION i18n_text(val jsonb, loc text DEFAULT 'en')
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result text;
BEGIN
  IF val IS NULL THEN
    RETURN NULL;
  END IF;

  -- If the value is a plain JSON string (legacy), return it as-is.
  IF jsonb_typeof(val) = 'string' THEN
    RETURN val #>> '{}';
  END IF;

  IF jsonb_typeof(val) <> 'object' THEN
    RETURN val::text;
  END IF;

  result := val ->> loc;
  IF result IS NOT NULL AND length(result) > 0 THEN
    RETURN result;
  END IF;

  result := val ->> 'en';
  IF result IS NOT NULL AND length(result) > 0 THEN
    RETURN result;
  END IF;

  -- Any other non-empty value
  SELECT v INTO result
  FROM jsonb_each_text(val) AS kv(k, v)
  WHERE v IS NOT NULL AND length(v) > 0
  LIMIT 1;

  RETURN result;
END;
$$;

-- =============================================================================
-- Generic helper: convert a TEXT column on a given table to JSONB {en,ar,de}
-- wrapping the existing value. Safe to run multiple times.
-- =============================================================================
CREATE OR REPLACE FUNCTION _i18n_convert_text_column(
  p_table text,
  p_column text
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_type text;
BEGIN
  SELECT data_type INTO v_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = p_table AND column_name = p_column;

  IF v_type IS NULL THEN
    -- Column doesn't exist; nothing to do.
    RETURN;
  END IF;

  IF v_type = 'jsonb' THEN
    -- Already JSONB. Make sure existing non-object values are normalized.
    EXECUTE format(
      'UPDATE public.%I SET %I = jsonb_build_object(''en'', (%I #>> ''{}''), ''ar'', (%I #>> ''{}''), ''de'', (%I #>> ''{}''))
       WHERE %I IS NOT NULL AND jsonb_typeof(%I) <> ''object''',
      p_table, p_column, p_column, p_column, p_column, p_column, p_column
    );
    RETURN;
  END IF;

  IF v_type = 'text' OR v_type = 'character varying' THEN
    -- Convert TEXT -> JSONB wrapping.
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN %I DROP DEFAULT',
      p_table, p_column
    );
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN %I TYPE jsonb USING
         CASE
           WHEN %I IS NULL THEN NULL
           ELSE jsonb_build_object(''en'', %I, ''ar'', %I, ''de'', %I)
         END',
      p_table, p_column, p_column, p_column, p_column, p_column
    );
    RETURN;
  END IF;
END;
$$;

-- =============================================================================
-- Scalar helper: convert a TEXT[] into a JSONB array of {en,ar,de} objects.
-- Must be a real function (not a subquery) so it can be used inside an
-- ALTER TABLE ... USING clause, which Postgres forbids from containing
-- subqueries ("cannot use subquery in transform expression").
-- =============================================================================
CREATE OR REPLACE FUNCTION _i18n_text_array_to_jsonb(arr text[])
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    jsonb_agg(jsonb_build_object('en', v, 'ar', v, 'de', v)),
    '[]'::jsonb
  )
  FROM unnest(arr) AS v;
$$;

-- =============================================================================
-- Generic helper: convert a TEXT[] column to JSONB array of {en,ar,de} objects.
-- =============================================================================
CREATE OR REPLACE FUNCTION _i18n_convert_text_array_column(
  p_table text,
  p_column text
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_type text;
  v_udt text;
BEGIN
  SELECT data_type, udt_name INTO v_type, v_udt
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = p_table AND column_name = p_column;

  IF v_type IS NULL THEN
    RETURN;
  END IF;

  IF v_type = 'ARRAY' AND v_udt IN ('_text', '_varchar') THEN
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN %I DROP DEFAULT',
      p_table, p_column
    );
    -- NOTE: the USING clause cannot contain a subquery, so we delegate the
    -- per-row array->jsonb conversion to the _i18n_text_array_to_jsonb()
    -- function defined above.
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN %I TYPE jsonb USING
         CASE
           WHEN %I IS NULL THEN ''[]''::jsonb
           ELSE _i18n_text_array_to_jsonb(%I)
         END',
      p_table, p_column, p_column, p_column
    );
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN %I SET DEFAULT ''[]''::jsonb',
      p_table, p_column
    );
    RETURN;
  END IF;

  -- Already JSONB: leave as-is (admin form will manage shape).
END;
$$;

-- =============================================================================
-- Convert translatable columns across all CMS tables.
-- Every call is idempotent and skips columns/tables that don't exist.
-- =============================================================================

-- Singleton: home_page
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='home_page') THEN
    PERFORM _i18n_convert_text_column('home_page', 'hero_title');
    PERFORM _i18n_convert_text_column('home_page', 'hero_subtitle');
    PERFORM _i18n_convert_text_column('home_page', 'contact_cta_title');
    PERFORM _i18n_convert_text_column('home_page', 'contact_cta_body');
  END IF;
END $$;

-- Singleton: gallery_page
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='gallery_page') THEN
    PERFORM _i18n_convert_text_column('gallery_page', 'title');
    PERFORM _i18n_convert_text_column('gallery_page', 'description');
    PERFORM _i18n_convert_text_column('gallery_page', 'intro_title');
    PERFORM _i18n_convert_text_column('gallery_page', 'intro_description');
  END IF;
END $$;

-- Singletons: products_page, services_page, applications_page
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['products_page', 'services_page', 'applications_page']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name = tbl) THEN
      PERFORM _i18n_convert_text_column(tbl, 'title');
      PERFORM _i18n_convert_text_column(tbl, 'description');
      PERFORM _i18n_convert_text_column(tbl, 'intro_title');
      PERFORM _i18n_convert_text_column(tbl, 'intro_description');
    END IF;
  END LOOP;
END $$;

-- Singleton: about_page (variety of possible fields)
DO $$
DECLARE
  col text;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='about_page') THEN
    FOREACH col IN ARRAY ARRAY[
      'title',
      'description',
      'intro_title',
      'intro_description',
      'vision',
      'mission',
      'company_overview'
    ]
    LOOP
      PERFORM _i18n_convert_text_column('about_page', col);
    END LOOP;
  END IF;
END $$;

-- Singleton: contact_page
DO $$
DECLARE
  col text;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='contact_page') THEN
    FOREACH col IN ARRAY ARRAY['title', 'description', 'intro_title', 'intro_description']
    LOOP
      PERFORM _i18n_convert_text_column('contact_page', col);
    END LOOP;
  END IF;
END $$;

-- Navigation items
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='nav_items') THEN
    PERFORM _i18n_convert_text_column('nav_items', 'label');
  END IF;
END $$;

-- Footer content (top-level fields). The JSONB `columns` shape is evolved
-- in-place so each link label + column title becomes {en,ar,de}.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='footer_content') THEN
    PERFORM _i18n_convert_text_column('footer_content', 'powered_by_text');
    PERFORM _i18n_convert_text_column('footer_content', 'copyright_name');

    -- Transform columns JSONB in place if it still has plain-text title/label
    UPDATE footer_content
    SET columns = COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'title',
          CASE
            WHEN jsonb_typeof(col->'title') = 'object' THEN col->'title'
            ELSE jsonb_build_object('en', col->>'title', 'ar', col->>'title', 'de', col->>'title')
          END,
          'links',
          COALESCE((
            SELECT jsonb_agg(
              jsonb_build_object(
                'label',
                CASE
                  WHEN jsonb_typeof(lnk->'label') = 'object' THEN lnk->'label'
                  ELSE jsonb_build_object('en', lnk->>'label', 'ar', lnk->>'label', 'de', lnk->>'label')
                END,
                'href', lnk->>'href'
              )
            )
            FROM jsonb_array_elements(col->'links') AS lnk
          ), '[]'::jsonb)
        )
      )
      FROM jsonb_array_elements(columns) AS col
    ), '[]'::jsonb)
    WHERE columns IS NOT NULL AND jsonb_typeof(columns) = 'array';
  END IF;
END $$;

-- Page SEO: title + description -> JSONB; keywords[] -> JSONB array of {en,ar,de}
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='page_seo') THEN
    PERFORM _i18n_convert_text_column('page_seo', 'title');
    PERFORM _i18n_convert_text_column('page_seo', 'description');
    PERFORM _i18n_convert_text_array_column('page_seo', 'keywords');
  END IF;
END $$;

-- Home page JSONB sub-structures: ctas + stats labels
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='home_page') THEN
    UPDATE home_page SET hero_cta_primary = jsonb_set(
      hero_cta_primary,
      '{label}',
      CASE
        WHEN jsonb_typeof(hero_cta_primary->'label') = 'object' THEN hero_cta_primary->'label'
        ELSE jsonb_build_object('en', hero_cta_primary->>'label', 'ar', hero_cta_primary->>'label', 'de', hero_cta_primary->>'label')
      END,
      true
    )
    WHERE hero_cta_primary IS NOT NULL
      AND jsonb_typeof(hero_cta_primary->'label') <> 'object';

    UPDATE home_page SET hero_cta_secondary = jsonb_set(
      hero_cta_secondary,
      '{label}',
      CASE
        WHEN jsonb_typeof(hero_cta_secondary->'label') = 'object' THEN hero_cta_secondary->'label'
        ELSE jsonb_build_object('en', hero_cta_secondary->>'label', 'ar', hero_cta_secondary->>'label', 'de', hero_cta_secondary->>'label')
      END,
      true
    )
    WHERE hero_cta_secondary IS NOT NULL
      AND jsonb_typeof(hero_cta_secondary->'label') <> 'object';

    UPDATE home_page SET contact_cta_button = jsonb_set(
      contact_cta_button,
      '{label}',
      CASE
        WHEN jsonb_typeof(contact_cta_button->'label') = 'object' THEN contact_cta_button->'label'
        ELSE jsonb_build_object('en', contact_cta_button->>'label', 'ar', contact_cta_button->>'label', 'de', contact_cta_button->>'label')
      END,
      true
    )
    WHERE contact_cta_button IS NOT NULL
      AND jsonb_typeof(contact_cta_button->'label') <> 'object';

    UPDATE home_page SET stats = COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'icon', s->>'icon',
          'value', s->>'value',
          'label',
          CASE
            WHEN jsonb_typeof(s->'label') = 'object' THEN s->'label'
            ELSE jsonb_build_object('en', s->>'label', 'ar', s->>'label', 'de', s->>'label')
          END
        )
      )
      FROM jsonb_array_elements(stats) AS s
    ), '[]'::jsonb)
    WHERE stats IS NOT NULL AND jsonb_typeof(stats) = 'array';
  END IF;
END $$;

-- Products
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='products') THEN
    PERFORM _i18n_convert_text_column('products', 'name');
    PERFORM _i18n_convert_text_column('products', 'description');
    PERFORM _i18n_convert_text_array_column('products', 'features');
  END IF;
END $$;

-- Services
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='services') THEN
    PERFORM _i18n_convert_text_column('services', 'title');
    PERFORM _i18n_convert_text_column('services', 'description');
    PERFORM _i18n_convert_text_array_column('services', 'features');
  END IF;
END $$;

-- Applications
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='applications') THEN
    PERFORM _i18n_convert_text_column('applications', 'name');
    PERFORM _i18n_convert_text_column('applications', 'description');
    PERFORM _i18n_convert_text_array_column('applications', 'features');
  END IF;
END $$;

-- Product categories (slug stays plain)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='product_categories') THEN
    PERFORM _i18n_convert_text_column('product_categories', 'name');
    PERFORM _i18n_convert_text_column('product_categories', 'description');
    PERFORM _i18n_convert_text_array_column('product_categories', 'features');
  END IF;
END $$;

-- Vendors
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='vendors') THEN
    PERFORM _i18n_convert_text_column('vendors', 'name');
    PERFORM _i18n_convert_text_column('vendors', 'description');
  END IF;
END $$;

-- Gallery images
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='gallery_images') THEN
    PERFORM _i18n_convert_text_column('gallery_images', 'title');
    PERFORM _i18n_convert_text_column('gallery_images', 'description');
  END IF;
END $$;

-- Settings: content keys are converted to JSON-encoded {en,ar,de} while
-- operational keys (emails, numbers, URLs) stay as plain strings.
DO $$
DECLARE
  content_keys text[] := ARRAY[
    'company_name',
    'company_tagline',
    'logo_alt',
    'footer_branches_title',
    'support_section_title'
  ];
  k text;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='settings') THEN
    FOREACH k IN ARRAY content_keys
    LOOP
      UPDATE settings
      SET value = jsonb_build_object('en', value, 'ar', value, 'de', value)::text
      WHERE key = k
        AND value IS NOT NULL
        AND left(trim(value), 1) <> '{';
    END LOOP;
  END IF;
END $$;

-- =============================================================================
-- Cleanup helpers (optional): leave the helper functions around so that
-- follow-up migrations can reuse them, but drop the temporary one-shots if
-- they become obsolete. For now we keep them.
-- =============================================================================
