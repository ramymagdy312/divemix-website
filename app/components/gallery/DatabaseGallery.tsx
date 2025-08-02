"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DatabaseGallery() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => 
        img.category_id === selectedCategory || 
        img.category === selectedCategory ||
        categories.find(cat => cat.id === img.category_id)?.slug === selectedCategory
      );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching data from Supabase...');

      // Fetch categories and images in parallel
      const [categoriesResult, imagesResult] = await Promise.all([
        supabase
          .from('gallery_categories')
          .select('*')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      console.log('Categories result:', categoriesResult);
      console.log('Images result:', imagesResult);

      if (categoriesResult.error) {
        console.error('Categories error:', categoriesResult.error);
        throw categoriesResult.error;
      }

      if (imagesResult.error) {
        console.error('Images error:', imagesResult.error);
        throw imagesResult.error;
      }

      const fetchedCategories = categoriesResult.data || [];
      const fetchedImages = imagesResult.data || [];

      console.log('Fetched categories:', fetchedCategories.length);
      console.log('Fetched images:', fetchedImages.length);

      setCategories(fetchedCategories);
      setImages(fetchedImages);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load gallery data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryCount = (categorySlug: string) => {
    if (categorySlug === 'all') return images.length;
    return images.filter(img => 
      img.category_id === categorySlug || 
      img.category === categorySlug ||
      categories.find(cat => cat.id === img.category_id)?.slug === categorySlug
    ).length;
  };

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[prevIndex]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeModal();
  };

  // Add keyboard event listener
  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">⚠️ Error loading gallery</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create categories list with "All" option
  const allCategories = [
    { id: 'all', name: 'All', slug: 'all', description: null, is_active: true, created_at: '', updated_at: '' },
    ...categories
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our work through images showcasing our products, services, and applications
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {allCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.slug
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category.name} ({getCategoryCount(category.slug)})
            </button>
          ))}
        </div>

        {/* Images Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => {
              console.log('Rendering image:', image.url);
              return (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => openModal(image)}
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        console.error('Image failed to load:', image.url);
                        console.error('Error details:', e);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', image.url);
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {image.title}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {categories.find(cat => 
                          cat.id === image.category_id || cat.slug === image.category
                        )?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Showing {filteredImages.length} of {images.length} images
          </p>
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={closeModal}>
            <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors"
              >
                ›
              </button>
              
              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <h3 className="text-lg font-semibold mb-1">{selectedImage.title}</h3>
                <p className="text-sm text-gray-300">
                  {categories.find(cat => 
                    cat.id === selectedImage.category_id || cat.slug === selectedImage.category
                  )?.name || 'Uncategorized'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} of {filteredImages.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}