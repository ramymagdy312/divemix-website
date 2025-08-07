"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching vendors:", error);
        return;
      }

      setVendors(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
              >
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We collaborate with industry-leading companies to deliver
            exceptional solutions and services to our clients.
          </p>
        </div>

        {/* Vendors Carousel */}
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {vendors.map((vendor) => (
                <CarouselItem
                  key={vendor.id}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group h-full">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-cyan-600 border-gray-200 hover:border-cyan-300" />
            <CarouselNext className="right-0 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-cyan-600 border-gray-200 hover:border-cyan-300" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
