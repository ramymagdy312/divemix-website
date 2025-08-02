"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CheckImages() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, image_url, images')
          .eq('is_active', true)
          .limit(10);

        if (error) throw error;
        setProducts(data || []);
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
      <h1 className="text-3xl font-bold mb-8">🖼️ Check Product Images</h1>
      
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-3">{product.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">image_url:</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {product.image_url || 'NULL'}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">images array:</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {product.images ? JSON.stringify(product.images) : 'NULL'}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Current display logic:</h4>
              <div className="bg-blue-50 p-3 rounded text-sm">
                {(() => {
                  const productImages = product.images && product.images.length > 0 
                    ? product.images 
                    : product.image_url 
                    ? [product.image_url]
                    : ['fallback-image'];
                  
                  return `Will show ${productImages.length} image(s): ${JSON.stringify(productImages)}`;
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">💡 Solution</h2>
        <p className="mb-4">
          To show multiple images for each product, we need to either:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Update the database to store multiple images in the <code>images</code> array field</li>
          <li>Or add more sample images to existing products</li>
        </ol>
      </div>
    </div>
  );
}