import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageModal from "./ImageModal";
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
      if (e.key === 'ArrowLeft' && isModalOpen) {
        handlePrevious();
      }
      if (e.key === 'ArrowRight' && isModalOpen) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="h-full flex flex-col">
      <div 
        className="relative h-full rounded-lg overflow-hidden cursor-pointer group"
        onClick={handleImageClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt={`${alt} - ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4 h-16">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-16 rounded-md overflow-hidden transition-all ${
                index === currentIndex 
                  ? "ring-2 ring-cyan-500 opacity-100" 
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="aspect-square relative bg-gray-50">
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ImageModal
          images={images}
          currentIndex={currentIndex}
          onClose={() => setIsModalOpen(false)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          alt={alt}
        />
      )}
    </div>
  );
};

export default ImageGallery;