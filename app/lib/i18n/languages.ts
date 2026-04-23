import 'server-only';
import { unstable_cache } from 'next/cache';
import { createServerSupabaseClient } from '../supabase-server';
import {
  buildStaticFallbackLanguages,
  type LanguageSetting,
  type ResolvedLanguages,
} from './config';

/**
 * Cache tag used for all reads of the `language_settings` table. Bust this
 * tag whenever the admin saves changes so the next request picks up the
 * new configuration across the whole app (metadata, layouts, pages).
 */
export const LANGUAGE_SETTINGS_CACHE_TAG = 'language-settings';

const LANGUAGE_SETTINGS_CACHE_KEY = ['language-settings'];

/**
 * Normalizes rows from the DB into a `ResolvedLanguages` snapshot. If the
 * DB state is somehow invalid (no enabled rows, no default, no fallback),
 * we repair it in-memory so the rest of the app keeps working.
 */
function normalize(rows: LanguageSetting[]): ResolvedLanguages {
  if (rows.length === 0) {
    return buildStaticFallbackLanguages();
  }

  const sorted = [...rows].sort(
    (a, b) => a.display_order - b.display_order || a.code.localeCompare(b.code)
  );

  const enabledRows = sorted.filter((r) => r.enabled);
  const finalEnabled = enabledRows.length > 0 ? enabledRows : sorted.slice(0, 1);

  const defaultRow =
    finalEnabled.find((r) => r.is_default) ?? finalEnabled[0];
  const fallbackRow =
    finalEnabled.find((r) => r.is_fallback) ?? defaultRow;

  return {
    languages: sorted,
    enabled: finalEnabled.map((r) => r.code),
    default: defaultRow.code,
    fallback: fallbackRow.code,
    rtl: finalEnabled.filter((r) => r.is_rtl).map((r) => r.code),
  };
}

async function fetchLanguageSettingsRaw(): Promise<LanguageSetting[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('language_settings')
      .select(
        'code, name, native_name, flag, enabled, is_default, is_fallback, is_rtl, display_order'
      )
      .order('display_order', { ascending: true });

    if (error) {
      // Table might not exist yet during first deploy / initial migration.
      // We log at debug level so it is visible but does not break SSR.
      console.warn('[i18n/languages] Falling back to static config:', error.message);
      return [];
    }
    return (data ?? []) as LanguageSetting[];
  } catch (err) {
    console.warn('[i18n/languages] Unexpected error, using static fallback:', err);
    return [];
  }
}

/**
 * Server-only cached fetcher for language settings. Cached by Next's Data
 * Cache and tagged with `language-settings`. Never throws - on failure the
 * static `locales` config is used so the site keeps rendering.
 */
export const getLanguageSettings = unstable_cache(
  async (): Promise<ResolvedLanguages> => {
    const rows = await fetchLanguageSettingsRaw();
    return normalize(rows);
  },
  LANGUAGE_SETTINGS_CACHE_KEY,
  {
    tags: [LANGUAGE_SETTINGS_CACHE_TAG],
    revalidate: 60, // safety net if a revalidate call is missed
  }
);

/** Convenience accessors - all go through the cache above. */
export async function getEnabledLocales(): Promise<string[]> {
  const s = await getLanguageSettings();
  return s.enabled;
}

export async function getDefaultLocaleAsync(): Promise<string> {
  const s = await getLanguageSettings();
  return s.default;
}

export async function getFallbackLocaleAsync(): Promise<string> {
  const s = await getLanguageSettings();
  return s.fallback;
}

export async function isEnabledLocale(code: string): Promise<boolean> {
  const s = await getLanguageSettings();
  return s.enabled.includes(code);
}

export async function isRtlAsync(code: string): Promise<boolean> {
  const s = await getLanguageSettings();
  return s.rtl.includes(code);
}
