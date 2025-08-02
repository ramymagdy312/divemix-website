"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  image_url?: string;
  category_id?: string;
  price?: number;
  specifications?: any;
  features?: string[];
  is_active: boolean;
  display_order: number;
}

interface ProductListFallbackProps {
  categoryId: string;
  categorySlug: string;
}

// Fallback products data
const fallbackProducts: { [key: string]: Product[] } = {
  'diving-equipment': [
    {
      id: '1',
      name: 'Professional Diving Mask',
      description: 'High-quality diving mask with anti-fog technology and comfortable silicone skirt. Perfect for professional and recreational diving.',
      short_description: 'Crystal clear vision underwater',
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      price: 89.99,
      features: ['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens', 'Easy-adjust strap'],
      is_active: true,
      display_order: 1
    },
    {
      id: '2',
      name: 'Diving Fins',
      description: 'Lightweight and efficient diving fins designed for better propulsion and reduced fatigue during long dives.',
      short_description: 'Enhanced underwater mobility',
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
      price: 65.99,
      features: ['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket', 'Durable materials'],
      is_active: true,
      display_order: 2
    },
    {
      id: '3',
      name: 'Diving Regulator Set',
      description: 'Complete regulator system with first and second stage, octopus, and pressure gauge. Reliable and safe for all diving conditions.',
      short_description: 'Complete breathing system',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
      price: 299.99,
      features: ['First & second stage', 'Octopus backup', 'Pressure gauge', 'Cold water rated'],
      is_active: true,
      display_order: 3
    }
  ],
  'safety-gear': [
    {
      id: '4',
      name: 'Underwater Safety Light',
      description: 'Bright LED safety light for underwater visibility and emergency signaling. Waterproof and long-lasting battery.',
      short_description: 'Stay visible and safe underwater',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
      price: 45.99,
      features: ['Waterproof to 100m', 'Long battery life', 'Multiple flash modes', 'Compact design'],
      is_active: true,
      display_order: 1
    },
    {
      id: '5',
      name: 'Emergency Whistle',
      description: 'High-pitched emergency whistle for surface signaling. Essential safety equipment for all divers.',
      short_description: 'Emergency surface signaling',
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      price: 12.99,
      features: ['High-pitched sound', 'Corrosion resistant', 'Lanyard included', 'Compact size'],
      is_active: true,
      display_order: 2
    }
  ],
  'underwater-cameras': [
    {
      id: '6',
      name: 'Waterproof Action Camera',
      description: '4K underwater action camera with image stabilization and waterproof housing. Perfect for capturing underwater adventures.',
      short_description: 'Capture stunning underwater footage',
      image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
      price: 299.99,
      features: ['4K video recording', 'Image stabilization', 'Waterproof to 30m', 'Touch screen'],
      is_active: true,
      display_order: 1
    },
    {
      id: '7',
      name: 'Underwater Housing',
      description: 'Professional underwater housing for DSLR cameras. Allows full camera control underwater up to 60 meters depth.',
      short_description: 'Professional underwater photography',
      image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
      price: 899.99,
      features: ['Fits most DSLRs', 'Depth rated to 60m', 'Full camera control', 'Clear optical glass'],
      is_active: true,
      display_order: 2
    }
  ],
  'accessories': [
    {
      id: '8',
      name: 'Diving Gear Bag',
      description: 'Large capacity gear bag with multiple compartments for organizing diving equipment. Water-resistant and durable.',
      short_description: 'Organize your diving gear',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
      price: 79.99,
      features: ['Large capacity', 'Multiple compartments', 'Water-resistant', 'Shoulder straps'],
      is_active: true,
      display_order: 1
    }
  ],
  'wetsuits-gear': [
    {
      id: '9',
      name: '3mm Wetsuit',
      description: 'High-quality 3mm neoprene wetsuit perfect for tropical and warm water diving. Comfortable fit and excellent thermal protection.',
      short_description: 'Thermal protection for warm water',
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
      price: 149.99,
      features: ['3mm neoprene', 'Comfortable fit', 'Back zip entry', 'Reinforced knees'],
      is_active: true,
      display_order: 1
    }
  ],
  'maintenance-tools': [
    {
      id: '10',
      name: 'Regulator Service Kit',
      description: 'Complete service kit for maintaining diving regulators. Includes O-rings, tools, and lubricants.',
      short_description: 'Keep your regulator in top condition',
      image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
      price: 39.99,
      features: ['Complete O-ring set', 'Service tools', 'Silicone lubricant', 'Instruction manual'],
      is_active: true,
      display_order: 1
    }
  ]
};

const ProductListFallback: React.FC<ProductListFallbackProps> = ({ categoryId, categorySlug }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    products,
    ["name", "description", "short_description"]
  );

  useEffect(() => {
    fetchProducts();
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        console.warn('Supabase not configured. Using fallback data.');
        const fallbackData = fallbackProducts[categorySlug] || fallbackProducts['diving-equipment'] || [];
        setProducts(fallbackData);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
        console.warn('Using fallback data due to database error.');
        const fallbackData = fallbackProducts[categorySlug] || fallbackProducts['diving-equipment'] || [];
        setProducts(fallbackData);
        setUsingFallback(true);
      } else {
        setProducts(data || []);
        setUsingFallback(false);
      }
    } catch (error) {
      console.error('Error:', error);
      console.warn('Using fallback data due to connection error.');
      const fallbackData = fallbackProducts[categorySlug] || fallbackProducts['diving-equipment'] || [];
      setProducts(fallbackData);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <AnimatedElement animation="fadeIn">
      <div>
        {usingFallback && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Demo Products:</strong> Showing sample products for this category. 
                  <a href="/check-products-database" className="underline ml-1">
                    Set up database to add real products →
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products..."
        />

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </AnimatedElement>
  );
};

export default ProductListFallback;