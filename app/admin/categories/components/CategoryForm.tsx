"use client";

import { useState, useEffect } from "react";
import FolderExplorerSingle from "../../../components/admin/FolderExplorerSingle";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { ProductCategory } from "../../../types/database";

interface CategoryFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  loading,
}: CategoryFormProps) {
  const [parentCategories, setParentCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    slug: initialData?.slug || "",
    image_url: initialData?.image_url || "",
    parent_id: initialData?.parent_id || null,
    features: initialData?.features || [],
    images: initialData?.images || [],
    is_active:
      initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });
  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name")
        .is("parent_id", null)
        .order("name");

      if (!error && data) {
        console.error("parent categories:", data);
        setParentCategories(data);
      }
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate slug from name if not provided
    const slug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const submitData = {
      ...formData,
      slug,
    };

    onSubmit(submitData);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter(
      (_: string, i: number) => i !== index
    );
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()],
      });
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    const newImage = formData.images.filter(
      (_: string, i: number) => i !== index
    );
    setFormData({
      ...formData,
      images: newImage,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Information</CardTitle>
        <CardDescription>
          Fill in the details for the product category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent-category">Parent Category</Label>
            <Select
              value={formData.parent_id || "no-parent"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  parent_id: value === "no-parent" ? null : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category (leave empty for main category)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-parent">
                  Main Category (No Parent)
                </SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose a parent category to create a subcategory, or leave empty
              for a main category
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter category description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL-friendly name)</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="Auto-generated from name if empty"
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to auto-generate from category name
            </p>
          </div>

          <div>
            <FolderExplorerSingle
              image={formData.image_url}
              onImageChange={(image_url) =>
                setFormData({ ...formData, image_url })
              }
              label="Category Image"
            />
          </div>

          {/* Features Section */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add image URL"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImage())
                }
              />
              <Button type="button" onClick={addImage} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((image: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {image.length > 30 ? image.substring(0, 30) + "..." : image}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

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

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="is_active">Category is active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
