import React, { useState } from "react";
import ProductImageGallery from "./ProductImageGallery";
import AnimatedElement from "../common/AnimatedElement";
import { Button } from "@/app/components/ui/button";
import { Star, Eye, ChevronDown, ChevronUp } from "lucide-react";

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

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  index?: number;
  onViewDetails?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "list",
  index = 0,
  onViewDetails,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (viewMode === "grid") {
    return (
      <AnimatedElement animation="slideUp" delay={index * 0.1}>
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-cyan-200 relative card-enhanced h-full flex flex-col">
          {/* Image Section */}
          <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
            <ProductImageGallery images={product.images} alt={product.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Product Badge */}
            <div className="absolute bottom-4 left-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-xs font-semibold text-gray-800">
                  Product
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4 flex-grow flex flex-col">
            {/* Title */}
            <div className="flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors duration-300 line-clamp-2">
                {product.name}
              </h3>
            </div>

            {/* Description */}
            <div className="flex-shrink-0">
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {product.short_description}
              </p>
            </div>

            {/* Content that grows to fill space */}
            <div className="flex-grow space-y-4">
              {/* Features Preview */}
              {product.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-cyan-600" />
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {product.features
                      .slice(0, 3)
                      .map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start text-sm"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 line-clamp-1">
                            {feature}
                          </span>
                        </li>
                      ))}
                    {product.features.length > 3 && (
                      <li className="text-sm text-cyan-600 font-medium">
                        +{product.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* View Details Button - Always at bottom */}
            <div className="flex-shrink-0 pt-4">
              <button
                onClick={() => onViewDetails?.(product)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        </div>
      </AnimatedElement>
    );
  }

  // List View
  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-cyan-200 relative overflow-hidden card-enhanced">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-dots opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Section */}
            <div className="w-full lg:w-2/5 xl:w-1/3">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ProductImageGallery
                  images={product.images}
                  alt={product.name}
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />{" "}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Description */}
                <div className="space-y-2">
                  <p
                    className={`text-gray-600 text-lg leading-relaxed transition-all duration-300 ${
                      showFullDescription ? "" : "line-clamp-3"
                    }`}
                  >
                    {product.description}
                  </p>

                  {product.description.length > 200 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                    >
                      <span>
                        {showFullDescription ? "Show Less" : "Read More"}
                      </span>
                      {showFullDescription ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    Key Features
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start group/feature"
                      >
                        <div className="relative mt-2 mr-4">
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full group-hover/feature:scale-125 transition-transform duration-200" />
                          <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-0 group-hover/feature:opacity-75" />
                        </div>
                        <span className="text-gray-700 leading-relaxed group-hover/feature:text-gray-900 transition-colors duration-200">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => onViewDetails?.(product)}
                  className="btn-enhanced bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-100/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700" />
      </div>
    </AnimatedElement>
  );
};

export default ProductCard;
