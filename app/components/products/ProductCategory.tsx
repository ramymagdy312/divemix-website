import React from "react";
import type { ProductCategory as ProductCategoryType } from "../../data/productCategories";
import ProductCard from "./ProductCard";
import Image from 'next/image';

interface ProductCategoryProps {
  category: ProductCategoryType;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({ category }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src={category.image}
          alt={category.categoryName}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-2xl font-bold">{category.categoryName}</h2>
          <p className="text-gray-600">{category.shortDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
