import React from "react";
import Image from 'next/image';

const ApplicationHero: React.FC = () => {
  return (
    <div className="relative bg-cyan-900 text-white py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1581094794329-c8112c4e5190?auto=format&fit=crop&w=2000"
          alt="Applications background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Applications</h1>
        <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
          Discover how our innovative solutions serve diverse industries with precision and reliability
        </p>
      </div>
    </div>
  );
};

export default ApplicationHero;