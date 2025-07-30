"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import ProductListDB from "./ProductListDB";
import ProductHero from "./ProductHero";
import { ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  hero_image: string;
  image: string;
}

interface CategoryDetailDBProps {
  categoryId: string;
}

const CategoryDetailDB: React.FC<CategoryDetailDBProps> = ({ categoryId }) => {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) throw error;
      setCategory(data);
    } catch (error) {
      console.error('Error fetching category:', error);
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

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <ProductHero 
        category={{
          id: category.id,
          categoryName: category.name,
          shortDesc: category.description,
          hero: category.hero_image,
          image: category.image,
          products: []
        }} 
      />
      
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