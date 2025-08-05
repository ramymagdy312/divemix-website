"use client";

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedElement from '../common/AnimatedElement';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface ProductFiltersProps {
  features: string[];
  onFilterChange: (filters: string[]) => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  features,
  onFilterChange,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Create filter options from unique features
  const filterOptions: FilterOption[] = features.reduce((acc, feature) => {
    const existing = acc.find(item => item.id === feature);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ id: feature, label: feature, count: 1 });
    }
    return acc;
  }, [] as FilterOption[]).sort((a, b) => b.count - a.count);

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };

  if (filterOptions.length === 0) return null;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Filter by Features</h3>
            {selectedFilters.length > 0 && (
              <p className="text-sm text-cyan-600">{selectedFilters.length} filters active</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedFilters.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
            >
              Clear all
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <AnimatedElement animation="slideUp">
          <div className="px-4 pb-4 space-y-3 max-h-64 overflow-y-auto">
            {filterOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-200"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(option.id)}
                    onChange={() => handleFilterToggle(option.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedFilters.includes(option.id)
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-500'
                      : 'border-gray-300 group-hover:border-cyan-400'
                  }`}>
                    {selectedFilters.includes(option.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm transition-colors duration-200 ${
                    selectedFilters.includes(option.id) 
                      ? 'text-cyan-700 font-medium' 
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {option.label}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                    selectedFilters.includes(option.id)
                      ? 'bg-cyan-100 text-cyan-700'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  }`}>
                    {option.count}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </AnimatedElement>
      )}

      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedFilters.map((filterId) => {
              const option = filterOptions.find(opt => opt.id === filterId);
              if (!option) return null;
              
              return (
                <div
                  key={filterId}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 px-3 py-1 rounded-full text-sm border border-cyan-200"
                >
                  <span>{option.label}</span>
                  <button
                    onClick={() => handleFilterToggle(filterId)}
                    className="w-4 h-4 rounded-full bg-cyan-200 hover:bg-cyan-300 flex items-center justify-center transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;