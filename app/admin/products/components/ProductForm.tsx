"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category_id: initialData?.category_id || '',
    images: initialData?.images || [''],
    features: initialData?.features || [''],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      images: formData.images.filter((img: string) => img.trim() !== ''),
      features: formData.features.filter((feature: string) => feature.trim() !== ''),
    };

    onSubmit(cleanedData);
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_: string, i: number) => i !== index),
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages,
    });
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
      features: formData.images.filter((_: string, i: number) => i !== index),

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اسم المنتج
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
          الفئة
        </label>
        <select
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
        >
          <option value="">اختر الفئة</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف
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
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            الصور
          </label>
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            إضافة صورة
          </button>
        </div>
        <div className="space-y-2">
          {formData.images.map((image: string, index: number) => (

            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="رابط الصورة"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
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
            المميزات
          </label>
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            إضافة ميزة
          </button>
        </div>
        <div className="space-y-2">
          {formData.features.map((feature: string, index: number) => (

            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="ميزة المنتج"
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
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>
    </form>
  );
}