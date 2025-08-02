"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { productCategories } from "../../data/productCategories";
import ProductList from "./ProductList";
import ProductHero from "./ProductHero";
import { ArrowLeft } from "lucide-react";

interface CategoryDetailProps {
  categoryId: string;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ categoryId }) => {
  const router = useRouter();
  const category = productCategories.find((cat) => cat.id === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <ProductHero category={{
        id: category.id,
        name: category.categoryName,
        description: category.shortDesc,
        slug: category.slug || category.id,
        image_url: category.image,
        is_active: true,
        display_order: 1
      }} />
      
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

        <ProductList products={category.products} />
      </div>
    </div>
  );
};

export default CategoryDetail;