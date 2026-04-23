"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { supabase } from "../../lib/supabase";
import { deepResolveI18n } from "../../lib/i18n/resolve";
import type { Locale } from "../../lib/i18n/config";
import CategoryDetailFallback from "./CategoryDetailFallback";
import ProductHero from "./ProductHero";
import ProductListDB from "./ProductListDB";
import CategoryCard from "./CategoryCard";

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

interface CategoryDetailDBProps {
  categoryId: string;
  locale?: string;
}

const CategoryDetailDB: React.FC<CategoryDetailDBProps> = ({ categoryId, locale = "en" }) => {
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq(`slug`, `${categoryId}`)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      const resolvedCategory = deepResolveI18n(data, activeLocale) as Category;
      setCategory(resolvedCategory);

      const { data: subData, error: subError } = await supabase
        .from("product_categories")
        .select("*")
        .eq("parent_id", data.id)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (subError) {
        console.error("Error fetching subcategories:", subError);
        setSubcategories([]);
      } else {
        setSubcategories(deepResolveI18n(subData || [], activeLocale));
      }
    } catch (error: any) {
      console.error("Error fetching category:", error);
      setError(error.message);
      setCategory(null);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, activeLocale]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // If there's an error or no category found, fall back to the fallback component
  if (error || !category) {
    console.log(
      "Falling back to CategoryDetailFallback due to:",
      error || "Category not found"
    );
    return <CategoryDetailFallback categoryId={categoryId} />;
  }

  return (
    <div>
      <ProductHero category={category} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.push(`/${locale}/products`)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-600">Back to categories</span>
        </div>

        {subcategories.length > 0 ? (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Subcategories
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore the different types of {category.name} products
                available.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 grid-stagger items-stretch">
              {subcategories.map((subcategory, index) => (
                <CategoryCard
                  key={subcategory.id}
                  category={subcategory}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : category.parent_id ? (
          <ProductListDB subcategory_id={categoryId} />
        ) : null}
      </div>
    </div>
  );
};

export default CategoryDetailDB;
