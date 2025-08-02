"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import SearchBar from "./SearchBar";
import CategoryCard from "./CategoryCard";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

// Fallback data when database is not available
const fallbackCategories: Category[] = [
  {
    id: '1',
    name: 'Diving Equipment',
    description: 'Professional diving gear and equipment for all levels of divers',
    slug: 'diving-equipment',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 1
  },
  {
    id: '2',
    name: 'Safety Gear',
    description: 'Essential safety equipment for underwater activities and diving',
    slug: 'safety-gear',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 2
  },
  {
    id: '3',
    name: 'Underwater Cameras',
    description: 'Capture your underwater adventures with professional cameras',
    slug: 'underwater-cameras',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 3
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Essential accessories for diving and underwater activities',
    slug: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 4
  },
  {
    id: '5',
    name: 'Wetsuits & Gear',
    description: 'High-quality wetsuits and thermal protection gear',
    slug: 'wetsuits-gear',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 5
  },
  {
    id: '6',
    name: 'Maintenance Tools',
    description: 'Tools and equipment for maintaining your diving gear',
    slug: 'maintenance-tools',
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 6
  }
];

const CategoryListFallback = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    categories,
    ["name", "description"]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
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
        setCategories(fallbackCategories);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching product categories:', error);
        console.warn('Using fallback data due to database error.');
        setCategories(fallbackCategories);
        setUsingFallback(true);
      } else {
        setCategories(data || []);
        setUsingFallback(false);
      }
    } catch (error) {
      console.error('Error:', error);
      console.warn('Using fallback data due to connection error.');
      setCategories(fallbackCategories);
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
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> Showing sample product categories. 
                  <a href="/check-products-database" className="underline ml-1">
                    Set up database →
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search categories..."
        />

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No categories found matching your search.
            </p>
          </div>
        )}
      </div>
    </AnimatedElement>
  );
};

export default CategoryListFallback;