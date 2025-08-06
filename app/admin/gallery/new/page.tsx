"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Save, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import FolderExplorerSingle from '../../../components/admin/FolderExplorerSingle';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';

export default function NewGalleryImagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
    category_id: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .eq('is_active', true)
        .neq('slug', 'all')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('gallery_images')
        .insert([formData]);

      if (error) throw error;

      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error creating image:', error);
      toast.error('Error adding image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/gallery">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Gallery
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Image</h1>
          <p className="text-muted-foreground">
            Add a new image to the gallery
          </p>
        </div>
        <Badge variant="secondary">
          <ImageIcon className="h-3 w-3 mr-1" />
          New Image
        </Badge>
      </div>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Image Information</CardTitle>
          <CardDescription>
            Upload and categorize a new gallery image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Image Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter image title"
              />
            </div>

            <Separator />

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gallery Image</Label>
              <FolderExplorerSingle
                image={formData.url}
                onImageChange={(url) => setFormData({ ...formData, url })}
                label="Gallery Image"
              />
            </div>

            <Separator />

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => {
                  const selectedCategory = categories.find((cat: any) => cat.id === value);
                  setFormData({ 
                    ...formData, 
                    category_id: value,
                    category: selectedCategory?.slug || ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" asChild>
                <Link href="/admin/gallery">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save Image
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
