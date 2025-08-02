"use client";

import { useState } from 'react';
import Image from 'next/image';
import AnimatedElement from '../common/AnimatedElement';

// Simple hardcoded gallery data for testing - using only confirmed existing images
const simpleGalleryData = [
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
];

const categories = [
  { slug: 'all', name: 'All' },
  { slug: 'installations', name: 'Installations' },
  { slug: 'maintenance', name: 'Maintenance' },
  { slug: 'testing', name: 'Testing' },
  { slug: 'facilities', name: 'Facilities' },
  { slug: 'training', name: 'Training' },
];

export default function SimpleGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  console.log('SimpleGallery - Total images:', simpleGalleryData.length);
  console.log('SimpleGallery - Selected category:', selectedCategory);
  
  const filteredImages = selectedCategory === 'all' 
    ? simpleGalleryData 
    : simpleGalleryData.filter(img => img.category === selectedCategory);
    
  console.log('SimpleGallery - Filtered images:', filteredImages.length);

  const getCategoryCount = (categorySlug: string) => {
    if (categorySlug === 'all') return simpleGalleryData.length;
    return simpleGalleryData.filter(img => img.category === categorySlug).length;
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedElement animation="slideUp">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our work through images showcasing our products, services, and applications
            </p>
          </div>
        </AnimatedElement>

        {/* Category Tabs */}
        <AnimatedElement animation="slideUp" delay={0.2}>
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
        </AnimatedElement>

        {/* Images Grid */}
        <AnimatedElement animation="slideUp" delay={0.4}>
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No images found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <AnimatedElement
                  key={image.id}
                  animation="scale"
                  delay={index * 0.1}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                </AnimatedElement>
              ))}
            </div>
          )}
        </AnimatedElement>
      </div>
    </div>
  );
}