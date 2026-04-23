"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import FolderExplorer from "../../../components/admin/FolderExplorer";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import I18nTextField, { type I18nValue } from "../../../components/admin/i18n/I18nTextField";
import I18nTextarea from "../../../components/admin/i18n/I18nTextarea";
import I18nListField from "../../../components/admin/i18n/I18nListField";
import { normalizeI18n, resolveI18n, seedI18n } from "../../../lib/i18n/resolve";
import { defaultLocale } from "../../../lib/i18n/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

interface Subcategory {
  id: string;
  name: any;
  slug: string;
}

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

// Fallback subcategories
const fallbackSubcategories: Subcategory[] = [
  {
    id: "1",
    name: "Diving Equipment - Products",
    slug: "diving-equipment-products",
  },
  { id: "2", name: "Safety Gear - Products", slug: "safety-gear-products" },
  {
    id: "3",
    name: "Underwater Cameras - Products",
    slug: "underwater-cameras-products",
  },
  { id: "4", name: "Accessories - Products", slug: "accessories-products" },
  {
    id: "5",
    name: "Wetsuits & Gear - Products",
    slug: "wetsuits-gear-products",
  },
  {
    id: "6",
    name: "Maintenance Tools - Products",
    slug: "maintenance-tools-products",
  },
];

export default function ProductForm({
  initialData,
  onSubmit,
  loading,
}: ProductFormProps) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>("");

  // Convert between old format (images array) and new format (single image_url + images array)
  const getInitialImages = () => {
    if (initialData?.images && Array.isArray(initialData.images)) {
      return initialData.images;
    }
    if (initialData?.image_url) {
      return [initialData.image_url];
    }
    return [];
  };

  const [formData, setFormData] = useState<{
    name: I18nValue;
    description: I18nValue;
    short_description: I18nValue;
    subcategory_id: string;
    images: string[];
    features: I18nValue[];
    is_active: boolean;
    display_order: number;
  }>({
    name: normalizeI18n(initialData?.name),
    description: normalizeI18n(initialData?.description),
    short_description: normalizeI18n(initialData?.short_description),
    subcategory_id: initialData?.subcategory_id || "",
    images: getInitialImages(),
    features: Array.isArray(initialData?.features) && initialData.features.length > 0
      ? initialData.features.map((f: any) => normalizeI18n(f))
      : [seedI18n("")],
    is_active:
      initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name, slug")
        .not("parent_id", "is", null)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching subcategories:", error);
        setError(`Database error: ${error.message}`);
        setSubcategories(fallbackSubcategories);
        setUsingFallback(true);
      } else {
        setSubcategories(data || []);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setError(`Connection error: ${error.message}`);
      setSubcategories(fallbackSubcategories);
      setUsingFallback(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (usingFallback) {
      return;
    }

    const cleanedImages = formData.images.filter(
      (img: string) => img.trim() !== ""
    );
    const cleanedFeatures = formData.features.filter(
      (feature: I18nValue) => (feature.en || "").trim() !== ""
    );

    const cleanedData = {
      name: formData.name,
      description: formData.description,
      short_description: formData.short_description,
      subcategory_id: formData.subcategory_id,
      image_url: cleanedImages[0] || null,
      images: cleanedImages,
      features: cleanedFeatures,
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    onSubmit(cleanedData);
  };

  return (
    <div>
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? (
              <>Database error: {error}. Cannot save products.</>
            ) : (
              <>Cannot save products in demo mode. Database not configured.</>
            )}
            <Link href="/check-products-database" className="underline ml-2">
              Set up database →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter the product details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <I18nTextField
              label="Product Name *"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="Enter product name"
              required
            />

            <I18nTextField
              label="Short Description"
              value={formData.short_description}
              onChange={(v) => setFormData({ ...formData, short_description: v })}
              placeholder="Brief product description"
            />

            {/* Subcategory */}
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory *</Label>
              <Select
                value={formData.subcategory_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, subcategory_id: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {resolveI18n(subcategory.name, defaultLocale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {usingFallback && (
                <p className="text-sm text-muted-foreground">
                  Using sample subcategories. Set up database for real
                  subcategories.
                </p>
              )}
            </div>

            <I18nTextarea
              label="Full Description *"
              value={formData.description}
              onChange={(v) => setFormData({ ...formData, description: v })}
              placeholder="Detailed product description"
              rows={4}
              required
            />

            {/* Images Section */}
            <div className="space-y-4">
              <Label>Product Images</Label>
              <FolderExplorer
                images={formData.images}
                onImagesChange={(images: string[]) => {
                  setFormData({
                    ...formData,
                    images: images,
                  });
                }}
                multiple={true}
              />
            </div>

            <I18nListField
              label="Product Features"
              values={formData.features}
              onChange={(features) => setFormData({ ...formData, features })}
              placeholder="Feature"
            />

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={loading || usingFallback}>
                {loading
                  ? "Saving..."
                  : initialData
                  ? "Update Product"
                  : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
