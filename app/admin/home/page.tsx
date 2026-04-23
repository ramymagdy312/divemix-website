"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";
import FolderExplorerSingle from "../../components/admin/FolderExplorerSingle";
import { IconPicker, IconRenderer } from "../../components/admin/iconPicker";
import I18nTextField, { type I18nValue } from "../../components/admin/i18n/I18nTextField";
import I18nTextarea from "../../components/admin/i18n/I18nTextarea";
import { normalizeI18n, seedI18n } from "../../lib/i18n/resolve";

interface HomePageData {
  hero_title: I18nValue;
  hero_subtitle: I18nValue;
  hero_image: string;
  hero_cta_primary: { label: I18nValue; href: string };
  hero_cta_secondary: { label: I18nValue; href: string };
  stats: { icon: string; value: string; label: I18nValue }[];
  show_company_teaser: boolean;
  show_contact_cta: boolean;
  contact_cta_title: I18nValue;
  contact_cta_body: I18nValue;
  contact_cta_button: { label: I18nValue; href: string };
}

type StatItem = { icon: string; value: string; label: I18nValue };

const defaults: HomePageData = {
  hero_title: seedI18n("Pioneering the Future of Gas Technology"),
  hero_subtitle: seedI18n(
    "Leading the industry with innovative solutions for gas mixing and compression systems. Trust DiveMix for reliability, precision, and excellence."
  ),
  hero_image: "/img/hero/home.jpg",
  hero_cta_primary: { label: seedI18n("Explore Products"), href: "/products" },
  hero_cta_secondary: { label: seedI18n("Contact Us"), href: "/contact" },
  stats: [
    { icon: "Award", value: "20+", label: seedI18n("Years Experience") },
    { icon: "Users", value: "1000+", label: seedI18n("Projects Completed") },
    { icon: "Globe", value: "50+", label: seedI18n("Countries Served") },
    { icon: "Clock", value: "24/7", label: seedI18n("Support Available") },
  ],
  show_company_teaser: true,
  show_contact_cta: false,
  contact_cta_title: seedI18n("Ready to Get Started?"),
  contact_cta_body: seedI18n(
    "Contact our team of experts for a consultation and discover how we can help optimize your operations"
  ),
  contact_cta_button: { label: seedI18n("Contact Us Today"), href: "/contact" },
};

function normalizeRow(row: any): HomePageData {
  return {
    ...defaults,
    ...row,
    hero_title: normalizeI18n(row?.hero_title),
    hero_subtitle: normalizeI18n(row?.hero_subtitle),
    contact_cta_title: normalizeI18n(row?.contact_cta_title),
    contact_cta_body: normalizeI18n(row?.contact_cta_body),
    hero_cta_primary: {
      label: normalizeI18n(row?.hero_cta_primary?.label),
      href: row?.hero_cta_primary?.href || defaults.hero_cta_primary.href,
    },
    hero_cta_secondary: {
      label: normalizeI18n(row?.hero_cta_secondary?.label),
      href: row?.hero_cta_secondary?.href || defaults.hero_cta_secondary.href,
    },
    contact_cta_button: {
      label: normalizeI18n(row?.contact_cta_button?.label),
      href: row?.contact_cta_button?.href || defaults.contact_cta_button.href,
    },
    stats: Array.isArray(row?.stats)
      ? row.stats.map((s: any) => ({
          icon: s.icon || "Award",
          value: s.value || "",
          label: normalizeI18n(s.label),
        }))
      : defaults.stats,
  };
}

export default function HomePageAdmin() {
  const [data, setData] = useState<HomePageData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const { data: row } = await supabase.from("home_page").select("*").single();
        if (row) setData(normalizeRow(row));
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("home_page").upsert(data as any);
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await triggerRevalidate(["page:home", "seo:/"]);
    toast.success("Home page saved and published");
    setSaving(false);
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  const updateStat = (index: number, patch: Partial<StatItem>) => {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const addStat = () => {
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, { icon: "Award", value: "", label: seedI18n("") }],
    }));
  };

  const removeStat = (index: number) => {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Home Page</h1>
        <p className="text-gray-600">Manage homepage hero, stats, and CTA visibility.</p>
      </div>

      <div className="grid gap-4">
        <I18nTextField
          label="Hero title"
          value={data.hero_title}
          onChange={(v) => setData((p) => ({ ...p, hero_title: v }))}
        />

        <I18nTextarea
          label="Hero subtitle"
          value={data.hero_subtitle}
          onChange={(v) => setData((p) => ({ ...p, hero_subtitle: v }))}
        />

        <div>
          <label className="text-sm font-medium block mb-1.5">Hero image</label>
          <FolderExplorerSingle
            image={data.hero_image}
            onImageChange={(image) => setData((p) => ({ ...p, hero_image: image }))}
            label="Hero Image"
          />
        </div>

        <I18nTextField
          label="Primary CTA label"
          value={data.hero_cta_primary.label}
          onChange={(v) =>
            setData((p) => ({ ...p, hero_cta_primary: { ...p.hero_cta_primary, label: v } }))
          }
        />
        <div>
          <label className="text-sm font-medium block mb-1.5">Primary CTA href</label>
          <input
            className="border rounded-md px-3 py-2 w-full"
            value={data.hero_cta_primary.href}
            onChange={(e) =>
              setData((p) => ({ ...p, hero_cta_primary: { ...p.hero_cta_primary, href: e.target.value } }))
            }
          />
        </div>

        <I18nTextField
          label="Secondary CTA label"
          value={data.hero_cta_secondary.label}
          onChange={(v) =>
            setData((p) => ({ ...p, hero_cta_secondary: { ...p.hero_cta_secondary, label: v } }))
          }
        />
        <div>
          <label className="text-sm font-medium block mb-1.5">Secondary CTA href</label>
          <input
            className="border rounded-md px-3 py-2 w-full"
            value={data.hero_cta_secondary.href}
            onChange={(e) =>
              setData((p) => ({ ...p, hero_cta_secondary: { ...p.hero_cta_secondary, href: e.target.value } }))
            }
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Stats</label>
            <button
              type="button"
              onClick={addStat}
              className="px-3 py-1.5 text-sm rounded-md border border-cyan-300 text-cyan-700 hover:bg-cyan-50"
            >
              + Add Stat
            </button>
          </div>

          {data.stats.length === 0 && (
            <div className="text-sm text-muted-foreground border rounded-md p-3">
              No stats yet. Click <strong>Add Stat</strong>.
            </div>
          )}

          {data.stats.map((stat, index) => (
            <div key={index} className="border rounded-md p-3 grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Icon</label>
                <div className="flex items-center gap-2">
                  <IconPicker
                    value={stat.icon}
                    onValueChange={(icon) => updateStat(index, { icon })}
                  />
                  <IconRenderer iconName={stat.icon} size="md" className="text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Value</label>
                <input
                  className="w-full border rounded-md px-2 py-2 text-sm"
                  value={stat.value}
                  onChange={(e) => updateStat(index, { value: e.target.value })}
                  placeholder="e.g. 20+"
                />
              </div>
              <div className="space-y-1">
                <I18nTextField
                  label="Label"
                  value={stat.label}
                  onChange={(v) => updateStat(index, { label: v })}
                />
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="mt-2 px-3 py-1 text-xs rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 py-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.show_company_teaser}
              onChange={(e) => setData((p) => ({ ...p, show_company_teaser: e.target.checked }))}
            />
            Show company teaser
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.show_contact_cta}
              onChange={(e) => setData((p) => ({ ...p, show_contact_cta: e.target.checked }))}
            />
            Show contact CTA block
          </label>
        </div>

        <I18nTextField
          label="Contact CTA title"
          value={data.contact_cta_title}
          onChange={(v) => setData((p) => ({ ...p, contact_cta_title: v }))}
        />
        <I18nTextarea
          label="Contact CTA body"
          value={data.contact_cta_body}
          onChange={(v) => setData((p) => ({ ...p, contact_cta_body: v }))}
        />
        <I18nTextField
          label="Contact CTA button label"
          value={data.contact_cta_button.label}
          onChange={(v) =>
            setData((p) => ({ ...p, contact_cta_button: { ...p.contact_cta_button, label: v } }))
          }
        />
        <div>
          <label className="text-sm font-medium block mb-1.5">Contact CTA button href</label>
          <input
            className="border rounded-md px-3 py-2 w-full"
            value={data.contact_cta_button.href}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                contact_cta_button: { ...p.contact_cta_button, href: e.target.value },
              }))
            }
          />
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Home Page"}
      </button>
    </div>
  );
}
