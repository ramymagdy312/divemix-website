"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

import ProductList from "./ProductList";
import ProductHero from "./ProductHero";
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

interface CategoryDetailFallbackProps {
  categoryId: string;
}

const CategoryDetailFallback: React.FC<CategoryDetailFallbackProps> = ({ categoryId }) => {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      const [categoryResult, productsResult] = await Promise.all([
        supabase
          .from('product_categories')
          .select('*')
          .eq('id', categoryId)
          .single(),
        supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .eq('is_active', true)
          .order('display_order', { ascending: true })
      ]);

      if (categoryResult.error) {
        console.error('Error fetching category:', categoryResult.error);
        setCategory(null);
      } else {
        setCategory(categoryResult.data);
      }

      if (productsResult.error) {
        console.error('Error fetching products:', productsResult.error);
        setProducts([]);
      } else {
        setProducts(productsResult.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCategory(null);
      setProducts([]);
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

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <p className="text-gray-600 mb-8">The category &quot;{categoryId}&quot; could not be found.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Demo Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You&apos;re viewing demo products. Database connection is not available.</p>
              </div>
            </div>
          </div>
        </div>

        <ProductList products={products} />
      </div>
    </div>
  );
};

export default CategoryDetailFallback;