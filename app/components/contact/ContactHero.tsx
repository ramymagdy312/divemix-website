import React from 'react';
import Image from 'next/image';

interface ContactHeroProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
}

const ContactHero = ({ 
  title = "We're Here to Help", 
  description = "Get in touch with our team of experts for all your gas mixing and compressor needs",
  backgroundImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000"
}: ContactHeroProps) => {
  return (
    <div className="relative bg-cyan-900 text-white py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Contact background"
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
        <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ContactHero;