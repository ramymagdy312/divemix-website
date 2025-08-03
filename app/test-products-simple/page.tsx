"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

export default function TestProductsSimple() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('Raw data:', data);
      console.log('Error:', error);

      if (error) {
        setError(error.message);
        console.error('Supabase error:', error);
      } else {
        setCategories(data || []);
        console.log('Categories set:', data?.length || 0);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Catch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="font-bold">Error Loading Categories</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={fetchCategories}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-lg text-gray-600">Found {categories.length} categories</p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <div className="text-sm text-gray-500">
                  <div>Slug: {category.slug}</div>
                  <div>Order: {category.display_order}</div>
                  <div>ID: {category.id}</div>
                </div>
                
                <a
                  href={`/products/${category.slug}`}
                  className="mt-4 inline-block bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
                >
                  View Products
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded inline-block">
              <h3 className="font-bold">No Categories Found</h3>
              <p>The database appears to be empty or there are no active categories.</p>
            </div>
            <div className="mt-4">
              <a
                href="/setup-products-data"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Setup Sample Data
              </a>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={fetchCategories}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
          >
            Refresh
          </button>
          
          <a
            href="/products"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Official Products Page
          </a>
        </div>
      </div>
    </div>
  );
}