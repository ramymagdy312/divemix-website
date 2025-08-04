"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export default function VendorsSlider() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching vendors:', error);
        return;
      }

      setVendors(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === vendors.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? vendors.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    if (vendors.length > 1) {
      const interval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
      return () => clearInterval(interval);
    }
  }, [vendors.length]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (vendors.length === 0) {
    return null;
  }

  // Calculate how many vendors to show at once
  const vendorsPerSlide = {
    mobile: 2,
    tablet: 3,
    desktop: 5
  };

  const getVisibleVendors = () => {
    const visibleCount = vendorsPerSlide.desktop;
    const visible = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % vendors.length;
      visible.push(vendors[index]);
    }
    
    return visible;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We collaborate with industry-leading companies to deliver exceptional solutions and services to our clients.
          </p>
        </div>

        {/* Vendors Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          {vendors.length > vendorsPerSlide.desktop && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 text-gray-600 hover:text-cyan-600"
                aria-label="Previous vendors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 text-gray-600 hover:text-cyan-600"
                aria-label="Next vendors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Vendors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {getVisibleVendors().map((vendor, index) => (
              <div
                key={`${vendor.id}-${index}`}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                {/* Vendor Logo */}
                <div className="relative h-16 mb-4 flex items-center justify-center">
                  <Image
                    src={vendor.logo_url}
                    alt={`${vendor.name} logo`}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
                  />
                </div>

                {/* Vendor Name */}
                <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                  {vendor.name}
                </h3>

                {/* Vendor Description */}
                {vendor.description && (
                  <p className="text-xs text-gray-600 text-center mb-3 line-clamp-2">
                    {vendor.description}
                  </p>
                )}

                {/* Website Link */}
                {vendor.website_url && (
                  <div className="text-center">
                    <a
                      href={vendor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-cyan-600 hover:text-cyan-700 transition-colors duration-200"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {vendors.length > vendorsPerSlide.desktop && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(vendors.length / vendorsPerSlide.desktop) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * vendorsPerSlide.desktop)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    Math.floor(currentIndex / vendorsPerSlide.desktop) === index
                      ? 'bg-cyan-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Responsive Grid (Hidden on larger screens) */}
        <div className="lg:hidden mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendors.slice(0, 4).map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={vendor.logo_url}
                      alt={`${vendor.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {vendor.name}
                    </h3>
                    {vendor.description && (
                      <p className="text-xs text-gray-600 truncate">
                        {vendor.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {vendors.length > 4 && (
            <div className="text-center mt-6">
              <button
                onClick={() => {/* Add modal or expand functionality */}}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                View All Partners ({vendors.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}