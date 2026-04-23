import {
  buildStaticFallbackLanguages,
  defaultLocale as staticDefault,
  locales as staticLocales,
  type LanguageSetting,
  type ResolvedLanguages,
} from './config';

/**
 * Client-side runtime registry of the active language configuration.
 *
 * This module intentionally has **zero React dependency** so helpers like
 * `normalizeI18n` / `seedI18n` can consult it without becoming client
 * components. The value is populated by the client `LanguagesProvider`
 * on mount (and kept in sync with admin changes), and also by the
 * public-site `LanguageSwitcher` when it fetches the list for the
 * first time.
 *
 * On the server or before the first client fetch completes, this
 * returns the static fallback snapshot from `app/lib/i18n/config.ts`
 * so every code path always gets a valid list.
 */

let runtime: ResolvedLanguages = buildStaticFallbackLanguages();
let hydrated = false;

const listeners = new Set<(snapshot: ResolvedLanguages) => void>();

function normalize(langs: LanguageSetting[]): ResolvedLanguages {
  if (!langs || langs.length === 0) return buildStaticFallbackLanguages();

  const sorted = [...langs].sort(
    (a, b) => a.display_order - b.display_order || a.code.localeCompare(b.code)
  );
  const enabled = sorted.filter((l) => l.enabled);
  const final = enabled.length > 0 ? enabled : sorted.slice(0, 1);
  const def = final.find((l) => l.is_default) ?? final[0];
  const fb = final.find((l) => l.is_fallback) ?? def;

  return {
    languages: sorted,
    enabled: final.map((l) => l.code),
    default: def.code,
    fallback: fb.code,
    rtl: final.filter((l) => l.is_rtl).map((l) => l.code),
  };
}

/** Returns a live read-only view of the current runtime language snapshot. */
export function getRuntimeLanguages(): ResolvedLanguages {
  return runtime;
}

export function getRuntimeEnabledCodes(): string[] {
  return runtime.enabled.length > 0 ? runtime.enabled : [...staticLocales];
}

export function getRuntimeDefault(): string {
  return runtime.default || staticDefault;
}

export function getRuntimeFallback(): string {
  return runtime.fallback || runtime.default || staticDefault;
}

export function getRuntimeRtlCodes(): string[] {
  return runtime.rtl;
}

export function isRuntimeHydrated(): boolean {
  return hydrated;
}

/**
 * Replace the runtime snapshot. Called by `LanguagesProvider` when it
 * has a fresh list from the DB. Notifies any subscribers.
 */
export function setRuntimeLanguages(langs: LanguageSetting[]): ResolvedLanguages {
  runtime = normalize(langs);
  hydrated = true;
  listeners.forEach((l) => {
    try {
      l(runtime);
    } catch {
      /* isolated */
    }
  });
  return runtime;
}

/**
 * Subscribe to runtime changes. Returns an unsubscribe function.
 * Safe in server components (no-op).
 */
export function subscribeRuntimeLanguages(
  listener: (snapshot: ResolvedLanguages) => void
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
