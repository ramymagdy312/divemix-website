"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import ProductListDB from "./ProductListDB";
import ProductHero from "./ProductHero";
import CategoryDetailFallback from "./CategoryDetailFallback";
import { ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

interface CategoryDetailDBProps {
  categoryId: string;
}

const CategoryDetailDB: React.FC<CategoryDetailDBProps> = ({ categoryId }) => {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    try {
      setError(null);
      console.log('Fetching category with ID/slug:', categoryId);
      
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq(`slug`, `${categoryId}`)
        .eq('is_active', true)
        .single();

      console.log('Category query result:', { data, error });

      if (error) throw error;
      setCategory(data);
      console.log('Category set successfully:', data);
    } catch (error: any) {
      console.error('Error fetching category:', error);
      setError(error.message);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

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
    console.log('Falling back to CategoryDetailFallback due to:', error || 'Category not found');
    return <CategoryDetailFallback categoryId={categoryId} />;
  }

  return (
    <div>
      <ProductHero category={category} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.push("/products")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-600">Back to categories</span>
        </div>

        <ProductListDB categoryId={categoryId} />
      </div>
    </div>
  );
};

export default CategoryDetailDB;