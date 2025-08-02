"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedElement from "../common/AnimatedElement";
import Image from 'next/image';

// Updated interface to match database structure
interface ProductCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  // Legacy support for old structure
  categoryName?: string;
  shortDesc?: string;
  image?: string;
  hero?: string;
}

interface CategoryCardProps {
  category: ProductCategory;
  index?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0 }) => {
  // Use slug if available, otherwise fall back to id
  const categoryUrl = category.slug || category.id;
  
  // Support both new and old data structures
  const categoryName = category.name || category.categoryName || 'Unknown Category';
  const categoryDesc = category.description || category.shortDesc || 'No description available';
  const categoryImage = category.image_url || category.image || category.hero || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800';
  
  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <Link
        href={`/products/${categoryUrl}`}
        className="card-hover group bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full"
      >
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Image
              src={categoryImage}
              alt={categoryName}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
            <h2 className="text-2xl font-bold text-white mb-1">
              {categoryName}
            </h2>
            <p className="text-white/90 text-sm line-clamp-2">
              {categoryDesc}
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