"use client";

import { useEffect, useState } from "react";
import PageEditor from "../../components/admin/PageEditor";
import { supabase } from "../../lib/supabase";

export default function ProductsPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("applications_page")
      .select("*")
      .single()
      .then(({ data, error }) => {
        if (data) setData(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (updatedData: any) => {
    const { error } = await supabase
      .from("applications_page")
      .upsert(updatedData);
    return !error;
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <PageEditor
      title="Applications Page"
      breadcrumb="Applications Page"
      initialData={data}
      onSave={handleSave}
    />
  );
}
