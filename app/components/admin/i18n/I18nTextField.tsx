"use client";

import { useEffect, useMemo, useState } from "react";
import LanguageTabs from "./LanguageTabs";
import { useLanguages } from "@/app/lib/i18n/LanguagesProvider";
import { normalizeI18n, type I18nValue } from "@/app/lib/i18n/resolve";

export type { I18nValue };

interface I18nTextFieldProps {
  label?: string;
  value: unknown;
  onChange: (value: I18nValue) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  as?: "input" | "textarea";
  rows?: number;
  helperText?: string;
  /**
   * When true (default) typing in the fallback locale copies the value
   * into any other enabled locales whose slot is still empty. Ensures
   * a minimally-working translation set without manual duplication.
   */
  autoSeed?: boolean;
}

export default function I18nTextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  className = "",
  inputClassName = "",
  as = "input",
  rows = 4,
  helperText,
  autoSeed = true,
}: I18nTextFieldProps) {
  const { snapshot } = useLanguages();
  const enabledCodes = snapshot.enabled;
  const defaultCode = snapshot.default;
  const fallbackCode = snapshot.fallback;
  const rtlCodes = snapshot.rtl;

  const [active, setActive] = useState<string>(defaultCode);

  // If the active locale was disabled / removed, jump back to the default.
  useEffect(() => {
    if (!enabledCodes.includes(active)) setActive(defaultCode);
  }, [enabledCodes, active, defaultCode]);

  const normalized = useMemo(
    () => normalizeI18n(value as never, enabledCodes) as Record<string, string>,
    [value, enabledCodes]
  );

  const completion = useMemo(() => {
    const out: Record<string, { filled: number; total: number }> = {};
    for (const code of enabledCodes) {
      out[code] = {
        filled: (normalized[code] || "").trim().length > 0 ? 1 : 0,
        total: 1,
      };
    }
    return out;
  }, [normalized, enabledCodes]);

  const handleChange = (locale: string, text: string) => {
    const next: Record<string, string> = { ...normalized, [locale]: text };

    // Auto-seed: when editing the fallback locale, copy the value into
    // any enabled locales whose slot is empty or was mirroring the
    // previous fallback value. Keeps translations in lockstep until the
    // admin explicitly edits them per language.
    if (autoSeed && locale === fallbackCode) {
      const prevFallback = normalized[fallbackCode] || "";
      for (const code of enabledCodes) {
        if (code === fallbackCode) continue;
        const current = normalized[code] || "";
        if (!current || current === prevFallback) next[code] = text;
      }
    }

    onChange(next as I18nValue);
  };

  const activeDir = rtlCodes.includes(active) ? "rtl" : "ltr";

  const inputBase =
    "block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <LanguageTabs
        active={active}
        onChange={setActive}
        completion={completion}
        className="mb-2"
      />
      {as === "textarea" ? (
        <textarea
          dir={activeDir}
          value={normalized[active] || ""}
          onChange={(e) => handleChange(active, e.target.value)}
          placeholder={placeholder}
          required={required && active === fallbackCode}
          disabled={disabled}
          rows={rows}
          className={`${inputBase} ${inputClassName}`}
        />
      ) : (
        <input
          type="text"
          dir={activeDir}
          value={normalized[active] || ""}
          onChange={(e) => handleChange(active, e.target.value)}
          placeholder={placeholder}
          required={required && active === fallbackCode}
          disabled={disabled}
          className={`${inputBase} ${inputClassName}`}
        />
      )}
      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}
