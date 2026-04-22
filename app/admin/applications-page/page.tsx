"use client";

import { useEffect, useState } from "react";
import SectionEditor from "../../components/admin/SectionEditor";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";

export default function ApplicationsPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("applications_page")
          .select("*")
          .single();
        if (data) setData(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (updatedData: any) => {
    const { error } = await supabase.from("applications_page").upsert(updatedData);
    if (error) return false;
    await triggerRevalidate(["page:applications", "seo:/applications", "applications"]);
    return true;
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <SectionEditor
      title="Applications Page"
      description="Manage applications page hero and introduction"
      initialData={data}
      onSave={handleSave}
    />
  );
}
