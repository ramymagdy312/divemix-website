/*
  # Language Settings: dynamic multi-language management

  Adds a `language_settings` table that the admin dashboard uses to
  enable/disable languages, pick the default language, pick a required
  fallback language, and control display order in the public switcher.

  Design notes:
  - `code` is the locale code (e.g. 'en', 'ar', 'de'). This is the primary
    key and is used across the app (routing, next-intl, i18n_text helper).
  - `enabled` controls visibility on the public site.
  - `is_default` marks the *one* locale used when a user hits a path
    without a locale prefix (and as the fallback for SEO alternates).
  - `is_fallback` marks the *one* locale used as a content fallback when
    another language is missing a translation (usually English).
  - `display_order` controls the order in the language switcher.
  - `is_rtl` triggers right-to-left layout.

  Invariants enforced at the DB level:
  - Exactly one default locale (partial unique index).
  - Exactly one fallback locale (partial unique index).
  - The default and fallback must be `enabled` (enforced via trigger).
  - At least one locale must be `enabled` (enforced via trigger).

  Idempotent: safe to re-run; seeds only insert when rows are missing.
*/

-- =============================================================================
-- Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.language_settings (
  code          TEXT PRIMARY KEY
    CHECK (code ~ '^[a-z]{2,3}(-[A-Za-z0-9]+)?$'),
  name          TEXT NOT NULL,
  native_name   TEXT NOT NULL,
  flag          TEXT,
  enabled       BOOLEAN NOT NULL DEFAULT true,
  is_default    BOOLEAN NOT NULL DEFAULT false,
  is_fallback   BOOLEAN NOT NULL DEFAULT false,
  is_rtl        BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- Partial unique indexes: exactly one default + one fallback
-- =============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS language_settings_one_default_idx
  ON public.language_settings ((is_default)) WHERE is_default = true;

CREATE UNIQUE INDEX IF NOT EXISTS language_settings_one_fallback_idx
  ON public.language_settings ((is_fallback)) WHERE is_fallback = true;

CREATE INDEX IF NOT EXISTS language_settings_enabled_order_idx
  ON public.language_settings (enabled, display_order);

-- =============================================================================
-- Trigger: keep updated_at fresh + enforce enabled invariants
-- =============================================================================
CREATE OR REPLACE FUNCTION public._language_settings_before_write()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();

  -- Default locale must be enabled
  IF NEW.is_default = true AND NEW.enabled = false THEN
    RAISE EXCEPTION 'The default language must remain enabled (code=%)', NEW.code;
  END IF;

  -- Fallback locale must be enabled
  IF NEW.is_fallback = true AND NEW.enabled = false THEN
    RAISE EXCEPTION 'The fallback language must remain enabled (code=%)', NEW.code;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS language_settings_before_write ON public.language_settings;
CREATE TRIGGER language_settings_before_write
  BEFORE INSERT OR UPDATE ON public.language_settings
  FOR EACH ROW EXECUTE FUNCTION public._language_settings_before_write();

-- =============================================================================
-- Trigger: ensure at least one enabled language exists at all times
-- =============================================================================
CREATE OR REPLACE FUNCTION public._language_settings_after_write()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  enabled_count INTEGER;
  default_count INTEGER;
  fallback_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO enabled_count FROM public.language_settings WHERE enabled = true;
  IF enabled_count < 1 THEN
    RAISE EXCEPTION 'At least one language must be enabled at all times';
  END IF;

  SELECT COUNT(*) INTO default_count FROM public.language_settings WHERE is_default = true;
  IF default_count > 1 THEN
    RAISE EXCEPTION 'Only one language can be marked as default';
  END IF;

  SELECT COUNT(*) INTO fallback_count FROM public.language_settings WHERE is_fallback = true;
  IF fallback_count > 1 THEN
    RAISE EXCEPTION 'Only one language can be marked as fallback';
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS language_settings_after_write ON public.language_settings;
CREATE CONSTRAINT TRIGGER language_settings_after_write
  AFTER INSERT OR UPDATE OR DELETE ON public.language_settings
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION public._language_settings_after_write();

-- =============================================================================
-- Row Level Security
-- =============================================================================
ALTER TABLE public.language_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "language_settings_read_all" ON public.language_settings;
CREATE POLICY "language_settings_read_all"
  ON public.language_settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "language_settings_write_authenticated" ON public.language_settings;
CREATE POLICY "language_settings_write_authenticated"
  ON public.language_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- Seed: English (default + fallback), Arabic (rtl), German
-- =============================================================================
INSERT INTO public.language_settings
  (code, name, native_name, flag, enabled, is_default, is_fallback, is_rtl, display_order)
VALUES
  ('en', 'English', 'English',  '🇬🇧', true, true,  true,  false, 0),
  ('ar', 'Arabic',  'العربية', '🇸🇦', true, false, false, true,  1),
  ('de', 'German',  'Deutsch',  '🇩🇪', true, false, false, false, 2)
ON CONFLICT (code) DO NOTHING;
