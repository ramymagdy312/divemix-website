import React from "react";
import Image from 'next/image';

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
}

interface ProductHeroProps {
  category?: ProductCategory;
}

const ProductHero: React.FC<ProductHeroProps> = ({ category }) => {
  // Check if category exists
  if (!category) {
    return (
      <div className="relative bg-cyan-900 text-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Loading Category...
              </h1>
              <p className="text-xl text-cyan-100 leading-relaxed max-w-2xl">
                Please wait while we load the category information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use image_url as hero image, with fallback
  const heroImage = category.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000';
  const categoryName = category.name || 'Unknown Category';
  const categoryDescription = category.description || 'No description available';
  
  return (
    <div className="relative bg-cyan-900 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={categoryName}
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {categoryName}
            </h1>
            <p className="text-xl text-cyan-100 leading-relaxed max-w-2xl">
              {categoryDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
