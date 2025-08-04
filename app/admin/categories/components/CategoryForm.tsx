"use client";

import { useState } from 'react';
import FolderExplorerSingle from '../../../components/admin/FolderExplorerSingle';

interface CategoryFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function CategoryForm({ initialData, onSubmit, loading }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    slug: initialData?.slug || '',
    image_url: initialData?.image_url || '',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const submitData = {
      ...formData,
      slug
    };
    
    onSubmit(submitData);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug (URL-friendly name)
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="Auto-generated from name if empty"
        />
        <p className="text-sm text-gray-500 mt-1">
          Leave empty to auto-generate from category name
        </p>
      </div>

      <div>
        <FolderExplorerSingle
          image={formData.image_url}
          onImageChange={(image_url) => setFormData({ ...formData, image_url })}
          label="Category Image"
          
        />
      </div>

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

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Category is active
        </label>
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
