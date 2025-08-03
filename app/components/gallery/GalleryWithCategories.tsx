"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import Image from 'next/image';
import AnimatedElement from '../common/AnimatedElement';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export default function GalleryWithCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, images]);

  const fetchData = async () => {
    try {
      // Fetch categories and images in parallel
      const [categoriesResult, imagesResult] = await Promise.all([
        supabase
          .from('gallery_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('gallery_images')
          .select(`
            *,
            gallery_categories!inner(name, slug)
          `)
          .order('created_at', { ascending: false })
      ]);

      if (categoriesResult.error) {
        console.error('Error fetching categories:', categoriesResult.error);
        setCategories([]);
      } else {
        setCategories(categoriesResult.data || []);
      }

      if (imagesResult.error) {
        console.error('Error fetching images:', imagesResult.error);
        setImages([]);
      } else {
        setImages(imagesResult.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCategories([]);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    console.log('Filtering images. Selected category:', selectedCategory);
    console.log('Available images:', images.length);
    
    if (selectedCategory === 'all') {
      console.log('Showing all images:', images.length);
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image => {
        // Check both category_id and category slug for compatibility
        return image.category_id === selectedCategory || 
               image.category === selectedCategory ||
               categories.find(cat => cat.id === image.category_id)?.slug === selectedCategory;
      });
      console.log('Filtered images:', filtered.length);
      setFilteredImages(filtered);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedElement animation="slideUp">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Gallery</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our work through images showcasing our products, services, and applications
            </p>
          </div>
        </AnimatedElement>

        {/* Category Filter */}
        <AnimatedElement animation="slideUp" delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'bg-cyan-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 shadow-md hover:shadow-lg'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">
                  ({selectedCategory === category.slug 
                    ? filteredImages.length 
                    : category.slug === 'all' 
                      ? images.length 
                      : images.filter(img => 
                          img.category_id === category.id || 
                          img.category === category.slug ||
                          categories.find(cat => cat.id === img.category_id)?.slug === category.slug
                        ).length
                  })
                </span>
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
                      <p className="text-white/80 text-xs">
                        {categories.find(cat => 
                          cat.id === image.category_id || cat.slug === image.category
                        )?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          )}
        </AnimatedElement>

        {/* Category Description */}
        {selectedCategory !== 'all' && (
          <AnimatedElement animation="slideUp" delay={0.6}>
            <div className="mt-12 text-center">
              {(() => {
                const currentCategory = categories.find(cat => cat.slug === selectedCategory);
                return currentCategory?.description ? (
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {currentCategory.description}
                  </p>
                ) : null;
              })()}
            </div>
          </AnimatedElement>
        )}
      </div>
    </div>
  );
}