"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

import FolderExplorerSingle from '../../../../components/admin/FolderExplorerSingle';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import I18nTextField, { type I18nValue } from '@/app/components/admin/i18n/I18nTextField';
import { normalizeI18n, resolveI18n } from '@/app/lib/i18n/resolve';
import { defaultLocale } from '@/app/lib/i18n/config';
import { triggerRevalidate } from '@/app/lib/revalidate-client';

export default function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState<{
    title: I18nValue;
    url: string;
    category: string;
    category_id: string;
  }>({
    title: normalizeI18n(null),
    url: '',
    category: '',
    category_id: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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
        setData([]);
      } else {
        setData(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setData([]);
    }
  };

  const fetchImage = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching image:', error);
        toast.error('Error fetching image data');
        return;
      }
      
      setInitialData(data);
      setFormData({
        title: normalizeI18n(data.title),
        url: data.url || '',
        category: data.category || '',
        category_id: data.category_id || '',
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      toast.error('Error fetching image data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update(formData as any)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating image:', error);
        toast.error('Error updating image');
        return;
      }

      await triggerRevalidate(['gallery']);
      toast.success('Image updated successfully!');
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Error updating image');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-12">
        <Alert>
          <AlertDescription>Image not found</AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push('/admin/gallery')}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Image</h1>
        <p className="mt-2 text-gray-600">Edit image data</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <I18nTextField
          label="Image Title *"
          value={formData.title}
          onChange={(v) => setFormData({ ...formData, title: v })}
          placeholder="Enter image title"
          required
        />

        <div>
          <FolderExplorerSingle
            image={formData.url}
            onImageChange={(url) => setFormData({ ...formData, url })}
            label="Gallery Image"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.category_id}
            onChange={(e) => {
              const selectedCategory = (data || []).find((cat: any) => cat.id === e.target.value);
              setFormData({ 
                ...formData, 
                category_id: e.target.value,
                category: selectedCategory?.slug || ''
              });
            }}
          >
            <option value="">Select Category</option>
            {(data || []).map((category: any) => (
              <option key={category.id} value={category.id}>
                {resolveI18n(category.name, defaultLocale)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/gallery')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}