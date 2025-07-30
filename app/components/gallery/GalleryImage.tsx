"use client";

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { GalleryImage as GalleryImageType } from '../../types/gallery';
import Image from 'next/image';

interface GalleryImageProps {
  image: GalleryImageType;
  onClick: () => void;
}

const GalleryImage = forwardRef<HTMLDivElement, GalleryImageProps>(
  ({ image, onClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className="cursor-pointer group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
      >
        <Image
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {image.title}
            </h3>
            <p className="text-white/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              {image.category}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
);

GalleryImage.displayName = 'GalleryImage';

export default GalleryImage;