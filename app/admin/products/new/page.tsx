"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '../../../components/admin/ImageUploader';

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Fallback categories
const fallbackCategories: Category[] = [
  { id: '1', name: 'Diving Equipment', slug: 'diving-equipment' },
  { id: '2', name: 'Safety Gear', slug: 'safety-gear' },
  { id: '3', name: 'Underwater Cameras', slug: 'underwater-cameras' },
  { id: '4', name: 'Accessories', slug: 'accessories' },
  { id: '5', name: 'Wetsuits & Gear', slug: 'wetsuits-gear' },
  { id: '6', name: 'Maintenance Tools', slug: 'maintenance-tools' }
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category_id: '',
    image_url: '',
    images: [] as string[],
    features: [''],
    is_active: true,
    display_order: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        console.warn('Supabase not configured. Using fallback categories.');
        setCategories(fallbackCategories);
        setUsingFallback(true);
        return;
      }

      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        setError(`Database error: ${error.message}`);
        setCategories(fallbackCategories);
        setUsingFallback(true);
      } else {
        setCategories(data || []);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Connection error: ${error.message}`);
      setCategories(fallbackCategories);
      setUsingFallback(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usingFallback) {
      alert('Cannot add products in demo mode. Set up database to enable full functionality.');
      return;
    }

    setLoading(true);
    
    try {
      const cleanedData = {
        ...formData,
        features: formData.features.filter(feature => feature.trim() !== ''),
        image_url: formData.images.length > 0 ? formData.images[0] : formData.image_url,
        images: formData.images.length > 0 ? formData.images : (formData.image_url ? [formData.image_url] : []),
      };

      const { error } = await supabase
        .from('products')
        .insert([cleanedData]);

      if (error) throw error;

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures.length > 0 ? newFeatures : ['']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  return (
    <div>
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {error ? 'Database Connection Issue' : 'Demo Mode Active'}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {error ? (
                  <>Database error: {error}. Cannot add products.</>
                ) : (
                  <>Cannot add products in demo mode. Database not configured.</>
                )}
                <Link href="/check-products-database" className="underline ml-2">
                  Set up database →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-gray-600">
          {usingFallback ? 'Demo mode - Set up database to add real products' : 'Add a new product to the database'}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              id="short_description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief product description"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Full Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product description"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category_id"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {usingFallback && (
              <p className="text-sm text-yellow-600 mt-1">
                Using sample categories. Set up database for real categories.
              </p>
            )}
          </div>
          {/* Image Upload */}
          <div>
            <ImageUploader
              images={formData.images.length > 0 ? formData.images : (formData.image_url ? [formData.image_url] : [])}
              onImagesChange={(images) => setFormData({ 
                ...formData, 
                images: images,
                image_url: images.length > 0 ? images[0] : ''
              })}
              multiple={true}
              maxImages={10}
              label="Product Images"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload multiple images for this product. The first image will be used as the main image.
            </p>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Features
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-cyan-600 hover:text-cyan-800"
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              id="display_order"
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
              Product is active
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              href="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || usingFallback}
              className={`px-4 py-2 rounded-md transition-colors ${
                loading || usingFallback
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700'
              }`}
            >
              {loading ? 'Creating...' : usingFallback ? 'Database Required' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      {usingFallback && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🚀 To Add Real Products</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>You need to set up the database first:</strong></p>
            <ol className="space-y-1 ml-4">
              <li>1. Create product_categories table</li>
              <li>2. Create products table</li>
              <li>3. Add product categories</li>
              <li>4. Then you can add products</li>
            </ol>
            <div className="mt-4">
              <Link
                href="/check-products-database"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Set Up Database Now →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}