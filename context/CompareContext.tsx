'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, StrapiDataItem } from '@/lib/types';

interface CompareContextType {
  compareItems: StrapiDataItem<Product>[];
  addToCompare: (product: StrapiDataItem<Product>) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<StrapiDataItem<Product>[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('compareItems');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse compare items', e);
        }
      }
    }
    return [];
  });

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product: StrapiDataItem<Product>) => {
    setCompareItems((prev) => {
      // Check if already exists
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }

      // Check category match
      if (prev.length > 0) {
        const existingCategory = prev[0].attributes?.category?.data?.attributes?.slug;
        const newCategory = product.attributes?.category?.data?.attributes?.slug;
        
        if (existingCategory && newCategory && existingCategory !== newCategory) {
          alert('لا يمكن مقارنة منتجات من فئات مختلفة. يرجى مسح قائمة المقارنة أولاً.');
          return prev;
        }
      }

      // Check limit
      if (prev.length >= 2) {
        alert('يمكنك مقارنة منتجين كحد أقصى.');
        return prev;
      }

      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: number) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
