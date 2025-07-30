import React from "react";
import Image from 'next/image';

const ServiceHero: React.FC = () => {
  return (
    <div className="relative bg-cyan-900 text-white py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=2000"
          alt="Service background"
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
        <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
          Comprehensive solutions for all your gas mixing and compression needs,
          backed by decades of expertise and cutting-edge technology
        </p>
      </div>
    </div>
  );
};

export default ServiceHero;
