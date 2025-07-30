import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=2000"
          alt="Industrial equipment"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-5xl font-bold mb-6">
          Innovative Gas Mixing Solutions
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          DiveMix leads the industry in gas mixing technology, providing
          precise, reliable, and safe solutions for diving operations worldwide.
        </p>
        <a
          href="/products"
          className="inline-flex items-center px-6 py-3 bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors"
        >
          View Our Products
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
