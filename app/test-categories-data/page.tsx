"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TestCategoriesData() {
  const [categories, setCategories] = useState<any[]>([]);
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
        .order('display_order', { ascending: true });

      console.log('Categories data:', data);
      console.log('Categories error:', error);

      if (error) {
        setError(error.message);
        setCategories([]);
      } else {
        setCategories(data || []);
        setError(null);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Categories Data</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testing Categories Data</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-4">
        <strong>Total Categories Found:</strong> {categories.length}
      </div>

      {categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="border p-4 rounded">
              <h3 className="font-bold">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
              <div className="text-sm text-gray-500 mt-2">
                <div>ID: {category.id}</div>
                <div>Slug: {category.slug}</div>
                <div>Active: {category.is_active ? 'Yes' : 'No'}</div>
                <div>Display Order: {category.display_order}</div>
                <div>Image URL: {category.image_url}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No categories found in the database.
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={fetchCategories}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}