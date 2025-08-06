"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { AlertCircle, ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import FolderExplorer from '../../../components/admin/FolderExplorer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Fallback categories
const fallbackCategories: Category[] = [
  { id: '1', name: 'Diving Equipment', slug: 'diving-equipment' },
  { id: '2', name: 'Safety Gear', slug: 'safety-gear' },
  { id: '3', name: 'Underwater Cameras', slug: 'underwater-cameras' },
  { id: '4', name: 'Accessories', slug: 'accessories' },
  { id: '5', name: 'Wetsuits & Gear', slug: 'wetsuits-gear' },
  { id: '6', name: 'Maintenance Tools', slug: 'maintenance-tools' }
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category_id: '',
    image_url: '',
    images: [] as string[],
    features: [''],
    is_active: true,
    display_order: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Check if Supabase is configured
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        setError(`Database error: ${error.message}`);
        setCategories(fallbackCategories);
        setUsingFallback(true);
      } else {
        setCategories(data || []);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Connection error: ${error.message}`);
      setCategories(fallbackCategories);
      setUsingFallback(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usingFallback) {
      return;
    }

    setLoading(true);
    
    try {
      const cleanedData = {
        ...formData,
        features: formData.features.filter(feature => feature.trim() !== ''),
        image_url: formData.images.length > 0 ? formData.images[0] : formData.image_url,
        images: formData.images.length > 0 ? formData.images : (formData.image_url ? [formData.image_url] : []),
      };

      const { error } = await supabase
        .from('products')
        .insert([cleanedData]);

      if (error) throw error;

      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(`Error creating product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures.length > 0 ? newFeatures : ['']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  return (
    <div className="space-y-6">
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error ? 'Database Connection Issue' : 'Demo Mode Active'}
          </AlertTitle>
          <AlertDescription>
            {error ? (
              <>Database error: {error}. Cannot add products.</>
            ) : (
              <>Cannot add products in demo mode. Database not configured.</>
            )}
            <Link href="/check-products-database" className="underline ml-2">
              Set up database →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Products
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            {usingFallback ? 'Demo mode - Set up database to add real products' : 'Add a new product to the database'}
          </p>
        </div>
        <Badge variant={usingFallback ? "destructive" : "secondary"}>
          {usingFallback ? "Demo Mode" : "Live"}
        </Badge>
      </div>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Enter the basic information for the new product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {usingFallback && (
                  <p className="text-sm text-muted-foreground">
                    Using sample categories. Set up database for real categories.
                  </p>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief product description"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed product description"
              />
            </div>
            <Separator />

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <FolderExplorer
                images={formData.images.length > 0 ? formData.images : (formData.image_url ? [formData.image_url] : [])}
                onImagesChange={(images) => setFormData({ 
                  ...formData, 
                  images: images,
                  image_url: images.length > 0 ? images[0] : ''
                })}
                label="Product Images"
                maxImages={10}
              />
              <p className="text-sm text-muted-foreground">
                Upload multiple images for this product. The first image will be used as the main image.
              </p>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Product Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="is_active">Product is active</Label>
              </div>
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" asChild>
                <Link href="/admin/products">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={loading || usingFallback}
              >
                {loading ? (
                  <>Creating...</>
                ) : usingFallback ? (
                  <>Database Required</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      {usingFallback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 To Add Real Products
            </CardTitle>
            <CardDescription>
              Set up the database to start adding real products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium mb-2">You need to set up the database first:</p>
              <ol className="space-y-1 ml-4 text-sm text-muted-foreground">
                <li>1. Create product_categories table</li>
                <li>2. Create products table</li>
                <li>3. Add product categories</li>
                <li>4. Then you can add products</li>
              </ol>
            </div>
            <Button asChild>
              <Link href="/check-products-database">
                Set Up Database Now →
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
