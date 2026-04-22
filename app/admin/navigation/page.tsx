"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";

interface NavItem {
  id?: string;
  label: string;
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
        setItems((data || []) as NavItem[]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { label: "New Link", href: "/", sort_order: prev.length + 1, is_external: false, is_active: true },
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

    const { error } = await supabase.from("nav_items").insert(normalized.map(({ id, ...rest }) => rest));
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
        <p className="text-gray-600">Manage main navbar links and order.</p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="border rounded-md p-3 grid grid-cols-12 gap-2 items-center">
            <input
              className="border rounded px-2 py-1 col-span-3"
              value={item.label}
              onChange={(e) => updateItem(index, { label: e.target.value })}
            />
            <input
              className="border rounded px-2 py-1 col-span-4"
              value={item.href}
              onChange={(e) => updateItem(index, { href: e.target.value })}
            />
            <label className="col-span-2 text-xs inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.is_external}
                onChange={(e) => updateItem(index, { is_external: e.target.checked })}
              />
              external
            </label>
            <label className="col-span-1 text-xs inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.is_active}
                onChange={(e) => updateItem(index, { is_active: e.target.checked })}
              />
              active
            </label>
            <div className="col-span-2 flex justify-end gap-1">
              <button className="px-2 py-1 border rounded" onClick={() => move(index, -1)} type="button">?</button>
              <button className="px-2 py-1 border rounded" onClick={() => move(index, 1)} type="button">?</button>
              <button className="px-2 py-1 border rounded text-red-600" onClick={() => removeItem(index)} type="button">Delete</button>
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
