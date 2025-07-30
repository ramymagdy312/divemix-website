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
  images: string[];
  features: string[];
}

interface ProductListDBProps {
  categoryId: string;
}

const ProductListDB: React.FC<ProductListDBProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(products, [
    "name",
    "description",
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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
            {filteredItems.map((product) => (
              <ProductDetail 
                key={product.id} 
                product={{
                  id: product.id,
                  name: product.name,
                  desc: product.description,
                  features: product.features,
                  images: product.images
                }} 
              />
            ))}
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