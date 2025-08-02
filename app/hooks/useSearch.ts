"use client";

import { useState, useMemo } from 'react';

export interface SearchableItem {
  [key: string]: any;
}

export const useSearch = <T extends SearchableItem>(
  items: T[],
  searchFields: (keyof T)[]
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    return items.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(lowercasedTerm);
      })
    );
  }, [items, searchTerm, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};