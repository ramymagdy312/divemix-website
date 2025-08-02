"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetupProducts() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const setupProducts = async () => {
    setLoading(true);
    setResult('Setting up products...\n');

    try {
      // First, get all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('product_categories')
        .select('id, name, slug')
        .order('display_order');

      if (categoriesError) {
        setResult(prev => prev + `Error fetching categories: ${categoriesError.message}\n`);
        return;
      }

      setResult(prev => prev + `Found ${categories?.length || 0} categories\n`);

      if (!categories || categories.length === 0) {
        setResult(prev => prev + 'No categories found. Please set up categories first.\n');
        return;
      }

      // Products data
      const productsData = [
        // Diving Equipment
        {
          name: 'Professional Diving Mask',
          description: 'High-quality diving mask with anti-fog technology and comfortable silicone skirt for crystal clear underwater vision',
          short_description: 'Crystal clear vision underwater',
          category_slug: 'diving-equipment',
          image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
          features: ['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens', 'Adjustable strap'],
          display_order: 1
        },
        {
          name: 'Professional Diving Fins',
          description: 'Lightweight and efficient diving fins designed for better propulsion and enhanced underwater mobility',
          short_description: 'Enhanced underwater mobility',
          category_slug: 'diving-equipment',
          image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
          features: ['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket', 'Durable materials'],
          display_order: 2
        },
        // Safety Gear
        {
          name: 'Underwater Safety Light',
          description: 'Bright LED safety light for underwater visibility and emergency signaling',
          short_description: 'Stay visible and safe underwater',
          category_slug: 'safety-gear',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
          features: ['Waterproof to 100m', 'Long battery life', 'Multiple flash modes', 'Compact design'],
          display_order: 1
        },
        {
          name: 'Emergency Whistle',
          description: 'High-pitched emergency whistle for surface signaling and safety',
          short_description: 'Emergency surface signaling',
          category_slug: 'safety-gear',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
          features: ['High-pitched sound', 'Corrosion resistant', 'Lightweight', 'Lanyard included'],
          display_order: 2
        },
        // Underwater Cameras
        {
          name: 'Waterproof Action Camera',
          description: '4K underwater action camera with image stabilization for capturing stunning underwater footage',
          short_description: 'Capture stunning underwater footage',
          category_slug: 'underwater-cameras',
          image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
          features: ['4K video recording', 'Image stabilization', 'Waterproof to 30m', 'Touch screen'],
          display_order: 1
        },
        {
          name: 'Underwater Housing',
          description: 'Professional underwater housing for DSLR cameras with full control access',
          short_description: 'Professional camera protection',
          category_slug: 'underwater-cameras',
          image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
          features: ['Waterproof to 60m', 'Full camera control', 'Clear optical glass', 'Ergonomic design'],
          display_order: 2
        },
        // Accessories
        {
          name: 'Diving Gloves',
          description: 'Neoprene diving gloves for thermal protection and grip enhancement',
          short_description: 'Thermal protection and grip',
          category_slug: 'accessories',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
          features: ['3mm neoprene', 'Enhanced grip', 'Thermal protection', 'Flexible design'],
          display_order: 1
        },
        {
          name: 'Diving Boots',
          description: 'Comfortable diving boots with non-slip sole for rocky entries',
          short_description: 'Comfortable foot protection',
          category_slug: 'accessories',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
          features: ['Non-slip sole', 'Comfortable fit', 'Quick-dry material', 'Reinforced toe'],
          display_order: 2
        },
        // Wetsuits Gear
        {
          name: 'Full Wetsuit 3mm',
          description: 'High-quality 3mm neoprene wetsuit for thermal protection in moderate waters',
          short_description: 'Thermal protection for diving',
          category_slug: 'wetsuits-gear',
          image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
          features: ['3mm neoprene', 'Full body coverage', 'Flexible design', 'YKK zipper'],
          display_order: 1
        },
        {
          name: 'Diving Hood',
          description: 'Neoprene diving hood for additional thermal protection in cold waters',
          short_description: 'Extra thermal protection',
          category_slug: 'wetsuits-gear',
          image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
          features: ['5mm neoprene', 'Comfortable fit', 'Thermal protection', 'Easy to wear'],
          display_order: 2
        },
        // Maintenance Tools
        {
          name: 'Regulator Service Kit',
          description: 'Complete service kit for diving regulator maintenance and repair',
          short_description: 'Professional regulator maintenance',
          category_slug: 'maintenance-tools',
          image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
          features: ['Complete service kit', 'Professional grade', 'All necessary tools', 'Instruction manual'],
          display_order: 1
        },
        {
          name: 'Equipment Cleaning Kit',
          description: 'Specialized cleaning kit for diving equipment maintenance and care',
          short_description: 'Keep your gear in top condition',
          category_slug: 'maintenance-tools',
          image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
          features: ['Specialized cleaners', 'Soft brushes', 'Microfiber cloths', 'Storage case'],
          display_order: 2
        }
      ];

      // Insert products
      let successCount = 0;
      let errorCount = 0;

      for (const productData of productsData) {
        try {
          // Find category by slug
          const category = categories.find(cat => cat.slug === productData.category_slug);
          if (!category) {
            setResult(prev => prev + `Category not found for slug: ${productData.category_slug}\n`);
            errorCount++;
            continue;
          }

          // Insert product
          const { error } = await supabase
            .from('products')
            .upsert({
              name: productData.name,
              description: productData.description,
              short_description: productData.short_description,
              category_id: category.id,
              image_url: productData.image_url,
              images: [productData.image_url],
              features: productData.features,
              is_active: true,
              display_order: productData.display_order
            }, {
              onConflict: 'name'
            });

          if (error) {
            setResult(prev => prev + `Error inserting ${productData.name}: ${error.message}\n`);
            errorCount++;
          } else {
            setResult(prev => prev + `✅ Inserted: ${productData.name}\n`);
            successCount++;
          }
        } catch (error: any) {
          setResult(prev => prev + `Error processing ${productData.name}: ${error.message}\n`);
          errorCount++;
        }
      }

      setResult(prev => prev + `\n🎉 Setup complete!\n✅ Success: ${successCount}\n❌ Errors: ${errorCount}\n`);

      // Verify results
      const { data: finalProducts } = await supabase
        .from('products')
        .select('id, name, category_id')
        .eq('is_active', true);

      setResult(prev => prev + `\n📊 Total products in database: ${finalProducts?.length || 0}\n`);

    } catch (error: any) {
      setResult(prev => prev + `Fatal error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🛠️ Setup Products</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p className="text-gray-600 mb-4">
          This will add sample products to your database with proper category linking.
        </p>
        
        <button
          onClick={setupProducts}
          disabled={loading}
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up...' : 'Setup Products'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}