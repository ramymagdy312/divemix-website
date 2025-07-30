"use client";

import { ArrowUp } from 'lucide-react';
import { useScrollVisibility } from '../hooks/useScrollVisibility';

const ScrollToTop = () => {
  const isVisible = useScrollVisibility(300);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-cyan-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-cyan-700 hover:scale-110 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTop;