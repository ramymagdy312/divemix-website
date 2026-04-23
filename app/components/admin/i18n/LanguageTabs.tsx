"use client";

import { CheckCircle2 } from "lucide-react";
import {
  localeFlags,
  localeNames,
  type LanguageSetting,
  type Locale,
} from "@/app/lib/i18n/config";
import { useEnabledLanguages } from "@/app/lib/i18n/LanguagesProvider";

export interface LanguageTabsProps {
  /** Currently-active locale code. */
  active: string;
  /** Fired when the user clicks a different tab. */
  onChange: (locale: string) => void;
  /**
   * Optional per-locale completion stats rendered as a badge on each tab.
   * Keyed by locale code (dynamic - supports any language).
   */
  completion?: Record<string, { filled: number; total: number }>;
  /**
   * Override the list of languages shown. Defaults to the provider's
   * enabled list. Useful for previews / storybook.
   */
  languages?: LanguageSetting[];
  className?: string;
}

function flagFor(lang: LanguageSetting): string {
  return lang.flag || localeFlags[lang.code as Locale] || "🌐";
}

function labelFor(lang: LanguageSetting): string {
  return (
    lang.native_name ||
    lang.name ||
    localeNames[lang.code as Locale] ||
    lang.code.toUpperCase()
  );
}

export default function LanguageTabs({
  active,
  onChange,
  completion,
  languages,
  className = "",
}: LanguageTabsProps) {
  const enabled = useEnabledLanguages();
  const list = languages ?? enabled;

  if (list.length === 0) return null;

  return (
    <div
      className={`flex items-center flex-wrap gap-1 border-b border-gray-200 ${className}`}
    >
      {list.map((lang) => {
        const isActive = lang.code === active;
        const stat = completion?.[lang.code];
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            title={
              lang.is_default ? `${labelFor(lang)} (default)` : labelFor(lang)
            }
            className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-cyan-600 text-cyan-700 bg-cyan-50"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="text-base leading-none">{flagFor(lang)}</span>
            <span>{labelFor(lang)}</span>
            {lang.is_default && (
              <CheckCircle2
                className="h-3.5 w-3.5 text-cyan-600"
                aria-label="Default language"
              />
            )}
            {lang.is_rtl && (
              <span
                className="text-[10px] uppercase tracking-wide text-amber-700 bg-amber-100 px-1.5 rounded"
                aria-label="Right-to-left"
              >
                RTL
              </span>
            )}
            {stat && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-xs font-semibold ${
                  stat.filled === stat.total
                    ? "bg-green-100 text-green-700"
                    : stat.filled === 0
                    ? "bg-gray-100 text-gray-600"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {stat.filled}/{stat.total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
