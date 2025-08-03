import React from "react";

import ProductCard from "./ProductCard";
import Image from 'next/image';

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

interface ProductCategoryType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  products: Product[];
}

interface ProductCategoryProps {
  category: ProductCategoryType;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({ category }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src={category.image_url}
          alt={category.name}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <p className="text-gray-600">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
