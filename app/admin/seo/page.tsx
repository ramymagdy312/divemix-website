"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";

interface SeoRow {
  route: string;
  title: string;
  description: string;
  og_image: string | null;
  keywords: string[];
  noindex: boolean;
}

const defaultRows: SeoRow[] = [
  { route: "/", title: "DiveMix - Gas & Compressor Technologies", description: "Leading the industry in compressed air and gas solutions since 1990", og_image: "", keywords: ["gas technology", "compressors"], noindex: false },
  { route: "/about", title: "About DiveMix", description: "Learn about DiveMix vision, mission, and journey.", og_image: "", keywords: ["about", "divemix"], noindex: false },
  { route: "/products", title: "DiveMix Products", description: "Explore DiveMix products for gas mixing and compression systems.", og_image: "", keywords: ["products"], noindex: false },
  { route: "/services", title: "DiveMix Services", description: "Discover DiveMix maintenance, installation, and support services.", og_image: "", keywords: ["services"], noindex: false },
  { route: "/applications", title: "DiveMix Applications", description: "See how DiveMix solutions serve multiple industrial applications.", og_image: "", keywords: ["applications"], noindex: false },
  { route: "/gallery", title: "DiveMix Gallery", description: "Browse projects, installations, and maintenance galleries from DiveMix.", og_image: "", keywords: ["gallery"], noindex: false },
  { route: "/contact", title: "Contact DiveMix", description: "Get in touch with DiveMix experts for products and services.", og_image: "", keywords: ["contact"], noindex: false },
];

export default function SeoAdminPage() {
  const [rows, setRows] = useState<SeoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("page_seo")
          .select("*")
          .order("route");
        setRows((data as SeoRow[])?.length ? (data as SeoRow[]) : defaultRows);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateRow = (index: number, patch: Partial<SeoRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    setSaving(true);

    const payload = rows.map((row) => ({ ...row, og_image: row.og_image || null }));
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

  if (loading) return <div className="h-64 flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">SEO</h1>
        <p className="text-gray-600">Manage route-level metadata for public pages.</p>
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={row.route} className="border rounded-md p-4 grid gap-2">
            <div className="text-sm font-semibold">{row.route}</div>
            <input
              className="border rounded px-2 py-1"
              value={row.title}
              onChange={(e) => updateRow(index, { title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="border rounded px-2 py-1"
              value={row.description}
              onChange={(e) => updateRow(index, { description: e.target.value })}
              placeholder="Description"
            />
            <input
              className="border rounded px-2 py-1"
              value={row.og_image || ""}
              onChange={(e) => updateRow(index, { og_image: e.target.value })}
              placeholder="OG image URL"
            />
            <input
              className="border rounded px-2 py-1"
              value={row.keywords.join(", ")}
              onChange={(e) =>
                updateRow(index, {
                  keywords: e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
                })
              }
              placeholder="keywords, comma separated"
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={row.noindex}
                onChange={(e) => updateRow(index, { noindex: e.target.checked })}
              />
              noindex
            </label>
          </div>
        ))}
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
