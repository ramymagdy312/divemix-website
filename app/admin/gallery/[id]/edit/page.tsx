"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { galleryCategoriesData, GalleryCategory } from '../../../../data/galleryCategoriesData';
import SingleImageUploader from '../../../../components/admin/SingleImageUploader';

export default function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState<GalleryCategory[]>(galleryCategoriesData);
  const [formData, setFormData] = useState({
    title: '',
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
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        // Use mock data for development
        console.warn('Supabase not configured. Using mock data.');
        setCategories(galleryCategoriesData.filter(cat => cat.is_active && cat.slug !== 'all'));
        return;
      }

      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .eq('is_active', true)
        .neq('slug', 'all')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setCategories(galleryCategoriesData.filter(cat => cat.is_active && cat.slug !== 'all'));
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCategories(galleryCategoriesData.filter(cat => cat.is_active && cat.slug !== 'all'));
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
        alert('Error fetching image data');
        return;
      }
      
      setInitialData(data);
      setFormData({
        title: data.title || '',
        url: data.url || '',
        category: data.category || '',
        category_id: data.category_id || '',
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('Error fetching image data');
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
        .update(formData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating image:', error);
        alert('Error updating image');
        return;
      }

      alert('Image updated successfully!');
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
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
        <p className="text-gray-500">Image not found</p>
        <button
          onClick={() => router.push('/admin/gallery')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          Back to Gallery
        </button>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Title
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <SingleImageUploader
            image={formData.url}
            onImageChange={(url) => setFormData({ ...formData, url })}
            label="Gallery Image"
            required
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
              const selectedCategory = categories.find(cat => cat.id === e.target.value);
              setFormData({ 
                ...formData, 
                category_id: e.target.value,
                category: selectedCategory?.slug || ''
              });
            }}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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