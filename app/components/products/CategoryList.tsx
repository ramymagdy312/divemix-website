"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SearchBar from "./SearchBar";
import CategoryCard from "./CategoryCard";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";
import StatsCounter from "../common/StatsCounter";
import EnhancedLoader from "../common/EnhancedLoader";
import QuickNavigation from "../common/QuickNavigation";
import { Package, Search, Grid } from 'lucide-react';

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
    return <EnhancedLoader message="Loading categories..." variant="spinner" size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <AnimatedElement animation="slideUp" delay={0.1}>
        <div className="max-w-md mx-auto" data-search>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search categories..."
          />
        </div>
      </AnimatedElement>

      {/* Stats Section */}
      {categories.length > 0 && (
        <AnimatedElement animation="slideUp" delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <StatsCounter 
              count={categories.length} 
              label="Categories" 
              icon={<Grid className="w-full h-full" />}
            />
            <StatsCounter 
              count={filteredItems.length} 
              label="Showing" 
              icon={<Search className="w-full h-full" />}
            />
            <StatsCounter 
              count={categories.reduce((acc, cat) => acc + (cat.display_order || 0), 0)} 
              label="Products" 
              icon={<Package className="w-full h-full" />}
              suffix="+"
            />
          </div>
        </AnimatedElement>
      )}

      {/* Categories Grid */}
      <AnimatedElement animation="fadeIn" delay={0.2}>
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 grid-stagger items-stretch">
            {filteredItems.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              {categories.length === 0 ? (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No Categories Available</h3>
                  <p className="text-gray-500">
                    No product categories are currently available. Please set up the database first.
                  </p>
                  <div className="mt-6">
                    <a 
                      href="/setup-products-data" 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Setup Products Data
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No Results Found</h3>
                  <p className="text-gray-500">
                    No categories found matching your search criteria. Try adjusting your search terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatedElement>

      {/* Quick Navigation */}
      <QuickNavigation />
    </div>
  );
};

export default CategoryList;
