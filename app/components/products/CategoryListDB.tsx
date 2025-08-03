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

const CategoryListDB = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    categories,
    ["name", "description"]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching product categories:', error);

      setCategories([]);
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

export default CategoryListDB;