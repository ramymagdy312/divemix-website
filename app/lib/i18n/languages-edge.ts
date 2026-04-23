import {
  buildStaticFallbackLanguages,
  type LanguageSetting,
  type ResolvedLanguages,
} from './config';

/**
 * Edge-runtime safe fetcher for language settings. Used by the Next.js
 * middleware which cannot talk to `@/app/lib/supabase-server` (it relies
 * on Node APIs not available on the edge) and cannot use
 * `unstable_cache` (not supported in middleware).
 *
 * Strategy:
 *  - Hit Supabase's PostgREST endpoint directly with `fetch`.
 *  - Cache the result in a module-level variable with a short TTL so that
 *    the middleware does not query the DB on every single request.
 *  - On any failure (missing env, network, 4xx/5xx, table missing) fall
 *    back to the static config so the public site never breaks.
 *
 * When an admin saves changes, they should call `bustLanguageSettingsEdgeCache()`
 * via a server route that the client hits; we also keep a short TTL so
 * the cache self-refreshes within ~30s even without manual invalidation.
 */

const TTL_MS = 30_000;

interface CacheEntry {
  ts: number;
  value: ResolvedLanguages;
}

let cached: CacheEntry | null = null;
let inflight: Promise<ResolvedLanguages> | null = null;

function normalize(rows: LanguageSetting[]): ResolvedLanguages {
  if (rows.length === 0) return buildStaticFallbackLanguages();

  const sorted = [...rows].sort(
    (a, b) => a.display_order - b.display_order || a.code.localeCompare(b.code)
  );
  const enabledRows = sorted.filter((r) => r.enabled);
  const finalEnabled = enabledRows.length > 0 ? enabledRows : sorted.slice(0, 1);
  const defaultRow = finalEnabled.find((r) => r.is_default) ?? finalEnabled[0];
  const fallbackRow = finalEnabled.find((r) => r.is_fallback) ?? defaultRow;

  return {
    languages: sorted,
    enabled: finalEnabled.map((r) => r.code),
    default: defaultRow.code,
    fallback: fallbackRow.code,
    rtl: finalEnabled.filter((r) => r.is_rtl).map((r) => r.code),
  };
}

async function fetchFromSupabase(): Promise<ResolvedLanguages> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return buildStaticFallbackLanguages();
  }

  try {
    const endpoint =
      `${url}/rest/v1/language_settings` +
      `?select=code,name,native_name,flag,enabled,is_default,is_fallback,is_rtl,display_order` +
      `&order=display_order.asc`;

    const res = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
      },
      // Middleware/edge: bypass the Next Data Cache, we do our own in-memory
      // caching above. Using 'no-store' avoids interfering with per-route
      // caching semantics elsewhere.
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(
        `[i18n/languages-edge] PostgREST responded ${res.status}, using static fallback`
      );
      return buildStaticFallbackLanguages();
    }

    const rows = (await res.json()) as LanguageSetting[];
    return normalize(rows);
  } catch (err) {
    console.warn('[i18n/languages-edge] Fetch failed, using static fallback:', err);
    return buildStaticFallbackLanguages();
  }
}

/**
 * Returns the current language settings snapshot, using an in-memory cache
 * with a short TTL. Safe to call on every middleware invocation.
 */
export async function getLanguageSettingsEdge(): Promise<ResolvedLanguages> {
  const now = Date.now();

  if (cached && now - cached.ts < TTL_MS) {
    return cached.value;
  }

  if (inflight) return inflight;

  inflight = fetchFromSupabase()
    .then((value) => {
      cached = { ts: Date.now(), value };
      return value;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Manually bust the edge cache (e.g. after an admin save). */
export function bustLanguageSettingsEdgeCache(): void {
  cached = null;
  inflight = null;
}
