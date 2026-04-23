import { defaultLocale, locales as staticLocales, type Locale } from './config';
import { getRuntimeEnabledCodes, getRuntimeFallback } from './runtime';

export type I18nText =
  | { [code: string]: string | null | undefined }
  | string
  | null
  | undefined;

/**
 * Shape used by admin editors. Historically this was strictly
 * `{ en, ar, de }`; to support dynamic languages we widen it to a
 * generic record while keeping `en` present (it is always seeded and
 * is the ultimate safety-net fallback).
 */
export type I18nValue = { en: string } & Record<string, string>;

/**
 * Resolves an i18n JSONB value to a plain string for the given locale.
 * Fallback order: requested locale -> defaultLocale (en) -> first non-empty value -> empty string.
 * If the value is already a plain string, it is returned as-is (for legacy rows).
 */
export function resolveI18n(value: I18nText, locale: Locale | string): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';

  const obj = value as Record<string, string | null | undefined>;
  const primary = obj[locale];
  if (typeof primary === 'string' && primary.trim().length > 0) return primary;

  const fallback = obj[defaultLocale];
  if (typeof fallback === 'string' && fallback.trim().length > 0) return fallback;

  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim().length > 0) return v;
  }
  return '';
}

/**
 * Heuristic to detect an i18n JSONB node: an object whose keys are
 * exclusively short locale-like codes and whose values are all
 * string | null | undefined. This used to be hard-coded to en/ar/de;
 * with dynamic languages we check the key shape instead.
 */
function isI18nNode(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value as Record<string, unknown>);
  if (keys.length === 0) return false;
  const allLocaleKeys = keys.every((k) => /^[a-z]{2,3}(-[a-z0-9]+)?$/i.test(k));
  if (!allLocaleKeys) return false;
  const allStringValues = Object.values(value as Record<string, unknown>).every(
    (v) => v === null || v === undefined || typeof v === 'string'
  );
  return allStringValues;
}

/**
 * Deeply walks an object/array structure, converting any i18n node into
 * a plain string for the target locale. Non-i18n data is preserved.
 */
export function deepResolveI18n<T = unknown>(input: T, locale: Locale | string): T {
  if (input == null) return input;
  if (typeof input !== 'object') return input;

  if (Array.isArray(input)) {
    return input.map((item) => deepResolveI18n(item, locale)) as unknown as T;
  }

  if (isI18nNode(input)) {
    return resolveI18n(input as I18nText, locale) as unknown as T;
  }

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    out[key] = deepResolveI18n(value, locale);
  }
  return out as unknown as T;
}

/**
 * Computes the list of locale codes an editor should surface for a
 * given call. Preference order:
 *  1. explicit `codes` argument (callers that know what they want)
 *  2. the current runtime snapshot (kept in sync with the DB)
 *  3. the static compiled-in list (safety net)
 *
 * Always returns at least one code and always includes `en` as a
 * final safety net so we never lose content.
 */
function resolveTargetCodes(codes?: string[]): string[] {
  const primary =
    codes && codes.length > 0
      ? codes
      : getRuntimeEnabledCodes() || [...staticLocales];
  const set = new Set<string>(primary);
  set.add('en'); // safety net so resolveI18n's final fallback always has content
  return Array.from(set);
}

/**
 * Seeds an i18n value from a plain string. Every currently-enabled
 * locale (plus `en`) is populated with the supplied value so forms
 * can start rendering immediately. Callers can override with an
 * explicit `codes` list (e.g. tests).
 */
export function seedI18n(value: string, codes?: string[]): I18nValue {
  const target = resolveTargetCodes(codes);
  const out = {} as Record<string, string>;
  for (const code of target) out[code] = value;
  if (!out.en) out.en = value;
  return out as I18nValue;
}

/**
 * Ensures an i18n value has entries for every currently-enabled locale
 * (falling back to the value in the fallback / default locale when a
 * translation is missing). Preserves any extra keys already present on
 * the value so translations for *disabled* locales are not dropped —
 * re-enabling the locale later will bring its content back intact.
 */
export function normalizeI18n(value: I18nText, codes?: string[]): I18nValue {
  const target = resolveTargetCodes(codes);

  // Work out the best "seed" for empty slots.
  let seedText = '';
  let originalKeys: Record<string, string> = {};
  if (typeof value === 'string') {
    seedText = value;
  } else if (value && typeof value === 'object') {
    originalKeys = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (typeof v === 'string') originalKeys[k] = v;
    }
    const fallback = getRuntimeFallback();
    seedText =
      originalKeys[fallback] ||
      originalKeys['en'] ||
      originalKeys[defaultLocale] ||
      Object.values(originalKeys).find(
        (v) => typeof v === 'string' && v.length > 0
      ) ||
      '';
  }

  const out: Record<string, string> = { ...originalKeys };
  for (const code of target) {
    if (!out[code]) out[code] = seedText;
  }
  if (!out.en) out.en = seedText;
  return out as I18nValue;
}
