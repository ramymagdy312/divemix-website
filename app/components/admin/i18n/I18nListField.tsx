"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LanguageTabs from "./LanguageTabs";
import { useLanguages } from "@/app/lib/i18n/LanguagesProvider";
import { normalizeI18n, seedI18n, type I18nValue } from "@/app/lib/i18n/resolve";

interface I18nListFieldProps {
  label?: string;
  values: unknown[];
  onChange: (values: I18nValue[]) => void;
  placeholder?: string;
  className?: string;
}

/** Editor for arrays of i18n strings (e.g. product features). */
export default function I18nListField({
  label,
  values,
  onChange,
  placeholder,
  className = "",
}: I18nListFieldProps) {
  const { snapshot } = useLanguages();
  const enabledCodes = snapshot.enabled;
  const defaultCode = snapshot.default;
  const fallbackCode = snapshot.fallback;
  const rtlCodes = snapshot.rtl;

  const [active, setActive] = useState<string>(defaultCode);

  useEffect(() => {
    if (!enabledCodes.includes(active)) setActive(defaultCode);
  }, [enabledCodes, active, defaultCode]);

  const normalized = useMemo<Record<string, string>[]>(
    () =>
      (values || []).map(
        (v) =>
          normalizeI18n(v as never, enabledCodes) as Record<string, string>
      ),
    [values, enabledCodes]
  );

  const completion = useMemo(() => {
    const out: Record<string, { filled: number; total: number }> = {};
    for (const code of enabledCodes) {
      out[code] = {
        filled: normalized.filter((v) => (v[code] || "").trim().length > 0)
          .length,
        total: Math.max(normalized.length, 1),
      };
    }
    return out;
  }, [normalized, enabledCodes]);

  const update = (index: number, locale: string, text: string) => {
    const next = normalized.map((v, idx) => {
      if (idx !== index) return v;
      const updated: Record<string, string> = { ...v, [locale]: text };
      if (locale === fallbackCode) {
        const prevFallback = v[fallbackCode] || "";
        for (const code of enabledCodes) {
          if (code === fallbackCode) continue;
          const current = v[code] || "";
          if (!current || current === prevFallback) updated[code] = text;
        }
      }
      return updated;
    });
    onChange(next as I18nValue[]);
  };

  const add = () => onChange([...(normalized as I18nValue[]), seedI18n("")]);
  const remove = (index: number) =>
    onChange(normalized.filter((_, idx) => idx !== index) as I18nValue[]);

  const activeDir = rtlCodes.includes(active) ? "rtl" : "ltr";

  return (
    <div className={className}>
      {label && <div className="text-sm font-medium text-gray-700 mb-1.5">{label}</div>}
      <LanguageTabs
        active={active}
        onChange={setActive}
        completion={completion}
        className="mb-2"
      />
      <div className="space-y-2">
        {normalized.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              dir={activeDir}
              value={v[active] || ""}
              onChange={(e) => update(i, active, e.target.value)}
              placeholder={placeholder || `Item ${i + 1}`}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-2 py-2 border rounded-md text-red-600 hover:bg-red-50"
              aria-label="Remove item"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}
