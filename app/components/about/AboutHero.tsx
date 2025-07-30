import React from 'react';
import Image from 'next/image';

const AboutHero = () => {
  return (
    <div className="relative bg-teal-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block">DiveMix</span>
                  <span className="block text-teal-400">Specialized in gas and compressor technologies</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <Image
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://divemix-website.vercel.app/_next/image?url=%2Fimg%2Fcar.jpg&w=1920&q=75"
          alt="DiveMix service vehicle"
          fill
        />
      </div>
    </div>
  );
};

export default AboutHero;