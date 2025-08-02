"use client";

import { useState, useEffect } from 'react';
// import Image from 'next/image'; // Using regular img tag instead

// Gallery data with categories
const galleryData = [
  {
    id: '1',
    url: '/img/gallery/4big.jpg',
    title: 'Industrial Compressor Installation',
    category: 'installations',
  },
  {
    id: '2',
    url: '/img/gallery/11big.jpg',
    title: 'Maintenance Workshop',
    category: 'maintenance',
  },
  {
    id: '3',
    url: '/img/gallery/12big.jpg',
    title: 'Quality Testing Process',
    category: 'testing',
  },
  {
    id: '4',
    url: '/img/gallery/BEST_ANALOG_COMPRESSOR_BG.jpg',
    title: 'Best Analog Compressor',
    category: 'facilities',
  },
  {
    id: '5',
    url: '/img/gallery/DSC00502.jpg',
    title: 'Installation Documentation',
    category: 'installations',
  },
  {
    id: '6',
    url: '/img/gallery/maintenence.jpg',
    title: 'Maintenance Operations',
    category: 'maintenance',
  },
  {
    id: '7',
    url: '/img/gallery/IMG_4019.jpg',
    title: 'Training Documentation',
    category: 'training',
  },
  {
    id: '8',
    url: '/img/gallery/EgyRoll.jpg',
    title: 'EgyRoll Project',
    category: 'installations',
  },
  {
    id: '9',
    url: '/img/gallery/Al Ahmadeya.jpg',
    title: 'Al Ahmadeya Facility',
    category: 'facilities',
  },
  {
    id: '10',
    url: '/img/gallery/Al Ahram.jpg',
    title: 'Al Ahram Training',
    category: 'training',
  },
  {
    id: '11',
    url: '/img/gallery/Alamia Advanced.jpg',
    title: 'Alamia Advanced Installation',
    category: 'installations',
  },
  {
    id: '12',
    url: '/img/gallery/Egyptian Methanex.jpg',
    title: 'Egyptian Methanex Testing',
    category: 'testing',
  },
  {
    id: '13',
    url: '/img/gallery/Alex Pharma.jpg',
    title: 'Alex Pharma Installation',
    category: 'installations',
  },
  {
    id: '14',
    url: '/img/gallery/Danone Egypt.jpg',
    title: 'Danone Egypt Testing',
    category: 'testing',
  },
  {
    id: '15',
    url: '/img/gallery/Al_Ahmadeya.jpg',
    title: 'Al Ahmadeya Manufacturing',
    category: 'facilities',
  },
  {
    id: '16',
    url: '/img/gallery/Alamia Qaliub.jpg',
    title: 'Alamia Qaliub Installation',
    category: 'installations',
  },
];

const categories = [
  { slug: 'all', name: 'All' },
  { slug: 'installations', name: 'Installations' },
  { slug: 'maintenance', name: 'Maintenance' },
  { slug: 'testing', name: 'Testing' },
  { slug: 'facilities', name: 'Facilities' },
  { slug: 'training', name: 'Training' },
];

export default function BasicGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  const filteredImages = selectedCategory === 'all' 
    ? galleryData 
    : galleryData.filter(img => img.category === selectedCategory);

  const getCategoryCount = (categorySlug: string) => {
    if (categorySlug === 'all') return galleryData.length;
    return galleryData.filter(img => img.category === categorySlug).length;
  };

  const openModal = (image: any) => {
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
  }, [selectedImage]);

  console.log('BasicGallery rendering with', filteredImages.length, 'filtered images');
  
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
          {categories.map((category) => (
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
                      <p className="text-white/80 text-xs capitalize">
                        {image.category}
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
            Showing {filteredImages.length} of {galleryData.length} images
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
                <p className="text-sm text-gray-300 capitalize">{selectedImage.category}</p>
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