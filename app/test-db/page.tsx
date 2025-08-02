"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TestDB() {
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Testing Supabase connection...');
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

      // Test categories
      const categoriesResult = await supabase
        .from('gallery_categories')
        .select('*')
        .order('display_order');

      console.log('Categories result:', categoriesResult);

      // Test images
      const imagesResult = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Images result:', imagesResult);

      if (categoriesResult.error) {
        throw new Error(`Categories error: ${categoriesResult.error.message}`);
      }

      if (imagesResult.error) {
        throw new Error(`Images error: ${imagesResult.error.message}`);
      }

      setCategories(categoriesResult.data || []);
      setImages(imagesResult.data || []);

    } catch (error: any) {
      console.error('Database test error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-4">Testing Database Connection...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Database Connection Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          <button 
            onClick={testConnection}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-2">Categories ({categories.length})</h2>
          <div className="bg-gray-100 p-4 rounded">
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories found</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id} className="border-b pb-1">
                    <strong>{cat.name}</strong> ({cat.slug})
                    {cat.is_active ? ' ✅' : ' ❌'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-2">Images ({images.length})</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {images.length === 0 ? (
              <p className="text-gray-500">No images found</p>
            ) : (
              <ul className="space-y-2">
                {images.map((img) => (
                  <li key={img.id} className="border-b pb-1">
                    <strong>{img.title}</strong>
                    <br />
                    <small className="text-gray-600">{img.url}</small>
                    <br />
                    <small className="text-blue-600">Category: {img.category}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl mb-2">Connection Info</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p><strong>Key (first 20 chars):</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  );
}