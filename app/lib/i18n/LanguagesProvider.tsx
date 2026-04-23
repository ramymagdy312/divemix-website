"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../supabase";
import {
  buildStaticFallbackLanguages,
  type LanguageSetting,
  type ResolvedLanguages,
} from "./config";
import {
  getRuntimeLanguages,
  setRuntimeLanguages,
  subscribeRuntimeLanguages,
} from "./runtime";

/**
 * The name of the global event that tells every mounted provider
 * instance to re-fetch the language list. The admin languages page
 * dispatches this event after a successful save so tabs update
 * immediately without a page reload.
 */
export const LANGUAGES_UPDATED_EVENT = "divemix:languages-updated";

/**
 * Convenience function the admin UI calls after saving language
 * settings. Safe to call from any client component.
 */
export function notifyLanguagesUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LANGUAGES_UPDATED_EVENT));
  }
}

interface LanguagesContextValue {
  /** Current resolved snapshot (always defined, falls back to static). */
  snapshot: ResolvedLanguages;
  /** True once we have received data from the DB at least once. */
  hydrated: boolean;
  /** Triggers a fresh fetch. */
  refresh: () => Promise<void>;
}

const LanguagesContext = createContext<LanguagesContextValue | null>(null);

/**
 * Client provider that keeps `snapshot` + the non-React runtime store
 * in sync with the `language_settings` table. Place this once near the
 * root of every tree that needs dynamic languages (e.g. the admin
 * layout and the `[locale]` public layout).
 *
 * It supports:
 *  - initial fetch on mount
 *  - re-fetch when `notifyLanguagesUpdated()` fires
 *  - realtime propagation across tabs via the `storage` event
 */
export function LanguagesProvider({
  children,
  initialSnapshot,
}: {
  children: ReactNode;
  initialSnapshot?: ResolvedLanguages;
}) {
  const [snapshot, setSnapshot] = useState<ResolvedLanguages>(
    () => initialSnapshot ?? getRuntimeLanguages() ?? buildStaticFallbackLanguages()
  );
  const [hydrated, setHydrated] = useState<boolean>(Boolean(initialSnapshot));
  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("language_settings")
        .select(
          "code, name, native_name, flag, enabled, is_default, is_fallback, is_rtl, display_order"
        )
        .order("display_order", { ascending: true });

      if (error || !data) {
        // On failure keep the previous snapshot - never downgrade
        // to the static fallback if we already had a real one.
        setHydrated(true);
        return;
      }

      const langs = data as LanguageSetting[];
      const resolved = setRuntimeLanguages(langs);
      if (mounted.current) {
        setSnapshot(resolved);
        setHydrated(true);
      }
    } catch {
      if (mounted.current) setHydrated(true);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void load();

    const onUpdate = () => void load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANGUAGES_UPDATED_EVENT) void load();
    };

    const offRuntime = subscribeRuntimeLanguages((next) => {
      if (mounted.current) setSnapshot(next);
    });

    window.addEventListener(LANGUAGES_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);

    return () => {
      mounted.current = false;
      offRuntime();
      window.removeEventListener(LANGUAGES_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [load]);

  const value = useMemo<LanguagesContextValue>(
    () => ({ snapshot, hydrated, refresh: load }),
    [snapshot, hydrated, load]
  );

  return (
    <LanguagesContext.Provider value={value}>
      {children}
    </LanguagesContext.Provider>
  );
}

/**
 * Reads the current language snapshot from the nearest provider, or
 * falls back to the static config if no provider is mounted (so
 * components remain usable in isolated unit tests / storybooks).
 */
export function useLanguages(): LanguagesContextValue {
  const ctx = useContext(LanguagesContext);
  if (ctx) return ctx;
  return {
    snapshot: getRuntimeLanguages(),
    hydrated: false,
    refresh: async () => {
      /* no-op without a provider */
    },
  };
}

/** Convenience accessor: just the enabled languages in display order. */
export function useEnabledLanguages(): LanguageSetting[] {
  const { snapshot } = useLanguages();
  return snapshot.languages.filter((l) => l.enabled);
}
