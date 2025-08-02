import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from 'next/image';

// Updated interface to match database structure
interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category_id?: string;
  image_url?: string;
  images?: string[];
  features?: string[];
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  // Legacy support
  desc?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Ensure we have images array with fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [product.image_url]
    : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800'];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  // Support both new and old data structures
  const productName = product.name || 'Unknown Product';
  const productDescription = product.short_description || product.description || product.desc || 'No description available';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={productImages[currentImageIndex]}
          alt={productName}
          fill
          className="object-cover"
        />
        {productImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        {productImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{productName}</h3>
        <p className="text-gray-600 line-clamp-2">{productDescription}</p>
        {product.features && product.features.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-block bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="inline-block bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded">
                  +{product.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
