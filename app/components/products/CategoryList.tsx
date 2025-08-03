"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('CategoryList: Fetching categories...');
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('CategoryList: Data received:', data);
      console.log('CategoryList: Error:', error);

      if (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } else {
        console.log('CategoryList: Setting categories:', data?.length || 0);
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    categories,
    ["name", "description"]
  );

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
              {categories.length === 0 
                ? "No product categories available. Please set up the database first."
                : "No categories found matching your search."
              }
            </p>
            {categories.length === 0 && (
              <div className="mt-4">
                <a 
                  href="/setup-products-data" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Setup Products Data
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedElement>
  );
};

export default CategoryList;
