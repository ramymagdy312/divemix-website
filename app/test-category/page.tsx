"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TestCategory() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testCategory = async (categoryId: string) => {
    setLoading(true);
    setResult(`Testing category: ${categoryId}\n`);

    try {
      // Step 1: Get category
      setResult(prev => prev + `Step 1: Looking for category with ID/slug: ${categoryId}\n`);
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('id, slug, name')
        .or(`id.eq.${categoryId},slug.eq.${categoryId}`)
        .single();

      if (categoryError) {
        setResult(prev => prev + `❌ Category error: ${categoryError.message}\n`);
        setLoading(false);
        return;
      }

      if (!categoryData) {
        setResult(prev => prev + `❌ Category not found\n`);
        setLoading(false);
        return;
      }

      setResult(prev => prev + `✅ Category found: ${categoryData.name} (ID: ${categoryData.id}, Slug: ${categoryData.slug})\n`);

      // Step 2: Get products
      setResult(prev => prev + `Step 2: Looking for products with category_id: ${categoryData.id}\n`);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (productsError) {
        setResult(prev => prev + `❌ Products error: ${productsError.message}\n`);
        setLoading(false);
        return;
      }

      setResult(prev => prev + `✅ Found ${productsData?.length || 0} products\n`);
      
      if (productsData && productsData.length > 0) {
        setResult(prev => prev + `Products:\n`);
        productsData.forEach((product, index) => {
          setResult(prev => prev + `  ${index + 1}. ${product.name}\n`);
        });
      }

      setResult(prev => prev + `\n🎉 Test completed successfully!\n`);

    } catch (error: any) {
      setResult(prev => prev + `❌ Fatal error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🧪 Test Category Pages</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={() => testCategory('diving-equipment')}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mr-4"
        >
          Test diving-equipment
        </button>
        
        <button
          onClick={() => testCategory('safety-gear')}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mr-4"
        >
          Test safety-gear
        </button>
        
        <button
          onClick={() => testCategory('underwater-cameras')}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 mr-4"
        >
          Test underwater-cameras
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔗 Test Category Pages</h2>
        <div className="space-y-2">
          <a href="/products/diving-equipment" className="block text-blue-600 hover:underline">
            → /products/diving-equipment
          </a>
          <a href="/products/safety-gear" className="block text-blue-600 hover:underline">
            → /products/safety-gear
          </a>
          <a href="/products/underwater-cameras" className="block text-blue-600 hover:underline">
            → /products/underwater-cameras
          </a>
          <a href="/products/accessories" className="block text-blue-600 hover:underline">
            → /products/accessories
          </a>
          <a href="/products/wetsuits-gear" className="block text-blue-600 hover:underline">
            → /products/wetsuits-gear
          </a>
          <a href="/products/maintenance-tools" className="block text-blue-600 hover:underline">
            → /products/maintenance-tools
          </a>
        </div>
      </div>
    </div>
  );
}