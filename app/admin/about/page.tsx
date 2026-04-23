"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/admin/Breadcrumb";
import { IconPicker, IconRenderer } from "../../components/admin/iconPicker";
import I18nTextField, { type I18nValue } from "../../components/admin/i18n/I18nTextField";
import I18nTextarea from "../../components/admin/i18n/I18nTextarea";
import { normalizeI18n, seedI18n } from "../../lib/i18n/resolve";
import { triggerRevalidate } from "../../lib/revalidate-client";

import BasicInfoCard from "../../components/admin/BasicInfoCard";
import PageEditorHeader from "../../components/admin/PageEditorHeader";

interface AboutPageData {
  id: string;
  title: I18nValue;
  description: I18nValue;
  hero_image: string;
  vision: I18nValue;
  mission: I18nValue;
  company_overview: I18nValue;
  values: {
    title: I18nValue;
    description: I18nValue;
    icon: string;
  }[];
  timeline: {
    year: string;
    title: I18nValue;
    description: I18nValue;
  }[];
}

function normalizeAboutRow(row: any): AboutPageData {
  return {
    id: row.id,
    title: normalizeI18n(row.title),
    description: normalizeI18n(row.description),
    hero_image: row.hero_image || "",
    vision: normalizeI18n(row.vision),
    mission: normalizeI18n(row.mission),
    company_overview: normalizeI18n(row.company_overview),
    values: Array.isArray(row.values)
      ? row.values.map((v: any) => ({
          title: normalizeI18n(v.title),
          description: normalizeI18n(v.description),
          icon: v.icon || "Star",
        }))
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((t: any) => ({
          year: t.year || "",
          title: normalizeI18n(t.title),
          description: normalizeI18n(t.description),
        }))
      : [],
  };
}

export default function AboutAdmin() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const valuesCount = data?.values?.length || 0;
  const timelineCount = data?.timeline?.length || 0;

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data: aboutPageData, error } = await supabase
        .from("about_page")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching about data:", error);
        setData(null);
      } else if (aboutPageData) {
        setData(normalizeAboutRow(aboutPageData));
      }
    } catch (error) {
      console.error("Error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("about_page").upsert({
        ...(data || {}),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving about data:", error);
        toast.error("Error saving data");
      } else {
        await triggerRevalidate(["page:about", "seo:/about"]);
        setEditing(false);
        toast.success("About page updated successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (!data) return;
    setData({
      ...data!,
      values: [
        ...(data?.values || []),
        { title: seedI18n(""), description: seedI18n(""), icon: "Star" },
      ],
    });
  };

  const removeValue = (index: number) => {
    if (!data) return;
    setData({
      ...data!,
      values: (data?.values || []).filter((_, i) => i !== index),
    });
  };

  const updateValue = (index: number, field: string, value: string | I18nValue) => {
    if (!data) return;
    const newValues = [...(data?.values || [])];
    newValues[index] = { ...newValues[index], [field]: value } as any;
    setData({ ...data!, values: newValues });
  };

  const addTimelineItem = () => {
    if (!data) return;
    setData({
      ...data!,
      timeline: [
        ...(data?.timeline || []),
        { year: "", title: seedI18n(""), description: seedI18n("") },
      ],
    });
  };

  const removeTimelineItem = (index: number) => {
    if (!data) return;
    setData({
      ...data!,
      timeline: (data?.timeline || []).filter((_, i) => i !== index),
    });
  };

  const updateTimelineItem = (index: number, field: string, value: string | I18nValue) => {
    if (!data) return;
    const newTimeline = [...(data?.timeline || [])];
    newTimeline[index] = { ...newTimeline[index], [field]: value } as any;
    setData({ ...data!, timeline: newTimeline });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ name: "Pages" }, { name: "About Page" }]} />

      <PageEditorHeader
        title="About Page"
        editing={editing}
        setEditing={setEditing}
        saving={saving}
        handleSave={handleSave}
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Core Values</p>
              <p className="text-2xl font-bold">{valuesCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Timeline Items</p>
              <p className="text-2xl font-bold">{timelineCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Current Mode</p>
              <p className="text-2xl font-bold">{editing ? "Editing" : "Preview"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Basic Info */}
        {data && (
          <BasicInfoCard data={data} editing={editing} setData={setData} />
        )}

        {/* Vision & Mission */}
        <Card>
          <CardHeader>
            <CardTitle>Vision & Mission</CardTitle>
            <CardDescription>
              Define what the company aims to achieve and how it delivers value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {editing ? (
                  <I18nTextarea
                    label="Vision"
                    value={data?.vision}
                    onChange={(v) => setData({ ...data!, vision: v })}
                    rows={4}
                  />
                ) : (
                  <>
                    <Label>Vision</Label>
                    <p className="text-sm text-muted-foreground leading-6">
                      {(data?.vision as any)?.en || "No vision text added yet."}
                    </p>
                  </>
                )}
              </div>
              <div>
                {editing ? (
                  <I18nTextarea
                    label="Mission"
                    value={data?.mission}
                    onChange={(v) => setData({ ...data!, mission: v })}
                    rows={4}
                  />
                ) : (
                  <>
                    <Label>Mission</Label>
                    <p className="text-sm text-muted-foreground leading-6">
                      {(data?.mission as any)?.en || "No mission text added yet."}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
            <CardDescription>
              Main narrative shown on the About page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <I18nTextarea
                label="Overview"
                value={data?.company_overview}
                onChange={(v) => setData({ ...data!, company_overview: v })}
                rows={6}
              />
            ) : (
              <p className="text-sm text-muted-foreground leading-6 whitespace-pre-line">
                {(data?.company_overview as any)?.en || "No company overview added yet."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Core Values Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Core Values</CardTitle>
                <CardDescription>
                  Highlight the principles that represent the company culture.
                </CardDescription>
              </div>
              {editing && (
                <Button size="sm" onClick={addValue}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Value
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {valuesCount === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground text-center">
                No core values yet. Add the first one to get started.
              </div>
            )}

            {data?.values.map((value, index) => (
              <div key={index} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Value #{index + 1}
                  </p>
                  {editing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeValue(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {editing ? (
                      <I18nTextField
                        label="Title"
                        value={value.title}
                        onChange={(v) => updateValue(index, "title", v)}
                      />
                    ) : (
                      <>
                        <Label>Title</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(value.title as any)?.en || "No title"}
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <Label>Icon</Label>
                    {editing ? (
                      <IconPicker
                        value={value.icon}
                        onValueChange={(icon) => updateValue(index, "icon", icon)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-2">
                        <IconRenderer iconName={value.icon} size="sm" />
                        {value.icon}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  {editing ? (
                    <I18nTextarea
                      label="Description"
                      value={value.description}
                      onChange={(v) => updateValue(index, "description", v)}
                      rows={2}
                    />
                  ) : (
                    <>
                      <Label>Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(value.description as any)?.en || "No description"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Company Timeline Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Company Timeline</CardTitle>
                <CardDescription>
                  Present milestones in chronological order.
                </CardDescription>
              </div>
              {editing && (
                <Button size="sm" onClick={addTimelineItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Timeline Item
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {timelineCount === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground text-center">
                No timeline entries yet. Add your first milestone.
              </div>
            )}
            {data?.timeline.map((item, index) => (
              <div key={index} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Milestone #{index + 1}
                  </p>
                  {editing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimelineItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`year-${index}`}>Year</Label>
                    {editing ? (
                      <input
                        id={`year-${index}`}
                        className="border rounded px-2 py-1.5 w-full"
                        value={item.year}
                        onChange={(e) => updateTimelineItem(index, "year", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1 font-semibold">
                        {item.year || "No year"}
                      </p>
                    )}
                  </div>

                  <div>
                    {editing ? (
                      <I18nTextField
                        label="Title"
                        value={item.title}
                        onChange={(v) => updateTimelineItem(index, "title", v)}
                      />
                    ) : (
                      <>
                        <Label>Title</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(item.title as any)?.en || "No title"}
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    {editing ? (
                      <I18nTextarea
                        label="Description"
                        value={item.description}
                        onChange={(v) => updateTimelineItem(index, "description", v)}
                        rows={2}
                      />
                    ) : (
                      <>
                        <Label>Description</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(item.description as any)?.en || "No description"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
