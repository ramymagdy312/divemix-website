"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '../../../../components/admin/Breadcrumb';
import FolderExplorerSingle from '../../../../components/admin/FolderExplorerSingle';
import toast from 'react-hot-toast';

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
        <Link
          href="/admin/vendors"
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
          <p className="mt-2 text-gray-600">Update vendor information and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Vendor Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter vendor name"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Lower numbers appear first in the slider
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active (visible on homepage)
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Brief description of the vendor or partnership"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Vendor Logo</h2>
          
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
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/vendors"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Updating...' : 'Update Vendor'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}