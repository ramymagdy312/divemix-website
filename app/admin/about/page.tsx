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
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/admin/Breadcrumb";
import * as LucideIcons from "lucide-react";
import IconPickerModal from "../../components/admin/IconPickerModal";

import BasicInfoCard from "../../components/admin/BasicInfoCard";
import PageEditorHeader from "../../components/admin/PageEditorHeader";

interface AboutPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  vision: string;
  mission: string;
  company_overview: string;
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
  timeline: {
    year: string;
    title: string;
    description: string;
  }[];
}

export default function AboutAdmin() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [iconPickerIndex, setIconPickerIndex] = useState<number | null>(null);
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
      } else {
        setData(aboutPageData);
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
        { title: "", description: "", icon: "Star" },
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

  const updateValue = (index: number, field: string, value: string) => {
    if (!data) return;
    const newValues = [...(data?.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    setData({ ...data!, values: newValues });
  };

  const addTimelineItem = () => {
    if (!data) return;
    setData({
      ...data!,
      timeline: [
        ...(data?.timeline || []),
        { year: "", title: "", description: "" },
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

  const updateTimelineItem = (index: number, field: string, value: string) => {
    if (!data) return;
    const newTimeline = [...(data?.timeline || [])];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
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
                <Label htmlFor="vision">Vision</Label>
                {editing ? (
                  <Textarea
                    id="vision"
                    value={data?.vision}
                    onChange={(e) =>
                      setData({ ...data!, vision: e.target.value })
                    }
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-6">
                    {data?.vision || "No vision text added yet."}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="mission">Mission</Label>
                {editing ? (
                  <Textarea
                    id="mission"
                    value={data?.mission}
                    onChange={(e) =>
                      setData({ ...data!, mission: e.target.value })
                    }
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-6">
                    {data?.mission || "No mission text added yet."}
                  </p>
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
              <Textarea
                value={data?.company_overview}
                onChange={(e) =>
                  setData({ ...data!, company_overview: e.target.value })
                }
                rows={6}
              />
            ) : (
              <p className="text-sm text-muted-foreground leading-6 whitespace-pre-line">
                {data?.company_overview || "No company overview added yet."}
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
                    <Label htmlFor={`title-${index}`}>Title</Label>
                    {editing ? (
                      <Input
                        id={`title-${index}`}
                        value={value.title}
                        onChange={(e) => updateValue(index, "title", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {value.title || "No title"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`icon-${index}`}>Icon</Label>
                    {editing ? (
                      <button
                        type="button"
                        onClick={() => setIconPickerIndex(index)}
                        className="w-full border rounded-md px-3 py-2 text-sm hover:bg-muted flex items-center justify-between"
                      >
                        <span className="inline-flex items-center gap-2">
                          {(() => {
                            const IconComp =
                              (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[value.icon] ||
                              LucideIcons.Star;
                            return <IconComp className="h-4 w-4" />;
                          })()}
                          <span>{value.icon}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">Change</span>
                      </button>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{value.icon}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor={`desc-${index}`}>Description</Label>
                  {editing ? (
                    <Textarea
                      id={`desc-${index}`}
                      value={value.description}
                      onChange={(e) => updateValue(index, "description", e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {value.description || "No description"}
                    </p>
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
                      <Input
                        id={`year-${index}`}
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
                    <Label htmlFor={`timeline-title-${index}`}>Title</Label>
                    {editing ? (
                      <Input
                        id={`timeline-title-${index}`}
                        value={item.title}
                        onChange={(e) => updateTimelineItem(index, "title", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.title || "No title"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`timeline-desc-${index}`}>Description</Label>
                    {editing ? (
                      <Textarea
                        id={`timeline-desc-${index}`}
                        value={item.description}
                        onChange={(e) =>
                          updateTimelineItem(index, "description", e.target.value)
                        }
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description || "No description"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <IconPickerModal
        open={iconPickerIndex !== null}
        selectedIcon={iconPickerIndex !== null ? data?.values?.[iconPickerIndex]?.icon : "Star"}
        onClose={() => setIconPickerIndex(null)}
        onSelect={(iconName) => {
          if (iconPickerIndex !== null) {
            updateValue(iconPickerIndex, "icon", iconName);
          }
          setIconPickerIndex(null);
        }}
      />
    </div>
  );
}
