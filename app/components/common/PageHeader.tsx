"use client";

import React from 'react';
import Image from 'next/image';
import AnimatedElement from './AnimatedElement';

interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, backgroundImage }) => {
  return (
    <div className={`relative py-24 ${backgroundImage ? 'text-white' : 'bg-gradient-to-r from-cyan-900 to-cyan-700 text-white'}`}>
      {backgroundImage && (
        <>
          <div className="absolute inset-0">
            <Image src={backgroundImage} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
        </>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedElement animation="slideUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">{description}</p>
          )}
        </AnimatedElement>
      </div>
    </div>
  );
};

export default PageHeader;