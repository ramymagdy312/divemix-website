"use client";

import React, { useState, useEffect } from "react";
import { X, Star, ChevronLeft, ChevronRight, Zap, ZoomIn } from "lucide-react";
import Image from "next/image";
import AnimatedElement from "../common/AnimatedElement";

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  image_url?: string;
  images?: string[];
  category_id?: string;
  category?: string;
  features?: string[];
  is_active: boolean;
  display_order: number;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800",
        ];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <AnimatedElement animation="fadeIn">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/90 text-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[90vh]">
            {/* Image Section */}
            <div className="lg:w-1/2 relative bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="aspect-square relative group/image">
                <Image
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain cursor-zoom-in"
                  sizes="50vw"
                  onClick={() => setIsImageZoomed(true)}
                />

                {/* Zoom Icon */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-5 h-5" />
                </div>

                {/* Navigation */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? "bg-white scale-125 shadow-lg"
                            : "bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {productImages.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex
                            ? "border-cyan-500 scale-110"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 p-8 overflow-y-auto">
              <div className="space-y-6">
                {/* Title and Badge */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {product.features && product.features.length > 0 && (
                      <div className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold">
                        {product.features.length} Features
                      </div>
                    )}
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Description
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      Key Features
                    </h2>

                    <div className="grid grid-cols-1 gap-3">
                      {product.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start group/feature p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="relative mt-1 mr-4">
                            <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center group-hover/feature:scale-110 transition-transform duration-200">
                              <Zap className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <span className="text-gray-700 leading-relaxed group-hover/feature:text-gray-900 transition-colors duration-200 flex-1">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedElement>

      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center">
            <Image
              src={productImages[currentImageIndex]}
              alt={`${product.name} - Full size`}
              fill
              className="object-contain"
              sizes="95vw"
            />
          </div>

          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {productImages.length}
            </div>
          )}

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsImageZoomed(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductModal;
