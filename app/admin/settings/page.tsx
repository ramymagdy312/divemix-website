"use client";

import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Separator } from "@/app/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Clock,
  Edit3,
  Globe,
  Mail,
  MessageCircle,
  Plus,
  Save,
  Settings as SettingsIcon,
  Shield,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supportItems, setSupportItems] = useState<SupportItem[]>([]);
  const [editingItem, setEditingItem] = useState<SupportItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .order("key");

      if (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings");
        return;
      }

      let settingsData = data || [];

      // Add missing default settings
      const defaultSettings = [
        {
          key: "contact_email",
          value: "ramy.magdy@rockettravelsystem.com",
          description: "Email address for contact form submissions",
        },
        {
          key: "whatsapp_number",
          value: "+201010606967",
          description: "WhatsApp number for contact (with country code)",
        },
        {
          key: "whatsapp_message",
          value:
            "Hello! I would like to get more information about your services.",
          description: "Default WhatsApp message",
        },
        {
          key: "show_branches_in_footer",
          value: "true",
          description: "Show branch contact information in footer (true/false)",
        },
        {
          key: "show_whatsapp_float",
          value: "true",
          description: "Show floating WhatsApp button (true/false)",
        },
        {
          key: "footer_branches_title",
          value: "Our Branches",
          description: "Title for branches section in footer",
        },
        {
          key: "support_section_title",
          value: "Support",
          description: "Title for support section in footer",
        },
        {
          key: "support_section_enabled",
          value: "true",
          description: "Show support section in footer (true/false)",
        },
        {
          key: "support_items",
          value: JSON.stringify([
            {
              id: "working_hours",
              icon: "Clock",
              title: "Working Hours",
              subtitle: "Mon - Fri: 9:00 AM - 6:00 PM",
              enabled: true,
            },
            {
              id: "languages",
              icon: "Globe",
              title: "Languages",
              subtitle: "Arabic, English",
              enabled: true,
            },
            {
              id: "quality_certified",
              icon: "Shield",
              title: "Quality Certified",
              subtitle: "ISO 9001:2015",
              enabled: true,
            },
          ]),
          description: "JSON array of support items to display in footer",
        },
      ];

      const existingKeys = settingsData.map((s) => s.key);
      const missingSettings = defaultSettings.filter(
        (s) => !existingKeys.includes(s.key)
      );

      if (missingSettings.length > 0) {
        // Insert missing settings
        const { error: insertError } = await supabase
          .from("settings")
          .insert(missingSettings);

        if (insertError) {
          console.error("Error inserting missing settings:", insertError);
        } else {
          // Refetch to get all settings including newly inserted ones
          const { data: updatedData } = await supabase
            .from("settings")
            .select("*")
            .order("key");
          settingsData = updatedData || settingsData;
        }
      }

      setSettings(settingsData);

      // Parse support items from settings
      const supportItemsSetting = settingsData.find(
        (s) => s.key === "support_items"
      );
      if (supportItemsSetting?.value) {
        try {
          const items = JSON.parse(supportItemsSetting.value);
          setSupportItems(items);
        } catch (error) {
          console.error("Error parsing support items:", error);
          setSupportItems([]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update support items in settings
      const updatedSettings = settings.map((setting) => {
        if (setting.key === "support_items") {
          return {
            ...setting,
            value: JSON.stringify(supportItems),
          };
        }
        return setting;
      });

      const updates = updatedSettings.map((setting) => ({
        key: setting.key,
        value: setting.value,
        description: setting.description,
      }));

      const { error } = await supabase
        .from("settings")
        .upsert(updates, { onConflict: "key" });

      if (error) {
        console.error("Error saving settings:", error);
        toast.error("Failed to save settings");
        return;
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Clock":
        return Clock;
      case "Globe":
        return Globe;
      case "Shield":
        return Shield;
      case "Award":
        return Save; // Using Save as Award placeholder
      case "Users":
        return MessageCircle; // Using MessageCircle as Users placeholder
      case "Zap":
        return Mail; // Using Mail as Zap placeholder
      case "Settings":
        return SettingsIcon;
      default:
        return SettingsIcon;
    }
  };

  const addSupportItem = () => {
    const newItem: SupportItem = {
      id: `item_${Date.now()}`,
      icon: "Clock",
      title: "New Item",
      subtitle: "Description",
      enabled: true,
    };
    setSupportItems([...supportItems, newItem]);
    setEditingItem(newItem);
    setShowAddForm(false);
  };

  const updateSupportItem = (id: string, updates: Partial<SupportItem>) => {
    setSupportItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteSupportItem = (id: string) => {
    setSupportItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  const toggleSupportItem = (id: string) => {
    updateSupportItem(id, {
      enabled: !supportItems.find((item) => item.id === id)?.enabled,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const contactEmailSetting = settings.find((s) => s.key === "contact_email");
  const whatsappNumberSetting = settings.find(
    (s) => s.key === "whatsapp_number"
  );
  const whatsappMessageSetting = settings.find(
    (s) => s.key === "whatsapp_message"
  );
  const showBranchesInFooterSetting = settings.find(
    (s) => s.key === "show_branches_in_footer"
  );
  const showWhatsappFloatSetting = settings.find(
    (s) => s.key === "show_whatsapp_float"
  );
  const footerBranchesTitleSetting = settings.find(
    (s) => s.key === "footer_branches_title"
  );
  const supportSectionTitleSetting = settings.find(
    (s) => s.key === "support_section_title"
  );
  const supportSectionEnabledSetting = settings.find(
    (s) => s.key === "support_section_enabled"
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground">
            Configure email, WhatsApp, footer, and support section settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-6 w-6 text-blue-600 mr-3" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure email settings for contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">
                  Contact Form Email Address
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmailSetting?.value || ""}
                  onChange={(e) =>
                    updateSetting("contact_email", e.target.value)
                  }
                  placeholder="contact@example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Email address where contact form submissions will be sent
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
                WhatsApp Settings
              </CardTitle>
              <CardDescription>
                Configure WhatsApp contact settings and default messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
                <Input
                  id="whatsapp-number"
                  type="text"
                  value={whatsappNumberSetting?.value || ""}
                  onChange={(e) =>
                    updateSetting("whatsapp_number", e.target.value)
                  }
                  placeholder="+1234567890"
                />
                <p className="text-sm text-muted-foreground">
                  WhatsApp number with country code (e.g., +201234567890)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-message">
                  Default WhatsApp Message
                </Label>
                <Textarea
                  id="whatsapp-message"
                  value={whatsappMessageSetting?.value || ""}
                  onChange={(e) =>
                    updateSetting("whatsapp_message", e.target.value)
                  }
                  rows={3}
                  placeholder="Hello! I would like to get more information about your services."
                />
                <p className="text-sm text-muted-foreground">
                  Default message that will be pre-filled when users click
                  WhatsApp contact
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="show-whatsapp-float">
                  Show Floating WhatsApp Button
                </Label>
                <Select
                  value={showWhatsappFloatSetting?.value || "true"}
                  onValueChange={(value) =>
                    updateSetting("show_whatsapp_float", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      Yes, show floating button
                    </SelectItem>
                    <SelectItem value="false">
                      No, hide floating button
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Display floating WhatsApp contact button on all pages
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-6 w-6 text-purple-600 mr-3" />
                Footer Settings
              </CardTitle>
              <CardDescription>
                Configure footer display options and floating elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="show-branches">Show Branches in Footer</Label>
                <Select
                  value={showBranchesInFooterSetting?.value || "true"}
                  onValueChange={(value) =>
                    updateSetting("show_branches_in_footer", value)
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
                <p className="text-sm text-muted-foreground">
                  Display branch contact information in the website footer
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-branches-title">
                  Footer Branches Section Title
                </Label>
                <Input
                  id="footer-branches-title"
                  type="text"
                  value={footerBranchesTitleSetting?.value || "Our Branches"}
                  onChange={(e) =>
                    updateSetting("footer_branches_title", e.target.value)
                  }
                  placeholder="Our Branches"
                />
                <p className="text-sm text-muted-foreground">
                  Title displayed above the branches section in footer
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support & Info Settings */}
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <SettingsIcon className="h-6 w-6 text-orange-600 mr-3" />
                    Support & Info Section
                  </CardTitle>
                  <CardDescription>
                    Configure support section settings and manage support items
                  </CardDescription>
                </div>
                <Button
                  onClick={addSupportItem}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="support-section-title">Section Title</Label>
                  <Input
                    id="support-section-title"
                    type="text"
                    value={supportSectionTitleSetting?.value || "Support"}
                    onChange={(e) =>
                      updateSetting("support_section_title", e.target.value)
                    }
                    placeholder="Support"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="show-support-section">
                    Show Support Section
                  </Label>
                  <Select
                    value={supportSectionEnabledSetting?.value || "true"}
                    onValueChange={(value) =>
                      updateSetting("support_section_enabled", value)
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

              {/* Support Items List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Support Items</h3>

                {supportItems.length === 0 ? (
                  <Alert>
                    <SettingsIcon className="h-4 w-4" />
                    <AlertDescription>
                      No support items configured.
                      <Button
                        variant="link"
                        className="p-0 h-auto ml-1"
                        onClick={addSupportItem}
                      >
                        Add your first item
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid gap-4">
                    {supportItems.map((item) => {
                      const IconComponent = getIconComponent(item.icon);
                      return (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            {editingItem?.id === item.id ? (
                              // Edit Form
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`title-${item.id}`}>
                                      Title
                                    </Label>
                                    <Input
                                      id={`title-${item.id}`}
                                      type="text"
                                      value={item.title}
                                      onChange={(e) =>
                                        updateSupportItem(item.id, {
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`icon-${item.id}`}>
                                      Icon
                                    </Label>
                                    <Select
                                      value={item.icon}
                                      onValueChange={(value) =>
                                        updateSupportItem(item.id, {
                                          icon: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select icon" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Clock">
                                          Clock (Working Hours)
                                        </SelectItem>
                                        <SelectItem value="Globe">
                                          Globe (Languages)
                                        </SelectItem>
                                        <SelectItem value="Shield">
                                          Shield (Certification)
                                        </SelectItem>
                                        <SelectItem value="Award">
                                          Award (Awards)
                                        </SelectItem>
                                        <SelectItem value="Users">
                                          Users (Team)
                                        </SelectItem>
                                        <SelectItem value="Zap">
                                          Zap (Fast Service)
                                        </SelectItem>
                                        <SelectItem value="Settings">
                                          Settings (General)
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`subtitle-${item.id}`}>
                                    Subtitle/Description
                                  </Label>
                                  <Input
                                    id={`subtitle-${item.id}`}
                                    type="text"
                                    value={item.subtitle}
                                    onChange={(e) =>
                                      updateSupportItem(item.id, {
                                        subtitle: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingItem(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={() => setEditingItem(null)}>
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // Display Mode
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
                                    <h4
                                      className={`font-medium ${
                                        item.enabled
                                          ? ""
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {item.title}
                                    </h4>
                                    <p
                                      className={`text-sm ${
                                        item.enabled
                                          ? "text-muted-foreground"
                                          : "text-muted-foreground/60"
                                      }`}
                                    >
                                      {item.subtitle}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={
                                      item.enabled ? "default" : "secondary"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => toggleSupportItem(item.id)}
                                  >
                                    {item.enabled ? "Enabled" : "Disabled"}
                                  </Badge>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingItem(item)}
                                  >
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
        </TabsContent>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Settings Preview</CardTitle>
            <CardDescription>
              Preview of your current configuration settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Email Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Contact Form Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-1">
                    Form submissions will be sent to:
                  </p>
                  <Badge variant="outline" className="text-blue-600">
                    {contactEmailSetting?.value || "Not configured"}
                  </Badge>
                </CardContent>
              </Card>

              {/* WhatsApp Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                    WhatsApp Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Number:</p>
                    <Badge variant="outline" className="text-green-600">
                      {whatsappNumberSetting?.value || "Not configured"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Default message:
                    </p>
                    <p className="text-xs italic text-muted-foreground">
                      "{whatsappMessageSetting?.value || "Not configured"}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Footer & Float Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <SettingsIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Footer & Float
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Branches:
                    </span>
                    <Badge
                      variant={
                        showBranchesInFooterSetting?.value === "true"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {showBranchesInFooterSetting?.value === "true"
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Title:</p>
                    <p className="text-xs font-medium">
                      "{footerBranchesTitleSetting?.value || "Our Branches"}"
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      WhatsApp float:
                    </span>
                    <Badge
                      variant={
                        showWhatsappFloatSetting?.value === "true"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {showWhatsappFloatSetting?.value === "true"
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Support Section Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <SettingsIcon className="h-4 w-4 mr-2 text-orange-600" />
                    Support Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Section:
                    </span>
                    <Badge
                      variant={
                        supportSectionEnabledSetting?.value === "true"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {supportSectionEnabledSetting?.value === "true"
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Title:</p>
                    <p className="text-xs font-medium">
                      "{supportSectionTitleSetting?.value || "Support"}"
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Active items:
                    </span>
                    <Badge variant="outline" className="text-primary">
                      {supportItems.filter((item) => item.enabled).length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
