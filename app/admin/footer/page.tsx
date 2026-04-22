"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { triggerRevalidate } from "../../lib/revalidate-client";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Separator } from "@/app/components/ui/separator";
import { Clock, Edit3, Plus, Settings as SettingsIcon, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import IconPickerModal from "../../components/admin/IconPickerModal";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterData {
  id?: string;
  columns: FooterColumn[];
  powered_by_text: string;
  copyright_name: string;
}

interface Setting {
  key: string;
  value: string;
  description: string;
}

interface SupportItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

const defaults: FooterData = {
  columns: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "Our Services",
      links: [
        { label: "Products", href: "/products" },
        { label: "Services", href: "/services" },
      ],
    },
  ],
  powered_by_text: "DevsDiamond",
  copyright_name: "Divemix",
};

export default function FooterAdminPage() {
  const [data, setData] = useState<FooterData>(defaults);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [supportItems, setSupportItems] = useState<SupportItem[]>([]);
  const [editingItem, setEditingItem] = useState<SupportItem | null>(null);
  const [iconPickerItemId, setIconPickerItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase
        .from("footer_content")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1),
      supabase.from("settings").select("*").order("key"),
    ])
      .then(([footerResult, settingsResult]) => {
        const row = footerResult.data?.[0];
        if (row) {
          setData({
            id: row.id,
            columns: row.columns || defaults.columns,
            powered_by_text: row.powered_by_text || defaults.powered_by_text,
            copyright_name: row.copyright_name || defaults.copyright_name,
          });
        }

        const settingsData = settingsResult.data || [];
        setSettings(settingsData);
        const supportItemsSetting = settingsData.find((s) => s.key === "support_items");
        if (supportItemsSetting?.value) {
          try {
            setSupportItems(JSON.parse(supportItemsSetting.value));
          } catch {
            setSupportItems([]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getSetting = (key: string, fallback: string) =>
    settings.find((s) => s.key === key)?.value ?? fallback;

  const updateSetting = (key: string, value: string, description: string) => {
    setSettings((prev) => {
      const exists = prev.some((s) => s.key === key);
      if (!exists) return [...prev, { key, value, description }];
      return prev.map((s) => (s.key === key ? { ...s, value } : s));
    });
  };

  const getIconComponent = (iconName: string) =>
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] ||
    SettingsIcon;

  const addColumn = () => {
    setData((prev) => ({
      ...prev,
      columns: [...prev.columns, { title: "New Column", links: [{ label: "", href: "" }] }],
    }));
  };

  const removeColumn = (columnIndex: number) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, idx) => idx !== columnIndex),
    }));
  };

  const updateColumnTitle = (columnIndex: number, title: string) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((col, idx) =>
        idx === columnIndex ? { ...col, title } : col
      ),
    }));
  };

  const addLink = (columnIndex: number) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((col, idx) =>
        idx === columnIndex
          ? { ...col, links: [...col.links, { label: "", href: "" }] }
          : col
      ),
    }));
  };

  const removeLink = (columnIndex: number, linkIndex: number) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((col, idx) =>
        idx === columnIndex
          ? { ...col, links: col.links.filter((_, li) => li !== linkIndex) }
          : col
      ),
    }));
  };

  const updateLink = (
    columnIndex: number,
    linkIndex: number,
    field: "label" | "href",
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((col, idx) =>
        idx === columnIndex
          ? {
              ...col,
              links: col.links.map((link, li) =>
                li === linkIndex ? { ...link, [field]: value } : link
              ),
            }
          : col
      ),
    }));
  };

  const addSupportItem = () => {
    const newItem: SupportItem = {
      id: `item_${Date.now()}`,
      icon: "Clock",
      title: "New Item",
      subtitle: "Description",
      enabled: true,
    };
    setSupportItems((prev) => [...prev, newItem]);
    setEditingItem(newItem);
  };

  const updateSupportItem = (id: string, updates: Partial<SupportItem>) => {
    setSupportItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteSupportItem = (id: string) => {
    setSupportItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItem?.id === id) setEditingItem(null);
  };

  const toggleSupportItem = (id: string) => {
    setSupportItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      columns: data.columns,
      powered_by_text: data.powered_by_text,
      copyright_name: data.copyright_name,
    };

    const result = data.id
      ? await supabase.from("footer_content").update(payload).eq("id", data.id)
      : await supabase.from("footer_content").insert(payload).select("id").single();
    const { error } = result;
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    if (!data.id && "data" in result && result.data?.id) {
      setData((prev) => ({ ...prev, id: result.data.id as string }));
    }

    const footerSettingsPayload = [
      {
        key: "show_branches_in_footer",
        value: getSetting("show_branches_in_footer", "true"),
        description: "Show branch contact information in footer (true/false)",
      },
      {
        key: "footer_branches_title",
        value: getSetting("footer_branches_title", "Our Branches"),
        description: "Title for branches section in footer",
      },
      {
        key: "support_section_title",
        value: getSetting("support_section_title", "Support"),
        description: "Title for support section in footer",
      },
      {
        key: "support_section_enabled",
        value: getSetting("support_section_enabled", "true"),
        description: "Show support section in footer (true/false)",
      },
      {
        key: "support_items",
        value: JSON.stringify(supportItems),
        description: "JSON array of support items to display in footer",
      },
    ];
    const { error: settingsError } = await supabase
      .from("settings")
      .upsert(footerSettingsPayload, { onConflict: "key" });
    if (settingsError) {
      toast.error(settingsError.message);
      setSaving(false);
      return;
    }

    await triggerRevalidate(["footer", "settings"]);
    toast.success("Footer saved and published");
    setSaving(false);
  };

  if (loading) return <div className="h-64 flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Footer</h1>
        <p className="text-gray-600">
          Manage footer columns, links, and attribution in a visual editor.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Footer Columns</CardTitle>
            <CardDescription>
              Add columns and links without writing JSON.
            </CardDescription>
          </div>
          <Button type="button" onClick={addColumn}>
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.columns.length === 0 ? (
            <div className="text-sm text-muted-foreground border rounded-md p-4">
              No columns added yet. Click "Add Column".
            </div>
          ) : (
            data.columns.map((column, columnIndex) => (
              <Card key={columnIndex}>
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`column-title-${columnIndex}`}>Column Title</Label>
                      <Input
                        id={`column-title-${columnIndex}`}
                        value={column.title}
                        onChange={(e) => updateColumnTitle(columnIndex, e.target.value)}
                        placeholder="e.g. Company"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 text-destructive hover:text-destructive"
                      onClick={() => removeColumn(columnIndex)}
                      aria-label="Delete column"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <div
                      key={`${columnIndex}-${linkIndex}`}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`link-label-${columnIndex}-${linkIndex}`}>Label</Label>
                        <Input
                          id={`link-label-${columnIndex}-${linkIndex}`}
                          value={link.label}
                          onChange={(e) =>
                            updateLink(columnIndex, linkIndex, "label", e.target.value)
                          }
                          placeholder="e.g. About Us"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`link-href-${columnIndex}-${linkIndex}`}>URL / Path</Label>
                        <Input
                          id={`link-href-${columnIndex}-${linkIndex}`}
                          value={link.href}
                          onChange={(e) =>
                            updateLink(columnIndex, linkIndex, "href", e.target.value)
                          }
                          placeholder="e.g. /about"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeLink(columnIndex, linkIndex)}
                        aria-label="Delete link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addLink(columnIndex)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2 text-purple-600" />
            Footer Display Settings
          </CardTitle>
          <CardDescription>
            Manage footer branches visibility and section titles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Show Branches in Footer</Label>
            <Select
              value={getSetting("show_branches_in_footer", "true")}
              onValueChange={(value) =>
                updateSetting(
                  "show_branches_in_footer",
                  value,
                  "Show branch contact information in footer (true/false)"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes, show branches</SelectItem>
                <SelectItem value="false">No, hide branches</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="footer-branches-title">Footer Branches Section Title</Label>
            <Input
              id="footer-branches-title"
              value={getSetting("footer_branches_title", "Our Branches")}
              onChange={(e) =>
                updateSetting(
                  "footer_branches_title",
                  e.target.value,
                  "Title for branches section in footer"
                )
              }
              placeholder="Our Branches"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2 text-orange-600" />
                Support Section
              </CardTitle>
              <CardDescription>
                Configure support/info section and manage support items.
              </CardDescription>
            </div>
            <Button type="button" onClick={addSupportItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="support-section-title">Section Title</Label>
              <Input
                id="support-section-title"
                value={getSetting("support_section_title", "Support")}
                onChange={(e) =>
                  updateSetting("support_section_title", e.target.value, "Title for support section in footer")
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Show Support Section</Label>
              <Select
                value={getSetting("support_section_enabled", "true")}
                onValueChange={(value) =>
                  updateSetting(
                    "support_section_enabled",
                    value,
                    "Show support section in footer (true/false)"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes, show section</SelectItem>
                  <SelectItem value="false">No, hide section</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Support Items</h3>
            {supportItems.length === 0 ? (
              <Alert>
                <SettingsIcon className="h-4 w-4" />
                <AlertDescription>No support items configured yet.</AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4">
                {supportItems.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        {editingItem?.id === item.id ? (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                  value={item.title}
                                  onChange={(e) => updateSupportItem(item.id, { title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Icon</Label>
                                <button
                                  type="button"
                                  onClick={() => setIconPickerItemId(item.id)}
                                  className="w-full border rounded-md px-3 py-2 text-sm hover:bg-muted flex items-center justify-between"
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    <span>{item.icon}</span>
                                  </span>
                                  <span className="text-xs text-muted-foreground">Change</span>
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Subtitle/Description</Label>
                              <Input
                                value={item.subtitle}
                                onChange={(e) => updateSupportItem(item.id, { subtitle: e.target.value })}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setEditingItem(null)}>
                                Cancel
                              </Button>
                              <Button onClick={() => setEditingItem(null)}>Save</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`p-2 rounded-lg ${
                                  item.enabled
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className={`font-medium ${item.enabled ? "" : "text-muted-foreground"}`}>
                                  {item.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={item.enabled ? "default" : "secondary"}
                                className="cursor-pointer"
                                onClick={() => toggleSupportItem(item.id)}
                              >
                                {item.enabled ? "Enabled" : "Disabled"}
                              </Badge>
                              <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSupportItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attribution</CardTitle>
          <CardDescription>
            Update footer brand text and copyright name.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="powered-by-text">Powered by text</Label>
            <Input
              id="powered-by-text"
              value={data.powered_by_text}
              onChange={(e) =>
                setData((prev) => ({ ...prev, powered_by_text: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright-name">Copyright name</Label>
            <Input
              id="copyright-name"
              value={data.copyright_name}
              onChange={(e) =>
                setData((prev) => ({ ...prev, copyright_name: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-fit"
      >
        {saving ? "Saving..." : "Save Footer"}
      </Button>

      <IconPickerModal
        open={iconPickerItemId !== null}
        selectedIcon={
          iconPickerItemId
            ? supportItems.find((item) => item.id === iconPickerItemId)?.icon || "Clock"
            : "Clock"
        }
        onClose={() => setIconPickerItemId(null)}
        onSelect={(iconName) => {
          if (iconPickerItemId) updateSupportItem(iconPickerItemId, { icon: iconName });
          setIconPickerItemId(null);
        }}
      />
    </div>
  );
}
