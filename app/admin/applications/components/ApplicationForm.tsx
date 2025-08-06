"use client";

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import FolderExplorerSingle from '../../../components/admin/FolderExplorerSingle';

interface ApplicationFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function ApplicationForm({ initialData, onSubmit, loading }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    image_url: initialData?.image_url || '',
    use_cases: initialData?.use_cases || [''],
    benefits: initialData?.benefits || [''],
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      use_cases: formData.use_cases.filter((useCase: string) => useCase.trim() !== ''),
      benefits: formData.benefits.filter((benefit: string) => benefit.trim() !== ''),
    };
    
    onSubmit(cleanedData);
  };

  const addUseCase = () => {
    setFormData({
      ...formData,
      use_cases: [...formData.use_cases, ''],
    });
  };

  const removeUseCase = (index: number) => {
    const newUseCases = formData.use_cases.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      use_cases: newUseCases.length > 0 ? newUseCases : [''],
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
    const newBenefits = formData.benefits.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      benefits: newBenefits.length > 0 ? newBenefits : [''],
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      {/* Application Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Name *
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter application name"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed application description"
        />
      </div>

      {/* Application Image */}
      <div>
        <FolderExplorerSingle
          image={formData.image_url}
          onImageChange={(image_url) => setFormData({ ...formData, image_url })}
          label="Application Image"
        />
      </div>

      {/* Use Cases */}
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
          {formData.use_cases.map((useCase: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Use case ${index + 1}`}
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

      {/* Benefits */}
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
          {formData.benefits.map((benefit: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Benefit ${index + 1}`}
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

      {/* Display Order */}
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

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Application is active
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md transition-colors ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-cyan-600 text-white hover:bg-cyan-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save Application'}
        </button>
      </div>
    </form>
  );
}