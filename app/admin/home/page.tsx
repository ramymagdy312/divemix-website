"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";
import FolderExplorerSingle from "../../components/admin/FolderExplorerSingle";
import { IconPicker, IconRenderer } from "../../components/admin/iconPicker";

interface HomePageData {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_cta_primary: { label: string; href: string };
  hero_cta_secondary: { label: string; href: string };
  stats: { icon: string; value: string; label: string }[];
  show_company_teaser: boolean;
  show_contact_cta: boolean;
  contact_cta_title: string;
  contact_cta_body: string;
  contact_cta_button: { label: string; href: string };
}

type StatItem = { icon: string; value: string; label: string };

const defaults: HomePageData = {
  hero_title: "Pioneering the Future of Gas Technology",
  hero_subtitle:
    "Leading the industry with innovative solutions for gas mixing and compression systems. Trust DiveMix for reliability, precision, and excellence.",
  hero_image: "/img/hero/home.jpg",
  hero_cta_primary: { label: "Explore Products", href: "/products" },
  hero_cta_secondary: { label: "Contact Us", href: "/contact" },
  stats: [
    { icon: "Award", value: "20+", label: "Years Experience" },
    { icon: "Users", value: "1000+", label: "Projects Completed" },
    { icon: "Globe", value: "50+", label: "Countries Served" },
    { icon: "Clock", value: "24/7", label: "Support Available" },
  ],
  show_company_teaser: true,
  show_contact_cta: false,
  contact_cta_title: "Ready to Get Started?",
  contact_cta_body:
    "Contact our team of experts for a consultation and discover how we can help optimize your operations",
  contact_cta_button: { label: "Contact Us Today", href: "/contact" },
};

export default function HomePageAdmin() {
  const [data, setData] = useState<HomePageData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const { data: row } = await supabase.from("home_page").select("*").single();
        if (row) setData({ ...defaults, ...row });
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("home_page").upsert(data);
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
      stats: [...prev.stats, { icon: "Award", value: "", label: "" }],
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
        <label className="text-sm font-medium">Hero title</label>
        <input
          className="border rounded-md px-3 py-2"
          value={data.hero_title}
          onChange={(e) => setData((p) => ({ ...p, hero_title: e.target.value }))}
        />

        <label className="text-sm font-medium">Hero subtitle</label>
        <textarea
          className="border rounded-md px-3 py-2 min-h-[90px]"
          value={data.hero_subtitle}
          onChange={(e) => setData((p) => ({ ...p, hero_subtitle: e.target.value }))}
        />

        <label className="text-sm font-medium">Hero image</label>
        <FolderExplorerSingle
          image={data.hero_image}
          onImageChange={(image) => setData((p) => ({ ...p, hero_image: image }))}
          label="Hero Image"
        />

        <label className="text-sm font-medium">Primary CTA label</label>
        <input
          className="border rounded-md px-3 py-2"
          value={data.hero_cta_primary.label}
          onChange={(e) =>
            setData((p) => ({ ...p, hero_cta_primary: { ...p.hero_cta_primary, label: e.target.value } }))
          }
        />
        <label className="text-sm font-medium">Primary CTA href</label>
        <input
          className="border rounded-md px-3 py-2"
          value={data.hero_cta_primary.href}
          onChange={(e) =>
            setData((p) => ({ ...p, hero_cta_primary: { ...p.hero_cta_primary, href: e.target.value } }))
          }
        />

        <label className="text-sm font-medium">Secondary CTA label</label>
        <input
          className="border rounded-md px-3 py-2"
          value={data.hero_cta_secondary.label}
          onChange={(e) =>
            setData((p) => ({ ...p, hero_cta_secondary: { ...p.hero_cta_secondary, label: e.target.value } }))
          }
        />
        <label className="text-sm font-medium">Secondary CTA href</label>
        <input
          className="border rounded-md px-3 py-2"
          value={data.hero_cta_secondary.href}
          onChange={(e) =>
            setData((p) => ({ ...p, hero_cta_secondary: { ...p.hero_cta_secondary, href: e.target.value } }))
          }
        />

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
            <div key={`${stat.label}-${index}`} className="border rounded-md p-3 grid gap-3 md:grid-cols-3">
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
                <label className="text-xs text-muted-foreground">Label</label>
                <div className="flex gap-2">
                  <input
                    className="w-full border rounded-md px-2 py-2 text-sm"
                    value={stat.label}
                    onChange={(e) => updateStat(index, { label: e.target.value })}
                    placeholder="e.g. Years Experience"
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="px-3 py-2 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
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

        <label className="text-sm font-medium">Contact CTA title</label>
        <input
          className="border rounded-md px-3 py-2"
          value={data.contact_cta_title}
          onChange={(e) => setData((p) => ({ ...p, contact_cta_title: e.target.value }))}
        />
        <label className="text-sm font-medium">Contact CTA body</label>
        <textarea
          className="border rounded-md px-3 py-2 min-h-[90px]"
          value={data.contact_cta_body}
          onChange={(e) => setData((p) => ({ ...p, contact_cta_body: e.target.value }))}
        />
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
