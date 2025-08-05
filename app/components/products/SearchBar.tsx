"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search categories..." 
}) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl group-hover:border-cyan-300"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within:text-cyan-600">
          <div className="relative">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-cyan-600 transition-colors duration-300" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
          </div>
        </div>
        
        {/* Search suggestions indicator */}
        {value && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse" />
          </div>
        )}
        
        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      </div>
      
      {/* Search tips */}
      {!value && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            Try searching for specific categories or keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;