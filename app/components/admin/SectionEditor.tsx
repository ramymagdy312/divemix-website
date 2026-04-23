"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import FolderExplorerSingle from "./FolderExplorerSingle";
import I18nTextField, { type I18nValue } from "./i18n/I18nTextField";
import I18nTextarea from "./i18n/I18nTextarea";
import { normalizeI18n } from "@/app/lib/i18n/resolve";

type SectionData = {
  title: unknown;
  description: unknown;
  hero_image: string;
  intro_title: unknown;
  intro_description: unknown;
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
  const [form, setForm] = useState<SectionData>({
    ...initialData,
    title: normalizeI18n(initialData.title as any),
    description: normalizeI18n(initialData.description as any),
    intro_title: normalizeI18n(initialData.intro_title as any),
    intro_description: normalizeI18n(initialData.intro_description as any),
  });
  const [saving, setSaving] = useState(false);

  const updateI18n = (key: keyof SectionData, value: I18nValue) => {
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
        <I18nTextField
          label="Title"
          value={form.title}
          onChange={(v) => updateI18n("title", v)}
        />

        <I18nTextarea
          label="Description"
          value={form.description}
          onChange={(v) => updateI18n("description", v)}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Hero image</label>
          <FolderExplorerSingle
            image={form.hero_image}
            onImageChange={(image) => setForm((p) => ({ ...p, hero_image: image }))}
            label="Hero Image"
          />
        </div>

        <I18nTextField
          label="Intro title"
          value={form.intro_title}
          onChange={(v) => updateI18n("intro_title", v)}
        />

        <I18nTextarea
          label="Intro description"
          value={form.intro_description}
          onChange={(v) => updateI18n("intro_description", v)}
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
