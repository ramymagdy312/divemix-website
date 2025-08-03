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

interface CategoryDetailProps {
  categoryId: string;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ categoryId }) => {
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
      // Fetch category and products in parallel
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
    return <div>Category not found</div>;
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

        <ProductList products={products} />
      </div>
    </div>
  );
};

export default CategoryDetail;