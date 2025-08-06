"use client";

import { useState } from "react";
import { Save, X, Edit } from "lucide-react";
import FolderExplorerSingle from "../components/admin/FolderExplorerSingle";
import Image from "next/image";
import toast from "react-hot-toast";
import Breadcrumb from "../components/admin/Breadcrumb";

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title} Management</h1>
          <p className="mt-2 text-gray-600">Manage the content of your {title.toLowerCase()}</p>
        </div>
        <div className="flex space-x-4">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800">
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50">
                <Save className="h-4 w-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
              <Edit className="h-4 w-4" />
              <span>Edit Page</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              {editing ? (
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data.title}</p>
              )}
            </div>
            <div>
              {editing ? (
                <FolderExplorerSingle
                  image={data.hero_image}
                  onImageChange={(url) => setData({ ...data, hero_image: url })}
                  label="Hero Image"
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                  {data.hero_image ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                      <Image src={data.hero_image} alt="Hero image" fill className="object-cover" />
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No image uploaded</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            {editing ? (
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <p className="text-gray-900">{data.description}</p>
            )}
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Introduction Section</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intro Title</label>
              {editing ? (
                <input
                  type="text"
                  value={data.intro_title}
                  onChange={(e) => setData({ ...data, intro_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data.intro_title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intro Description</label>
              {editing ? (
                <textarea
                  value={data.intro_description}
                  onChange={(e) => setData({ ...data, intro_description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data.intro_description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
