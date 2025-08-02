"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { Plus, X } from 'lucide-react';
import ImageUploader from '../../../../components/admin/ImageUploader';
import toast from 'react-hot-toast';

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    use_cases: [''],
    benefits: [''],
    is_active: true,
    display_order: 1,
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
        toast.error('Error fetching application data');
        return;
      }
      
      setInitialData(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        image_url: data.image_url || '',
        use_cases: data.use_cases?.length > 0 ? data.use_cases : [''],
        benefits: data.benefits?.length > 0 ? data.benefits : [''],
        is_active: data.is_active ?? true,
        display_order: data.display_order || 1,
      });
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Error fetching application data');
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
        use_cases: formData.use_cases.filter((useCase: string) => useCase.trim() !== ''),
        benefits: formData.benefits.filter((benefit: string) => benefit.trim() !== ''),
      };

      const { error } = await supabase
        .from('applications')
        .update(cleanedData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating application:', error);
        toast.error('Error updating application');
        return;
      }

      toast.success('Application updated successfully!');
      router.push('/admin/applications');
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Error updating application');
    } finally {
      setLoading(false);
    }
  };



  const addUseCase = () => {
    setFormData({
      ...formData,
      use_cases: [...formData.use_cases, ''],
    });
  };

  const removeUseCase = (index: number) => {
    setFormData({
      ...formData,
      use_cases: formData.use_cases.filter((_, i) => i !== index),
    });
  };

  const updateUseCase = (index: number, value: string) => {
    const newUseCases = [...formData.use_cases];
    newUseCases[index] = value;
    setFormData({
      ...formData,
      use_cases: newUseCases,
    });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ''],
    });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({
      ...formData,
      benefits: newBenefits,
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
        <p className="text-gray-500">Application not found</p>
        <button
          onClick={() => router.push('/admin/applications')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          Back to Applications
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
            images={formData.image_url ? [formData.image_url] : []}
            onImagesChange={(images) => setFormData({ ...formData, image_url: images[0] || '' })}
            multiple={false}
            maxImages={1}
            label="Application Image"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Use Cases
            </label>
            <button
              type="button"
              onClick={addUseCase}
              className="inline-flex items-center px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Use Case
            </button>
          </div>
          <div className="space-y-2">
            {formData.use_cases.map((useCase, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Use case description"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  value={useCase}
                  onChange={(e) => updateUseCase(index, e.target.value)}
                />
                {formData.use_cases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUseCase(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Benefits
            </label>
            <button
              type="button"
              onClick={addBenefit}
              className="inline-flex items-center px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Benefit
            </button>
          </div>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Benefit description"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.is_active ? 'active' : 'inactive'}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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