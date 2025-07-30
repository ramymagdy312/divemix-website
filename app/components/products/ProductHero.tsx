import React from "react";
import type { ProductCategory } from "../../data/productCategories";
import Image from 'next/image';

interface ProductHeroProps {
  category: ProductCategory;
}

const ProductHero: React.FC<ProductHeroProps> = ({ category }) => {
  return (
    <div className="relative bg-cyan-900 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={category.hero}
          alt={category.categoryName}
          fill
          className="object-cover opacity-50"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {category.categoryName}
            </h1>
            <p className="text-xl text-cyan-100 leading-relaxed max-w-2xl">
              {category.shortDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
