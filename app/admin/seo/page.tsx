"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";
import I18nTextField, { type I18nValue } from "../../components/admin/i18n/I18nTextField";
import I18nTextarea from "../../components/admin/i18n/I18nTextarea";
import LanguageTabs from "../../components/admin/i18n/LanguageTabs";
import { normalizeI18n, seedI18n } from "../../lib/i18n/resolve";
import { useLanguages } from "../../lib/i18n/LanguagesProvider";

interface SeoRow {
  route: string;
  title: I18nValue;
  description: I18nValue;
  og_image: string | null;
  /** Per-locale keyword arrays; keys are dynamic locale codes. */
  keywords: Record<string, string[]>;
  noindex: boolean;
}

const defaultRoutes = [
  { route: "/", title: "DiveMix - Gas & Compressor Technologies", description: "Leading the industry in compressed air and gas solutions since 1990", keywords: ["gas technology", "compressors"] },
  { route: "/about", title: "About DiveMix", description: "Learn about DiveMix vision, mission, and journey.", keywords: ["about", "divemix"] },
  { route: "/products", title: "DiveMix Products", description: "Explore DiveMix products for gas mixing and compression systems.", keywords: ["products"] },
  { route: "/services", title: "DiveMix Services", description: "Discover DiveMix maintenance, installation, and support services.", keywords: ["services"] },
  { route: "/applications", title: "DiveMix Applications", description: "See how DiveMix solutions serve multiple industrial applications.", keywords: ["applications"] },
  { route: "/gallery", title: "DiveMix Gallery", description: "Browse projects, installations, and maintenance galleries from DiveMix.", keywords: ["gallery"] },
  { route: "/contact", title: "Contact DiveMix", description: "Get in touch with DiveMix experts for products and services.", keywords: ["contact"] },
];

function seedKeywords(
  seed: string[],
  codes: string[]
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const code of codes) out[code] = [...seed];
  if (!out.en) out.en = [...seed];
  return out;
}

function makeDefaultRow(
  r: (typeof defaultRoutes)[number],
  codes: string[]
): SeoRow {
  return {
    route: r.route,
    title: seedI18n(r.title, codes),
    description: seedI18n(r.description, codes),
    og_image: "",
    keywords: seedKeywords(r.keywords, codes),
    noindex: false,
  };
}

function normalizeKeywords(
  value: unknown,
  codes: string[]
): Record<string, string[]> {
  const out: Record<string, string[]> = {};

  // Legacy shape: a single array = same keywords for every locale.
  if (Array.isArray(value)) {
    const arr = value.map((k) => (typeof k === "string" ? k : String(k ?? "")));
    for (const code of codes) out[code] = [...arr];
    if (!out.en) out.en = [...arr];
    return out;
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // Preserve any legacy locale keys already stored on the row so
    // disabling/re-enabling a language does not lose its keyword list.
    for (const [k, v] of Object.entries(obj)) {
      if (Array.isArray(v)) {
        out[k] = v.map((x) => (typeof x === "string" ? x : String(x ?? "")));
      }
    }
  }

  const seedSource =
    out.en && out.en.length > 0
      ? out.en
      : Object.values(out).find((arr) => Array.isArray(arr) && arr.length > 0) ??
        [];
  for (const code of codes) {
    if (!out[code] || out[code].length === 0) out[code] = [...seedSource];
  }
  if (!out.en) out.en = [...seedSource];
  return out;
}

function normalizeRow(row: Record<string, unknown>, codes: string[]): SeoRow {
  return {
    route: String(row.route ?? ""),
    title: normalizeI18n(row.title as never, codes),
    description: normalizeI18n(row.description as never, codes),
    og_image: typeof row.og_image === "string" ? row.og_image : "",
    keywords: normalizeKeywords(row.keywords, codes),
    noindex: Boolean(row.noindex),
  };
}

export default function SeoAdminPage() {
  const { snapshot } = useLanguages();
  const enabledCodes = snapshot.enabled;
  const defaultCode = snapshot.default;
  const rtlCodes = snapshot.rtl;

  const [rows, setRows] = useState<SeoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keywordsLocale, setKeywordsLocale] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("page_seo")
          .select("*")
          .order("route");
        const list =
          (data as Record<string, unknown>[])?.length
            ? (data as Record<string, unknown>[]).map((r) =>
                normalizeRow(r, enabledCodes)
              )
            : defaultRoutes.map((r) => makeDefaultRow(r, enabledCodes));
        setRows(list);
      } finally {
        setLoading(false);
      }
    };
    void load();
    // Intentionally only depend on `loading` - enabled codes shift does
    // not require a full re-fetch; normalizeI18n already tops up any
    // newly-enabled locale slots on the fly in the renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-normalize rows in place whenever enabled codes change, so newly
  // enabled languages appear with sensible initial values without a
  // server round-trip. Keeps existing per-row edits intact.
  useEffect(() => {
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        title: normalizeI18n(row.title as never, enabledCodes),
        description: normalizeI18n(row.description as never, enabledCodes),
        keywords: normalizeKeywords(row.keywords, enabledCodes),
      }))
    );
  }, [enabledCodes]);

  const updateRow = (index: number, patch: Partial<SeoRow>) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const save = async () => {
    setSaving(true);

    const payload = rows.map((row) => ({
      route: row.route,
      title: row.title,
      description: row.description,
      og_image: row.og_image || null,
      keywords: row.keywords,
      noindex: row.noindex,
    }));
    const { error } = await supabase.from("page_seo").upsert(payload);
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await triggerRevalidate(rows.map((row) => `seo:${row.route}`));
    toast.success("SEO settings saved and published");
    setSaving(false);
  };

  const keywordsCompletion = useMemo(() => {
    // Per-tab counters reused across rows so the tabs themselves
    // always reflect the *currently shown* row's completion.
    return null as Record<string, { filled: number; total: number }> | null;
  }, []);

  if (loading)
    return <div className="h-64 flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">SEO</h1>
        <p className="text-gray-600">Manage route-level metadata per language.</p>
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => {
          const kwLocale = keywordsLocale[row.route] || defaultCode;
          const isKwRtl = rtlCodes.includes(kwLocale);
          return (
            <div key={row.route} className="border rounded-md p-4 grid gap-3">
              <div className="text-sm font-semibold">{row.route}</div>
              <I18nTextField
                label="Title"
                value={row.title}
                onChange={(v) => updateRow(index, { title: v })}
              />
              <I18nTextarea
                label="Description"
                value={row.description}
                onChange={(v) => updateRow(index, { description: v })}
                rows={3}
              />
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  OG image URL
                </label>
                <input
                  className="border rounded px-2 py-1.5 w-full"
                  value={row.og_image || ""}
                  onChange={(e) => updateRow(index, { og_image: e.target.value })}
                  placeholder="/img/og/home.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Keywords (per language)
                </label>
                <LanguageTabs
                  active={kwLocale}
                  onChange={(l) =>
                    setKeywordsLocale((prev) => ({ ...prev, [row.route]: l }))
                  }
                  completion={keywordsCompletion ?? undefined}
                  className="mb-2"
                />
                <input
                  dir={isKwRtl ? "rtl" : "ltr"}
                  className="border rounded px-2 py-1.5 w-full"
                  value={(row.keywords[kwLocale] || []).join(", ")}
                  onChange={(e) =>
                    updateRow(index, {
                      keywords: {
                        ...row.keywords,
                        [kwLocale]: e.target.value
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="keywords, comma separated"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={row.noindex}
                  onChange={(e) => updateRow(index, { noindex: e.target.checked })}
                />
                noindex
              </label>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save SEO"}
      </button>
    </div>
  );
}
