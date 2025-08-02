"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UpdateImages() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  // Sample diving equipment images from Unsplash
  const divingImages = {
    masks: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800'
    ],
    fins: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800'
    ],
    cameras: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800'
    ],
    safety: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800'
    ],
    wetsuits: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800'
    ],
    general: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800'
    ]
  };

  const updateProductImages = async () => {
    setLoading(true);
    setResult('🔄 Starting update...\n');

    try {
      // Get all products
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, image_url')
        .eq('is_active', true);

      if (error) throw error;

      setResult(prev => prev + `Found ${products.length} products to update\n\n`);

      for (const product of products) {
        let imagesToUse = divingImages.general;
        
        // Choose specific images based on product name
        const productName = product.name.toLowerCase();
        if (productName.includes('mask')) {
          imagesToUse = divingImages.masks;
        } else if (productName.includes('fin')) {
          imagesToUse = divingImages.fins;
        } else if (productName.includes('camera')) {
          imagesToUse = divingImages.cameras;
        } else if (productName.includes('whistle') || productName.includes('light') || productName.includes('safety')) {
          imagesToUse = divingImages.safety;
        } else if (productName.includes('wetsuit') || productName.includes('glove') || productName.includes('boot') || productName.includes('hood')) {
          imagesToUse = divingImages.wetsuits;
        }

        // Update the product with multiple images
        const { error: updateError } = await supabase
          .from('products')
          .update({
            images: imagesToUse,
            image_url: imagesToUse[0] // Keep the first image as primary
          })
          .eq('id', product.id);

        if (updateError) {
          setResult(prev => prev + `❌ Error updating ${product.name}: ${updateError.message}\n`);
        } else {
          setResult(prev => prev + `✅ Updated ${product.name} with ${imagesToUse.length} images\n`);
        }
      }

      setResult(prev => prev + '\n🎉 All products updated successfully!\n');

    } catch (error: any) {
      setResult(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🖼️ Update Product Images</h1>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">What this will do:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Add multiple images to each product (3-4 images per product)</li>
          <li>Choose appropriate images based on product type (masks, fins, cameras, etc.)</li>
          <li>Enable the image carousel functionality in ProductCard</li>
          <li>Keep the first image as the primary image_url</li>
        </ul>
      </div>

      <button
        onClick={updateProductImages}
        disabled={loading}
        className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
      >
        {loading ? 'Updating...' : 'Update Product Images'}
      </button>

      {result && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔗 Test After Update</h2>
        <div className="space-y-2">
          <a href="/products/diving-equipment" className="block text-blue-600 hover:underline">
            → Test diving equipment products
          </a>
          <a href="/products/safety-gear" className="block text-blue-600 hover:underline">
            → Test safety gear products
          </a>
          <a href="/check-images" className="block text-blue-600 hover:underline">
            → Check updated images data
          </a>
        </div>
      </div>
    </div>
  );
}