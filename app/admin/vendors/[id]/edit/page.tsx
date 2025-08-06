"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { ArrowLeft, Save, Users } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '../../../../components/admin/Breadcrumb';
import FolderExplorerSingle from '../../../../components/admin/FolderExplorerSingle';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    display_order: 1,
    is_active: true
  });
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);


  const fetchVendor = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) {
        console.error('Error fetching vendor:', error);
        toast.error('Failed to load vendor');
        router.push('/admin/vendors');
        return;
      }

      setVendor(data);
      setFormData({
        name: data.name,
        logo_url: data.logo_url,
        website_url: data.website_url || '',
        description: data.description || '',
        display_order: data.display_order,
        is_active: data.is_active
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load vendor');
      router.push('/admin/vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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
        .update({
          name: formData.name.trim(),
          logo_url: formData.logo_url,
          website_url: formData.website_url.trim() || null,
          description: formData.description.trim() || null,
          display_order: formData.display_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', vendorId);

      if (error) {
        console.error('Error updating vendor:', error);
        toast.error('Failed to update vendor');
        return;
      }

      toast.success('Vendor updated successfully!');
      router.push('/admin/vendors');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update vendor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor not found</h3>
        <Link
          href="/admin/vendors"
          className="text-cyan-600 hover:text-cyan-700"
        >
          Back to Vendors
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[
        { name: 'Vendors', href: '/admin/vendors' },
        { name: vendor.name }
      ]} />
      
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/vendors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary" />
            Edit Vendor
          </h1>
          <p className="text-muted-foreground">Update vendor information and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>
              Update the basic information for this vendor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div className="space-y-2">
                <Label htmlFor="vendor-name">
                  Vendor Name *
                </Label>
                <Input
                  id="vendor-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter vendor name"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="website-url">
                  Website URL
                </Label>
                <Input
                  id="website-url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display-order">
                  Display Order
                </Label>
                <Input
                  id="display-order"
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
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">
                    Active (visible on homepage)
                  </Label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <Label htmlFor="description">
                Description
              </Label>
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
              Upload or update the vendor's logo image
            </CardDescription>
          </CardHeader>
          <CardContent>
          
          <FolderExplorerSingle
            image={formData.logo_url}
            onImageChange={(logo_url) => setFormData({ ...formData, logo_url })}
            label="Vendor Logo *"
          />
          
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Logo Guidelines:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Recommended size: 200x100 pixels or similar aspect ratio</li>
                <li>• Format: PNG with transparent background preferred</li>
                <li>• High quality logo for best display results</li>
                <li>• Logo will be displayed in grayscale by default, color on hover</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/vendors">
              Cancel
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Updating...' : 'Update Vendor'}
          </Button>
        </div>
      </form>
    </div>
  );
}