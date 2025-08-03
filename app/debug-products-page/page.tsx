"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DebugProductsPage() {
  const [productsPageData, setProductsPageData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    debugAll();
  }, []);

  const debugAll = async () => {
    const errorList: string[] = [];
    
    try {
      // Test 1: Products page data
      console.log('Testing products_page table...');
      const { data: pageData, error: pageError } = await supabase
        .from('products_page')
        .select('*')
        .single();

      if (pageError) {
        errorList.push(`Products page error: ${pageError.message}`);
        console.error('Products page error:', pageError);
      } else {
        setProductsPageData(pageData);
        console.log('Products page data:', pageData);
      }

      // Test 2: Product categories
      console.log('Testing product_categories table...');
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (categoriesError) {
        errorList.push(`Categories error: ${categoriesError.message}`);
        console.error('Categories error:', categoriesError);
      } else {
        setCategories(categoriesData || []);
        console.log('Categories data:', categoriesData);
      }

      // Test 3: Supabase connection
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('product_categories')
        .select('count')
        .limit(1);

      if (testError) {
        errorList.push(`Connection error: ${testError.message}`);
        console.error('Connection error:', testError);
      }

    } catch (error: any) {
      errorList.push(`General error: ${error.message}`);
      console.error('General error:', error);
    }

    setErrors(errorList);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debugging Products Page</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Products Page</h1>
      
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Errors Found:</h3>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Products Page Data */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Products Page Data</h2>
          {productsPageData ? (
            <div className="space-y-2">
              <div><strong>Title:</strong> {productsPageData.title}</div>
              <div><strong>Description:</strong> {productsPageData.description}</div>
              <div><strong>Hero Image:</strong> {productsPageData.hero_image}</div>
              <div><strong>Intro Title:</strong> {productsPageData.intro_title}</div>
              <div><strong>Active:</strong> {productsPageData.is_active ? 'Yes' : 'No'}</div>
            </div>
          ) : (
            <div className="text-red-500">No products page data found</div>
          )}
        </div>

        {/* Categories Data */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Categories Data</h2>
          <div><strong>Total Categories:</strong> {categories.length}</div>
          {categories.length > 0 ? (
            <div className="mt-2 space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="border-l-2 border-blue-500 pl-2">
                  <div><strong>{category.name}</strong></div>
                  <div className="text-sm text-gray-600">Slug: {category.slug}</div>
                  <div className="text-sm text-gray-600">Order: {category.display_order}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-red-500">No categories found</div>
          )}
        </div>
      </div>

      <div className="mt-8 space-x-4">
        <button
          onClick={debugAll}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Debug
        </button>
        
        <a 
          href="/products" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
        >
          Go to Products Page
        </a>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Check the browser console (F12) for detailed logs.</p>
      </div>
    </div>
  );
}