"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductCategory } from "../../data/productCategories";
import AnimatedElement from "../common/AnimatedElement";
import Image from 'next/image';

interface CategoryCardProps {
  category: ProductCategory;
  index?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0 }) => {
  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <Link
        href={`/products/${category.id}`}
        className="card-hover group bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full"
      >
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Image
              src={category.image}
              alt={category.categoryName}
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
            <h2 className="text-2xl font-bold text-white mb-1">
              {category.categoryName}
            </h2>
            <p className="text-white/90 text-sm line-clamp-2">
              {category.shortDesc}
            </p>
          </div>
        </div>
        <div className="p-6 mt-auto flex items-center justify-between text-sm text-cyan-600 border-t border-gray-100">
          <span className="font-medium">View Products</span>
          <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </Link>
    </AnimatedElement>
  );
};

export default CategoryCard;