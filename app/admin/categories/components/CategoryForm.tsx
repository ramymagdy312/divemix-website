"use client";

import { useState } from 'react';
import SingleImageUploader from '../../../components/admin/SingleImageUploader';

interface CategoryFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function CategoryForm({ initialData, onSubmit, loading }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    hero_image: initialData?.hero_image || '',
    image: initialData?.image || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name
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
        <SingleImageUploader
          image={formData.hero_image}
          onImageChange={(hero_image) => setFormData({ ...formData, hero_image })}
          label="Hero Image"
          required
        />
      </div>

      <div>
        <SingleImageUploader
          image={formData.image}
          onImageChange={(image) => setFormData({ ...formData, image })}
          label="Category Image"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
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
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}