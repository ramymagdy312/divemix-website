"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/products/ProductCard';

export default function DebugProductData() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get products from diving-equipment category
        const { data: categoryData } = await supabase
          .from('product_categories')
          .select('id')
          .eq('slug', 'diving-equipment')
          .single();

        if (categoryData) {
          const { data: productsData, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id)
            .eq('is_active', true)
            .limit(3);

          console.log('Raw products data from database:', productsData);
          setProducts(productsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔍 Debug Product Data</h1>
      
      {products.map((product, index) => (
        <div key={product.id} className="mb-12 border-b pb-8">
          <h2 className="text-2xl font-semibold mb-4">Product {index + 1}: {product.name}</h2>
          
          {/* Raw Data Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-3">🗃️ Raw Database Data:</h3>
              <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <div className="space-y-2">
                  <div><strong>ID:</strong> {product.id}</div>
                  <div><strong>Name:</strong> {product.name}</div>
                  <div><strong>image_url:</strong> {product.image_url || 'NULL'}</div>
                  <div><strong>images (type):</strong> {typeof product.images}</div>
                  <div><strong>images (value):</strong> {JSON.stringify(product.images)}</div>
                  <div><strong>images (length):</strong> {product.images?.length || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">🔧 ProductCard Logic:</h3>
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                {(() => {
                  const productImages = product.images && product.images.length > 0 
                    ? product.images 
                    : product.image_url 
                    ? [product.image_url]
                    : ['fallback'];
                  
                  return (
                    <div className="space-y-2">
                      <div><strong>Condition 1:</strong> product.images && product.images.length &gt; 0 = {String(product.images && product.images.length > 0)}</div>
                      <div><strong>Condition 2:</strong> product.image_url exists = {String(!!product.image_url)}</div>
                      <div><strong>Final images array:</strong> {JSON.stringify(productImages)}</div>
                      <div><strong>Final count:</strong> {productImages.length}</div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
          
          {/* Product Card Display */}
          <div>
            <h3 className="text-lg font-medium mb-3">🎨 Rendered ProductCard:</h3>
            <div className="max-w-sm">
              <ProductCard product={product} />
            </div>
          </div>
          
          {/* Console Log */}
          <div className="mt-4">
            <button
              onClick={() => {
                console.log('=== PRODUCT DEBUG ===');
                console.log('Product:', product);
                console.log('product.images:', product.images);
                console.log('typeof product.images:', typeof product.images);
                console.log('Array.isArray(product.images):', Array.isArray(product.images));
                console.log('product.images?.length:', product.images?.length);
                console.log('===================');
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              🖥️ Log to Console
            </button>
          </div>
        </div>
      ))}
      
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔍 Debugging Steps:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check if <code>images</code> field is actually an array in the database</li>
          <li>Verify the data type when it reaches the React component</li>
          <li>Check if Supabase is parsing JSON correctly</li>
          <li>Test the ProductCard logic with the actual data</li>
        </ol>
      </div>
    </div>
  );
}