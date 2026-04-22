"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import FolderExplorerSingle from "./FolderExplorerSingle";

type SectionData = {
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
};

interface SectionEditorProps {
  title: string;
  description?: string;
  initialData: SectionData;
  onSave: (data: SectionData) => Promise<boolean>;
}

export default function SectionEditor({
  title,
  description,
  initialData,
  onSave,
}: SectionEditorProps) {
  const [form, setForm] = useState<SectionData>(initialData);
  const [saving, setSaving] = useState(false);

  const update = (key: keyof SectionData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(form);
    if (success) {
      toast.success("Saved and published");
    } else {
      toast.error("Failed to save changes");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      <div className="grid gap-4">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          className="border rounded-md px-3 py-2"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="border rounded-md px-3 py-2 min-h-[90px]"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <label className="text-sm font-medium text-gray-700">Hero image</label>
        <FolderExplorerSingle
          image={form.hero_image}
          onImageChange={(image) => update("hero_image", image)}
          label="Hero Image"
        />

        <label className="text-sm font-medium text-gray-700">Intro title</label>
        <input
          className="border rounded-md px-3 py-2"
          value={form.intro_title}
          onChange={(e) => update("intro_title", e.target.value)}
        />

        <label className="text-sm font-medium text-gray-700">Intro description</label>
        <textarea
          className="border rounded-md px-3 py-2 min-h-[90px]"
          value={form.intro_description}
          onChange={(e) => update("intro_description", e.target.value)}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
