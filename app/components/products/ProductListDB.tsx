"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import ProductDetail from "./ProductDetail";
import SearchBar from "./SearchBar";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  image_url?: string;
  images?: string[];
  category_id?: string;
  category?: string;
  features?: string[];
  is_active: boolean;
  display_order: number;
}

interface ProductListDBProps {
  categoryId: string;
}

const ProductListDB: React.FC<ProductListDBProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(products, [
    "name",
    "description",
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      // First try to get category by slug or ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('id, slug, name')
        .eq('slug', categoryId)
        .single();

      if (categoryError || !categoryData) {
        console.log('Category not found in database:', categoryError);
        setError('Category not found');
        setProducts([]);
        setLoading(false);
        return;
      }

      // Then get products by category_id
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      
      // If no products found, this is not an error, just empty results
      if (!data || data.length === 0) {
        console.log('No products found for category:', categoryId);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
          placeholder="Search products..."
        />

        {filteredItems.length > 0 ? (
          <div className="space-y-8">
            {filteredItems.map((product) => {
              const productImages = product.images && product.images.length > 0 
                ? product.images 
                : product.image_url 
                ? [product.image_url]
                : [];
              
              return (
                <ProductDetail 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    short_description: product.short_description || product.description,
                    category_id: product.category_id || '',
                    image_url: product.image_url || '',
                    features: product.features || [],
                    images: productImages,
                    is_active: product.is_active,
                    display_order: product.display_order
                  }} 
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </AnimatedElement>
  );
};

export default ProductListDB;