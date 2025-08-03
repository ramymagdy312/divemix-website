"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
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

export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  // Convert between old format (images array) and new format (single image_url + images array)
  const getInitialImages = () => {
    if (initialData?.images && Array.isArray(initialData.images)) {
      return initialData.images;
    }
    if (initialData?.image_url) {
      return [initialData.image_url];
    }
    return [];
  };

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    short_description: initialData?.short_description || '',
    category_id: initialData?.category_id || '',
    price: initialData?.price || '',
    images: getInitialImages(),
    features: initialData?.features || [''],
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Check if Supabase is configured
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usingFallback) {
      return;
    }
    
    const cleanedImages = formData.images.filter((img: string) => img.trim() !== '');
    const cleanedFeatures = formData.features.filter((feature: string) => feature.trim() !== '');
    
    const cleanedData = {
      name: formData.name,
      description: formData.description,
      short_description: formData.short_description,
      category_id: formData.category_id,
      price: formData.price ? parseFloat(formData.price) : null,
      image_url: cleanedImages[0] || null, // Primary image
      images: cleanedImages, // All images array
      features: cleanedFeatures,
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    onSubmit(cleanedData);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures.length > 0 ? newFeatures : [''],
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
                  <>Database error: {error}. Cannot save products.</>
                ) : (
                  <>Cannot save products in demo mode. Database not configured.</>
                )}
                <Link href="/check-products-database" className="underline ml-2">
                  Set up database →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Brief product description"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          >
            <option value="">Select Category</option>
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

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description *
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed product description"
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (Up to 10 images)
          </label>
          <SimpleImageUploader
            images={formData.images}
            onImagesChange={(images) => setFormData({ ...formData, images })}
            maxImages={10}
          />
        </div>

        {/* Features */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Features
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
            {formData.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Feature ${index + 1}`}
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
            Product is active
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
            disabled={loading || usingFallback}
            className={`px-4 py-2 rounded-md transition-colors ${
              loading || usingFallback
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
          >
            {loading ? 'Saving...' : usingFallback ? 'Database Required' : 'Save Product'}
          </button>
        </div>
      </form>

      {/* Help Section */}
      {usingFallback && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🚀 To Save Real Products</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>You need to set up the database first:</strong></p>
            <ol className="space-y-1 ml-4">
              <li>1. Create product_categories table</li>
              <li>2. Create products table</li>
              <li>3. Add product categories</li>
              <li>4. Then you can save products</li>
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

// Simple Image Uploader Component (without file upload API)
interface SimpleImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages: number;
}

const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Basic URL validation
    try {
      new URL(newImageUrl);
      onImagesChange([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    } catch {
      toast.error('Please enter a valid image URL');
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Add Image URL */}
      <div className="flex space-x-2">
        <input
          type="url"
          placeholder="Enter image URL (https://...)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
        />
        <button
          type="button"
          onClick={addImageUrl}
          disabled={images.length >= maxImages}
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Image
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Add up to {maxImages} images. Use image URLs from Unsplash, your website, or any public image URL.
      </p>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden border">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Invalid+Image';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index === 0 ? 'Primary' : `Image ${index + 1}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sample Image URLs */}
      {images.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Image URLs:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>• https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800</div>
            <div>• https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800</div>
            <div>• https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800</div>
          </div>
        </div>
      )}
    </div>
  );
};