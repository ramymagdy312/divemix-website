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
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-cyan-200 relative"
      >
        {/* Image Section */}
        <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={categoryImage}
              alt={categoryName}
              fill
              className="object-contain p-6 transform transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-xs font-semibold text-gray-800">Category</span>
            </div>
          </div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors duration-300">
              {categoryName}
            </h2>
            <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
              {categoryDesc}
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="p-6 mt-auto bg-gradient-to-r from-gray-50 to-white group-hover:from-cyan-50 group-hover:to-blue-50 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300" />
              <span className="font-semibold text-gray-800 group-hover:text-cyan-700 transition-colors duration-300">
                View Products
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                <ArrowRight className="h-4 w-4 text-white transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-100/20 to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-20 left-0 w-16 h-16 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-700" />
      </Link>
    </AnimatedElement>
  );
};

export default CategoryCard;