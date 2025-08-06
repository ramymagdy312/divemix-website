"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Save, X, Users } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '../../../components/admin/Breadcrumb';
import FolderExplorerSingle from '../../../components/admin/FolderExplorerSingle';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';

export default function NewVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    display_order: 1,
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Vendor name is required');
        return;
      }

      if (!formData.logo_url.trim()) {
        toast.error('Vendor logo is required');
        return;
      }

      const { error } = await supabase
        .from('vendors')
        .insert([{
          name: formData.name.trim(),
          logo_url: formData.logo_url,
          website_url: formData.website_url.trim() || null,
          description: formData.description.trim() || null,
          display_order: formData.display_order,
          is_active: formData.is_active
        }]);

      if (error) {
        console.error('Error creating vendor:', error);
        toast.error('Failed to create vendor');
        return;
      }

      toast.success('Vendor created successfully!');
      router.push('/admin/vendors');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { name: 'Vendors', href: '/admin/vendors' },
        { name: 'New Vendor' }
      ]} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/vendors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Vendors
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Vendor</h1>
          <p className="text-muted-foreground">
            Create a new vendor to display on your homepage
          </p>
        </div>
        <Badge variant="secondary">
          <Users className="h-3 w-3 mr-1" />
          New Vendor
        </Badge>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>
              Enter the basic information for the new vendor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Vendor Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Vendor Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter vendor name"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

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
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first in the slider
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="is_active">Active (visible on homepage)</Label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the vendor or partnership"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Logo</CardTitle>
            <CardDescription>
              Upload the vendor's logo image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FolderExplorerSingle
              image={formData.logo_url}
              onImageChange={(logo_url) => setFormData({ ...formData, logo_url })}
              label="Vendor Logo *"
            />
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Logo Guidelines:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Recommended size: 200x100 pixels or similar aspect ratio</li>
                <li>• Format: PNG with transparent background preferred</li>
                <li>• High quality logo for best display results</li>
                <li>• Logo will be displayed in grayscale by default, color on hover</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" asChild>
            <Link href="/admin/vendors">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>Creating...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Create Vendor
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}