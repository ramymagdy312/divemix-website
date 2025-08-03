"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetupProductsData() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const setupData = async () => {
    setLoading(true);
    setStatus('Setting up products data...\n');

    try {
      // 1. Setup products_page data
      setStatus(prev => prev + '1. Setting up products page data...\n');
      
      const { error: pageError } = await supabase
        .from('products_page')
        .upsert({
          title: 'Our Products',
          description: 'Discover our comprehensive range of high-quality gas mixing and compression solutions',
          hero_image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=2000',
          intro_title: 'Premium Gas Solutions',
          intro_description: 'From high-pressure compressors to advanced gas mixing systems, our products are engineered to meet the most demanding industrial requirements. Each solution is backed by German engineering excellence and decades of innovation.',
          is_active: true
        });

      if (pageError) {
        setStatus(prev => prev + `❌ Products page error: ${pageError.message}\n`);
      } else {
        setStatus(prev => prev + '✅ Products page data created\n');
      }

      // 2. Setup product categories
      setStatus(prev => prev + '2. Setting up product categories...\n');

      const categories = [
        {
          name: 'L&W Compressors',
          description: 'Diverse range of high-pressure compressors designed for various industrial needs.',
          slug: 'lw-compressors',
          image_url: '/img/products/L&W Compressors/lw.jpg',
          is_active: true,
          display_order: 1
        },
        {
          name: 'INMATEC Gas Generators',
          description: 'Advanced compression solutions for industrial applications.',
          slug: 'inmatec-gas-generators',
          image_url: '/img/products/INMATEC/inmatec.png',
          is_active: true,
          display_order: 2
        },
        {
          name: 'ALMiG',
          description: 'At DiveMix we are proud to partner with ALMiG, a premier provider of state-of-the-art compressed air systems.',
          slug: 'almig',
          image_url: '/img/products/ALMIG/almig.png',
          is_active: true,
          display_order: 3
        },
        {
          name: 'BEKO',
          description: 'At DiveMix, we proudly partner with BEKO Technologies, a renowned leader in the field of compressed air and gas treatment solutions.',
          slug: 'beko',
          image_url: '/img/products/BEKO/beko.png',
          is_active: true,
          display_order: 4
        },
        {
          name: 'Maximator',
          description: 'At DiveMix, we are proud to partner with MAXIMATOR, a global leader in high-pressure technology.',
          slug: 'maximator',
          image_url: '/img/products/MAXIMATOR/maximator.png',
          is_active: true,
          display_order: 5
        }
      ];

      for (const category of categories) {
        const { error: catError } = await supabase
          .from('product_categories')
          .upsert(category, { onConflict: 'slug' });

        if (catError) {
          setStatus(prev => prev + `❌ Category ${category.name} error: ${catError.message}\n`);
        } else {
          setStatus(prev => prev + `✅ Category ${category.name} created\n`);
        }
      }

      // 3. Check final data
      setStatus(prev => prev + '3. Checking final data...\n');
      
      const { data: finalCategories, error: checkError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (checkError) {
        setStatus(prev => prev + `❌ Check error: ${checkError.message}\n`);
      } else {
        setStatus(prev => prev + `✅ Found ${finalCategories?.length || 0} active categories\n`);
        finalCategories?.forEach(cat => {
          setStatus(prev => prev + `   - ${cat.name} (${cat.slug})\n`);
        });
      }

      setStatus(prev => prev + '\n🎉 Setup completed! You can now visit /products\n');

    } catch (error: any) {
      setStatus(prev => prev + `❌ Setup failed: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Setup Products Data</h1>
      
      <button
        onClick={setupData}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {loading ? 'Setting up...' : 'Setup Products Data'}
      </button>

      {status && (
        <div className="bg-gray-100 p-4 rounded">
          <pre className="whitespace-pre-wrap text-sm">{status}</pre>
        </div>
      )}

      <div className="mt-4">
        <a 
          href="/products" 
          className="text-blue-500 hover:underline"
          target="_blank"
        >
          → Visit Products Page
        </a>
      </div>
    </div>
  );
}