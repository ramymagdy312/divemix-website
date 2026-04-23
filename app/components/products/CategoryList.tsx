"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { supabase } from "../../lib/supabase";
import { deepResolveI18n } from "../../lib/i18n/resolve";
import type { Locale } from "../../lib/i18n/config";
import SearchBar from "./SearchBar";
import CategoryCard from "./CategoryCard";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";
import StatsCounter from "../common/StatsCounter";
import EnhancedLoader from "../common/EnhancedLoader";
import QuickNavigation from "../common/QuickNavigation";
import { Package, Search, Grid } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  images?: string[];
  features?: string[];
  parent_id?: string;
  is_active: boolean;
  display_order: number;
}

const CategoryList = ({ initialCategories }: { initialCategories?: Category[] }) => {
  const locale = useLocale() as Locale;
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategories);

  useEffect(() => {
    if (initialCategories) return;

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("product_categories")
          .select("*")
          .is("parent_id", null)
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
          setCategories([]);
        } else {
          setCategories(deepResolveI18n(data || [], locale));
        }
      } catch (error) {
        console.error("Error:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [initialCategories, locale]);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(categories, ["name", "description"]);

  if (loading) {
    return <EnhancedLoader message="Loading categories..." variant="spinner" size="lg" />;
  }

  return (
    <div className="space-y-8">
      <AnimatedElement animation="slideUp" delay={0.1}>
        <div className="max-w-md mx-auto" data-search>
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search categories..." />
        </div>
      </AnimatedElement>

      {categories.length > 0 && (
        <AnimatedElement animation="slideUp" delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <StatsCounter count={categories.length} label="Categories" icon={<Grid className="w-full h-full" />} />
            <StatsCounter count={filteredItems.length} label="Showing" icon={<Search className="w-full h-full" />} />
            <StatsCounter
              count={categories.reduce((acc, cat) => acc + (cat.display_order || 0), 0)}
              label="Products"
              icon={<Package className="w-full h-full" />}
              suffix="+"
            />
          </div>
        </AnimatedElement>
      )}

      <AnimatedElement animation="fadeIn" delay={0.2}>
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 grid-stagger items-stretch">
            {filteredItems.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              {categories.length === 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">No Categories Available</h3>
                  <p className="text-gray-500">No product categories are currently available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">No Results Found</h3>
                  <p className="text-gray-500">No categories found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatedElement>

      <QuickNavigation />
    </div>
  );
};

export default CategoryList;
