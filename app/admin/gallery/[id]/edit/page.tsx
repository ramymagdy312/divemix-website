"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import SingleImageUploader from '../../../../components/admin/SingleImageUploader';

export default function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
  });

  useEffect(() => {
    fetchImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="installations">Installations</option>
            <option value="maintenance">Maintenance</option>
            <option value="testing">Testing</option>
            <option value="facilities">Facilities</option>
            <option value="training">Training</option>
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