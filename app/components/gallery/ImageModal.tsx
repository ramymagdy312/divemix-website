import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '../../types/gallery';

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
}

const ImageModal = ({ image, onClose, onNext, onPrevious, hasNext }: ImageModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasNext) onPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious, hasNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 transition-colors"
      >
        <X className="h-8 w-8" />
      </button>

      <div 
        className="h-full flex items-center justify-center p-4"
        onClick={e => e.stopPropagation()}
      >
        {hasNext && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 text-white/80 hover:text-white p-2 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 text-white/80 hover:text-white p-2 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        <div className="max-w-7xl mx-auto">
          <motion.img
            key={image.url}
            src={image.url}
            alt={image.title}
            className="max-h-[85vh] max-w-full object-contain mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="text-center mt-4">
            <h3 className="text-white text-xl font-semibold">{image.title}</h3>
            <p className="text-white/80 mt-1">{image.category}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageModal;