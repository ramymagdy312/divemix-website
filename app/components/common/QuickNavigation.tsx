"use client";

import React from 'react';
import { ArrowUp, ArrowDown, Home, Search } from 'lucide-react';

interface QuickNavigationProps {
  showBackToTop?: boolean;
  onBackToTop?: () => void;
  onScrollToSearch?: () => void;
  className?: string;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({
  showBackToTop = true,
  onBackToTop,
  onScrollToSearch,
  className = ""
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onBackToTop?.();
  };

  const scrollToSearch = () => {
    const searchElement = document.querySelector('[data-search]');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
    onScrollToSearch?.();
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col space-y-3 ${className}`}>
      {/* Search Button */}
      <button
        onClick={scrollToSearch}
        className="group w-12 h-12 bg-white shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-cyan-300"
        title="Go to search"
      >
        <Search className="w-5 h-5 text-gray-600 group-hover:text-cyan-600 transition-colors duration-300" />
      </button>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="group w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:from-cyan-600 hover:to-blue-700"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5 text-white group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
};

export default QuickNavigation;