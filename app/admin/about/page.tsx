"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/admin/Breadcrumb";

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

      <div className="space-y-8">
        {/* Basic Info */}
        {data && (
          <BasicInfoCard data={data} editing={editing} setData={setData} />
        )}

        {/* Vision & Mission */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Vision & Mission</h2>
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
                  <p>{data?.vision}</p>
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
                  <p>{data?.mission}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
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
              <p>{data?.company_overview}</p>
            )}
          </CardContent>
        </Card>

        {/* Core Values Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Core Values</h2>
              {editing && (
                <Button size="sm" onClick={addValue}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Value
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {data?.values.map((value, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        {editing ? (
                          <Input
                            id={`title-${index}`}
                            value={value.title}
                            onChange={(e) =>
                              updateValue(index, "title", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            {value.title}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`icon-${index}`}>Icon</Label>
                        {editing ? (
                          <Select
                            value={value.icon}
                            onValueChange={(val) =>
                              updateValue(index, "icon", val)
                            }
                          >
                            <SelectTrigger
                              id={`icon-${index}`}
                              className="w-full"
                            >
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Award">Award</SelectItem>
                              <SelectItem value="Focus">Focus</SelectItem>
                              <SelectItem value="Users">Users</SelectItem>
                              <SelectItem value="Shield">Shield</SelectItem>
                              <SelectItem value="Star">Star</SelectItem>
                              <SelectItem value="Heart">Heart</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            {value.icon}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-1">
                        {editing && (
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800 mt-6"
                              onClick={() => removeValue(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`desc-${index}`}>Description</Label>
                    {editing ? (
                      <Textarea
                        id={`desc-${index}`}
                        value={value.description}
                        onChange={(e) =>
                          updateValue(index, "description", e.target.value)
                        }
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {value.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Timeline Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Company Timeline</h2>
              {editing && (
                <Button size="sm" onClick={addTimelineItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Timeline Item
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {data?.timeline.map((item, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`year-${index}`}>Year</Label>
                      {editing ? (
                        <Input
                          id={`year-${index}`}
                          value={item.year}
                          onChange={(e) =>
                            updateTimelineItem(index, "year", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1 font-semibold">
                          {item.year}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`timeline-title-${index}`}>Title</Label>
                      {editing ? (
                        <Input
                          id={`timeline-title-${index}`}
                          value={item.title}
                          onChange={(e) =>
                            updateTimelineItem(index, "title", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`timeline-desc-${index}`}>
                        Description
                      </Label>
                      {editing ? (
                        <Textarea
                          id={`timeline-desc-${index}`}
                          value={item.description}
                          onChange={(e) =>
                            updateTimelineItem(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div>
                      {editing && (
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mt-6"
                            onClick={() => removeTimelineItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
