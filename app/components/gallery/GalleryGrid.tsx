"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryImage from './GalleryImage';
import ImageModal from './ImageModal';
import CategoryFilter from './CategoryFilter';
import type { GalleryImage as GalleryImageType } from '../../types/gallery';

interface GalleryGridProps {
  images: GalleryImageType[];
}

const GalleryGrid = ({ images }: GalleryGridProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...new Set(images.map(img => img.category))];
  
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const handleImageClick = (image: GalleryImageType) => {
    setSelectedImage(image);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextImage = filteredImages[(currentIndex + 1) % filteredImages.length];
    setSelectedImage(nextImage);
  };

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const previousImage = filteredImages[currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1];
    setSelectedImage(previousImage);
  };

  return (
    <div>
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map(image => (
            <GalleryImage
              key={image.id}
              image={image}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            hasNext={filteredImages.length > 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;