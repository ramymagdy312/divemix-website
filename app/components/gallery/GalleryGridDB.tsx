"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import GalleryImage from './GalleryImage';
import ImageModal from './ImageModal';
import CategoryFilter from './CategoryFilter';
import type { GalleryImage as GalleryImageType } from '../../types/gallery';

const GalleryGridDB = () => {
  const [images, setImages] = useState<GalleryImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

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

export default GalleryGridDB;