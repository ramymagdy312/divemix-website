"use client";

import { useState } from "react";
import { Save, X, Edit, FileText } from "lucide-react";
import FolderExplorerSingle from "../components/admin/FolderExplorerSingle";
import Image from "next/image";
import toast from "react-hot-toast";
import Breadcrumb from "../components/admin/Breadcrumb";
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

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
    const success = await onSave({ ...data, updated_at: new Date().toISOString() } as any);
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

      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="h-8 w-8 mr-3 text-primary" />
            {title} Management
          </h1>
          <p className="text-muted-foreground">Manage the content of your {title.toLowerCase()}</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Page
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Configure the main content and hero section of the page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="page-title">Page Title</Label>
                {editing ? (
                  <Input
                    id="page-title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium">{data.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Hero Image</Label>
                {editing ? (
                  <FolderExplorerSingle
                    image={data.hero_image}
                    onImageChange={(url) => setData({ ...data, hero_image: url })}
                    label="Hero Image"
                  />
                ) : (
                  <div>
                    {data.hero_image ? (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                        <Image src={data.hero_image} alt="Hero image" fill className="object-cover" />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No image uploaded</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {editing ? (
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm">{data.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Intro Section */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction Section</CardTitle>
            <CardDescription>
              Configure the introduction content that appears below the hero section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="intro-title">Intro Title</Label>
              {editing ? (
                <Input
                  id="intro-title"
                  type="text"
                  value={data.intro_title}
                  onChange={(e) => setData({ ...data, intro_title: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium">{data.intro_title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-description">Intro Description</Label>
              {editing ? (
                <Textarea
                  id="intro-description"
                  value={data.intro_description}
                  onChange={(e) => setData({ ...data, intro_description: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm">{data.intro_description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
