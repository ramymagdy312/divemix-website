"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Globe, Check } from "lucide-react";
import {
  buildStaticFallbackLanguages,
  localeFlags,
  localeNames,
  type LanguageSetting,
  type Locale,
} from "@/app/lib/i18n/config";
import { supabase } from "@/app/lib/supabase";
import { LANGUAGES_UPDATED_EVENT } from "@/app/lib/i18n/LanguagesProvider";

interface LanguageSwitcherProps {
  variant?: "navbar" | "inline";
  className?: string;
}

// Module-level cache so multiple LanguageSwitcher instances on the same page
// (e.g. desktop + mobile) share one fetch.
let cachedLanguages: LanguageSetting[] | null = null;
let inflight: Promise<LanguageSetting[]> | null = null;

async function loadLanguages(force = false): Promise<LanguageSetting[]> {
  if (!force && cachedLanguages) return cachedLanguages;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const { data, error } = await supabase
        .from("language_settings")
        .select(
          "code, name, native_name, flag, enabled, is_default, is_fallback, is_rtl, display_order"
        )
        .eq("enabled", true)
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        cachedLanguages = buildStaticFallbackLanguages().languages.filter(
          (l) => l.enabled
        );
      } else {
        cachedLanguages = data as LanguageSetting[];
      }
    } catch {
      cachedLanguages = buildStaticFallbackLanguages().languages.filter(
        (l) => l.enabled
      );
    } finally {
      inflight = null;
    }
    return cachedLanguages!;
  })();

  return inflight;
}

function labelFor(lang: LanguageSetting): string {
  return (
    lang.native_name ||
    lang.name ||
    localeNames[lang.code as Locale] ||
    lang.code.toUpperCase()
  );
}

function flagFor(lang: LanguageSetting): string {
  return lang.flag || localeFlags[lang.code as Locale] || "🌐";
}

export default function LanguageSwitcher({
  variant = "navbar",
  className = "",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  // Initial render: fall back to static enabled list so SSR output is
  // stable. We hydrate from the DB as soon as we can so the switcher
  // reflects admin changes without a full reload.
  const [languages, setLanguages] = useState<LanguageSetting[]>(() =>
    buildStaticFallbackLanguages().languages.filter((l) => l.enabled)
  );

  useEffect(() => {
    let cancelled = false;
    loadLanguages().then((langs) => {
      if (!cancelled) setLanguages(langs);
    });

    const refresh = () => {
      cachedLanguages = null;
      loadLanguages(true).then((langs) => {
        if (!cancelled) setLanguages(langs);
      });
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === LANGUAGES_UPDATED_EVENT) refresh();
    };
    window.addEventListener(LANGUAGES_UPDATED_EVENT, refresh);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(LANGUAGES_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    startTransition(() => {
      // Preserve dynamic route params when switching locales.
      router.replace(
        // @ts-expect-error -- next-intl typing for pathname+params is flexible
        { pathname, params },
        { locale: newLocale as Locale }
      );
    });
  };

  // If the active locale somehow isn't in the enabled list (e.g. an old
  // tab after an admin disabled it) we still render a button for it so
  // the user can switch away.
  const visible = languages.some((l) => l.code === locale)
    ? languages
    : [
        ...languages,
        {
          code: locale,
          name: locale.toUpperCase(),
          native_name: localeNames[locale as Locale] ?? locale.toUpperCase(),
          flag: localeFlags[locale as Locale] ?? null,
          enabled: true,
          is_default: false,
          is_fallback: false,
          is_rtl: false,
          display_order: 999,
        } as LanguageSetting,
      ];

  // Nothing to switch to - hide the switcher entirely.
  if (visible.length <= 1) return null;

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {visible.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleChange(lang.code)}
            disabled={isPending}
            aria-label={`Switch to ${labelFor(lang)}`}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
              locale === lang.code
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  const activeLang = visible.find((l) => l.code === locale);

  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-cyan-800 transition-colors"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {activeLang ? flagFor(activeLang) : ""}
        </span>
        <span className="uppercase">{locale}</span>
      </button>
      <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-0 w-44 bg-white text-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
        <div className="py-1">
          {visible.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChange(lang.code)}
              disabled={isPending}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                locale === lang.code ? "font-semibold bg-gray-50" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{flagFor(lang)}</span>
                <span>{labelFor(lang)}</span>
              </span>
              {locale === lang.code && (
                <Check className="h-4 w-4 text-cyan-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
