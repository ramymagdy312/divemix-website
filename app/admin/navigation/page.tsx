"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";
import I18nTextField, { type I18nValue } from "../../components/admin/i18n/I18nTextField";
import { normalizeI18n, seedI18n } from "../../lib/i18n/resolve";

interface NavItem {
  id?: string;
  label: I18nValue;
  href: string;
  sort_order: number;
  is_external: boolean;
  is_active: boolean;
}

export default function NavigationAdminPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("nav_items")
          .select("*")
          .order("sort_order", { ascending: true });
        setItems(
          ((data || []) as any[]).map((row) => ({
            id: row.id,
            label: normalizeI18n(row.label),
            href: row.href,
            sort_order: row.sort_order,
            is_external: !!row.is_external,
            is_active: row.is_active !== false,
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        label: seedI18n("New Link"),
        href: "/",
        sort_order: prev.length + 1,
        is_external: false,
        is_active: true,
      },
    ]);
  };

  const updateItem = (index: number, patch: Partial<NavItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((item, idx) => ({ ...item, sort_order: idx + 1 })));
  };

  const save = async () => {
    setSaving(true);
    const normalized = items.map((item, idx) => ({ ...item, sort_order: idx + 1 }));

    const { error: deleteError } = await supabase.from("nav_items").delete().not("id", "is", null);
    if (deleteError) {
      toast.error(deleteError.message);
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("nav_items")
      .insert(normalized.map(({ id, ...rest }) => rest) as any);
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await triggerRevalidate(["nav"]);
    toast.success("Navigation saved and published");
    setSaving(false);
  };

  if (loading) return <div className="h-64 flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Navigation</h1>
        <p className="text-gray-600">Manage main navbar links and order (multilingual).</p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border rounded-md p-3 grid gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <I18nTextField
                label="Label"
                value={item.label}
                onChange={(v) => updateItem(index, { label: v })}
              />
              <div>
                <label className="text-sm font-medium block mb-1.5">Href</label>
                <input
                  className="border rounded px-2 py-1.5 w-full"
                  value={item.href}
                  onChange={(e) => updateItem(index, { href: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="text-sm inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.is_external}
                  onChange={(e) => updateItem(index, { is_external: e.target.checked })}
                />
                external
              </label>
              <label className="text-sm inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.is_active}
                  onChange={(e) => updateItem(index, { is_active: e.target.checked })}
                />
                active
              </label>
              <div className="ml-auto flex gap-1">
                <button className="px-2 py-1 border rounded" onClick={() => move(index, -1)} type="button">
                  Up
                </button>
                <button className="px-2 py-1 border rounded" onClick={() => move(index, 1)} type="button">
                  Down
                </button>
                <button
                  className="px-2 py-1 border rounded text-red-600"
                  onClick={() => removeItem(index)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button type="button" className="px-3 py-2 border rounded" onClick={addItem}>
          Add Link
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-60"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Navigation"}
        </button>
      </div>
    </div>
  );
}
