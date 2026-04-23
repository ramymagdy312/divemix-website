/**
 * Static, build-time known locales. This is the UNIVERSE of locales the
 * application has been built against (message bundles, fonts, etc.). The
 * admin can toggle which of these are active at runtime via the
 * `language_settings` table (see `app/lib/i18n/languages.ts`).
 *
 * Adding a new locale to the product:
 *  1. Add the code here
 *  2. Create `messages/<code>.json`
 *  3. Add a row to `language_settings` (via admin UI or seed)
 *  4. If the locale is RTL, add the language setting with is_rtl = true
 */
export const locales = ['en', 'ar', 'de'] as const;
export type Locale = (typeof locales)[number];

/**
 * Static fallback default used before the DB has been read (e.g. during
 * build, or when the `language_settings` table is temporarily unavailable).
 * The effective default at runtime is what the admin configured; see
 * `getDefaultLocale()` in `app/lib/i18n/languages.ts`.
 */
export const defaultLocale: Locale = 'en';

/**
 * Static RTL list. Runtime RTL should be resolved against `language_settings`
 * via `isRtlAsync(locale)`; this is only used as a safe fallback.
 */
export const rtlLocales: Locale[] = ['ar'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  de: 'Deutsch',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  ar: '🇸🇦',
  de: '🇩🇪',
};

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

/**
 * Shape of a row in `language_settings`, without timestamps.
 * Shared between server-only fetchers and the edge/middleware fetcher so
 * the two are kept in lockstep.
 */
export interface LanguageSetting {
  code: string;
  name: string;
  native_name: string;
  flag: string | null;
  enabled: boolean;
  is_default: boolean;
  is_fallback: boolean;
  is_rtl: boolean;
  display_order: number;
}

/**
 * The resolved, normalized snapshot the rest of the app consumes. Always
 * has at least one enabled locale, one default, and one fallback, even if
 * the DB is unavailable (we fall back to the static config).
 */
export interface ResolvedLanguages {
  languages: LanguageSetting[];   // sorted by display_order
  enabled: string[];              // enabled locale codes in display order
  default: string;                // enabled default locale
  fallback: string;               // enabled fallback locale
  rtl: string[];                  // enabled RTL locale codes
}

/**
 * Builds a safe fallback `ResolvedLanguages` snapshot derived purely from
 * the static config. Used when the DB cannot be reached.
 */
export function buildStaticFallbackLanguages(): ResolvedLanguages {
  const languages: LanguageSetting[] = locales.map((code, index) => ({
    code,
    name: localeNames[code],
    native_name: localeNames[code],
    flag: localeFlags[code] ?? null,
    enabled: true,
    is_default: code === defaultLocale,
    is_fallback: code === defaultLocale,
    is_rtl: rtlLocales.includes(code),
    display_order: index,
  }));

  return {
    languages,
    enabled: [...locales],
    default: defaultLocale,
    fallback: defaultLocale,
    rtl: [...rtlLocales],
  };
}
