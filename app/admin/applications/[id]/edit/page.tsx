"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { Plus, X } from 'lucide-react';
import ImageUploader from '../../../../components/admin/ImageUploader';

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [''],
    features: [''],
  });

  useEffect(() => {
  fetchApplication();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [params.id]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching application:', error);
        alert('حدث خطأ أثناء جلب بيانات التطبيق');
        return;
      }
      
      setInitialData(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        images: data.images?.length > 0 ? data.images : [''],
        features: data.features?.length > 0 ? data.features : [''],
      });
    } catch (error) {
      console.error('Error fetching application:', error);
      alert('حدث خطأ أثناء جلب بيانات التطبيق');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanedData = {
        ...formData,
        images: formData.images.filter((img: string) => img.trim() !== ''),
        features: formData.features.filter((feature: string) => feature.trim() !== ''),
      };

      const { error } = await supabase
        .from('applications')
        .update(cleanedData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating application:', error);
        alert('Error updating application');
        return;
      }

      alert('Application updated successfully!');
      router.push('/admin/applications');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application');
    } finally {
      setLoading(false);
    }
  };



  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures,
    });
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
        <p className="text-gray-500">التطبيق غير موجود</p>
        <button
          onClick={() => router.push('/admin/applications')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          العودة للتطبيقات
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
        <p className="mt-2 text-gray-600">Edit application data</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Name
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <ImageUploader
            images={formData.images}
            onImagesChange={(images) => setFormData({ ...formData, images })}
            multiple={true}
            maxImages={10}
            label="Application Images"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Features
            </label>
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </button>
          </div>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Application Feature"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/applications')}
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