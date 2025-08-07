"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import IntroductionCard from "../IntroductionCard";
import BasicInfoCard from "./BasicInfoCard";
import Breadcrumb from "./Breadcrumb";
import PageEditorHeader from "./PageEditorHeader";

interface PageData {
  id?: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
}

interface PageEditorProps {
  title: string;
  breadcrumb: string;
  initialData: PageData;
  onSave: (data: PageData) => Promise<boolean>;
}

export default function PageEditor({
  title,
  breadcrumb,
  initialData,
  onSave,
}: PageEditorProps) {
  const [data, setData] = useState<PageData>(initialData);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave({
      ...data,
      updated_at: new Date().toISOString(),
    } as any);
    setSaving(false);
    if (success) {
      setEditing(false);
      toast.success(`${title} updated successfully!`);
    } else {
      toast.error("Error saving data");
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ name: "Pages" }, { name: breadcrumb }]} />

      <PageEditorHeader
        title={title}
        editing={editing}
        setEditing={setEditing}
        saving={saving}
        handleSave={handleSave}
      />

      <div className="space-y-8">
        {/* Basic Info */}
        <BasicInfoCard data={data} editing={editing} setData={setData} />

        {/* Intro Section */}
        <IntroductionCard editing={editing} data={data} setData={setData} />
      </div>
    </div>
  );
}
