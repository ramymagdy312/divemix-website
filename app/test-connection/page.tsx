"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testing...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...');
        
        // Test 1: Basic connection
        const { data: testData, error: testError } = await supabase
          .from('product_categories')
          .select('count')
          .limit(1);

        if (testError) {
          setStatus(`❌ Connection failed: ${testError.message}`);
          setDetails(testError);
          return;
        }

        setStatus('✅ Connection successful! Testing data...');

        // Test 2: Get categories
        const { data: categories, error: catError } = await supabase
          .from('product_categories')
          .select('*')
          .order('display_order');

        // Test 3: Get products
        const { data: products, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('display_order');

        setDetails({
          categories: {
            count: categories?.length || 0,
            data: categories,
            error: catError
          },
          products: {
            count: products?.length || 0,
            data: products,
            error: prodError
          }
        });

        if (categories && categories.length > 0) {
          if (products && products.length > 0) {
            setStatus('✅ All good! Categories and products found.');
          } else {
            setStatus('⚠️ Categories found but no products. Run setup-products.');
          }
        } else {
          setStatus('❌ No categories found. Check database setup.');
        }

      } catch (error: any) {
        setStatus(`❌ Error: ${error.message}`);
        setDetails(error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔍 Test Database Connection</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Status:</h2>
        <p className="text-lg">{status}</p>
      </div>

      {details && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Details:</h2>
          <pre className="whitespace-pre-wrap text-sm overflow-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Next Steps:</h3>
          <ul className="list-disc list-inside text-blue-700 mt-2">
            <li>If connection failed: Check .env.local file</li>
            <li>If no categories: Run database setup first</li>
            <li>If no products: Go to <a href="/setup-products" className="underline">/setup-products</a></li>
            <li>If all good: Test <a href="/products/diving-equipment" className="underline">/products/diving-equipment</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}