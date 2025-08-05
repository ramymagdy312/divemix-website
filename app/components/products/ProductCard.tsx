import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Share2, Eye, Star, ZoomIn } from "lucide-react";
import Image from 'next/image';
import AnimatedElement from "../common/AnimatedElement";
import Tooltip from "../common/Tooltip";

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
  index?: number;
  onViewDetails?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  index = 0,
  onViewDetails 
}) => {
  // Ensure we have images array with fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [product.image_url]
    : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800'];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const shareProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: productDescription,
        url: window.location.href,
      });
    }
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  // Support both new and old data structures
  const productName = product.name || 'Unknown Product';
  const productDescription = product.short_description || product.description || product.desc || 'No description available';

  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <div 
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-cyan-200 relative cursor-pointer card-enhanced"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewDetails}
      >
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={productImages[currentImageIndex]}
            alt={productName}
            fill
            className="object-cover transform transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Zoom Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className={`absolute top-4 left-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black/70 hover:scale-110 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          {/* Navigation Arrows */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-lg ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-lg ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Action Buttons */}
          <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`}>
            <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <button
                onClick={toggleFavorite}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                  isFavorite 
                    ? 'bg-red-500 text-white scale-110' 
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </Tooltip>
            
            <Tooltip content="Share product">
              <button
                onClick={shareProduct}
                className="w-10 h-10 bg-white/90 text-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:text-cyan-600 hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>

          {/* Features Count Badge */}
          {product.features && product.features.length > 0 && (
            <div className="absolute top-4 left-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-lg">
                {product.features.length} Features
              </div>
            </div>
          )}

          {/* Image Indicators */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {productImages.map((_, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(imgIndex);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    imgIndex === currentImageIndex 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors duration-300 line-clamp-2">
            {productName}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm">
            {productDescription}
          </p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                <Star className="w-4 h-4 mr-2 text-cyan-600" />
                Key Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.features.slice(0, 3).map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200 hover:from-cyan-100 hover:to-blue-100 transition-colors duration-200"
                  >
                    {feature.length > 15 ? `${feature.substring(0, 15)}...` : feature}
                  </span>
                ))}
                {product.features.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    +{product.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleViewDetails}
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group/btn"
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
            <span>View Details</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-700" />

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>
    </AnimatedElement>
  );
};

export default ProductCard;
