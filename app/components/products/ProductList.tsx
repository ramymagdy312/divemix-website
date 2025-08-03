"use client";

import React from "react";

import ProductDetail from "./ProductDetail";
import SearchBar from "./SearchBar";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  category_id: string;
  image_url: string;
  images: string[];
  features: string[];
  is_active: boolean;
  display_order: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(products, [
    "name",
    "description",
  ]);

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
              <ProductDetail key={product.id} product={product} />
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

export default ProductList;
