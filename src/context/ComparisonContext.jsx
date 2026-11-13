import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { getCatalogProducts } from '../services/productService';

const ComparisonContext = createContext(null);

const STORAGE_KEY = 'SMARTSHOP_COMPARISON_ITEMS';

export function ComparisonProvider({ children }) {
  const { toast } = useToast();
  const [comparisonItems, setComparisonItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids)) {
          const catalog = getCatalogProducts();
          return catalog.filter((p) => ids.includes(p.id));
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved comparison:', e);
    }
    // Default initial compare pair for instant demonstration
    const catalog = getCatalogProducts();
    return catalog.filter((p) => ['macbook-air-m3-13', 'dell-xps-13-9340'].includes(p.id));
  });

  const [isBarOpen, setIsBarOpen] = useState(true);

  // Sync to local storage
  useEffect(() => {
    try {
      const ids = comparisonItems.map((p) => p.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save comparison to localStorage:', e);
    }
  }, [comparisonItems]);

  const isInComparison = (productId) => {
    return comparisonItems.some((item) => item.id === productId);
  };

  const addToComparison = (product) => {
    if (!product) return false;

    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
      return false;
    }

    if (comparisonItems.length >= 4) {
      toast.warning('Comparison tray is full. You can compare up to 4 products at once.', 'Limit Reached');
      return false;
    }

    setComparisonItems((prev) => [...prev, product]);
    toast.success(`Added ${product.name.split('(')[0]} to comparison (${comparisonItems.length + 1}/4)`, 'Added to Compare');
    setIsBarOpen(true);
    return true;
  };

  const removeFromComparison = (productId) => {
    setComparisonItems((prev) => {
      const filtered = prev.filter((item) => item.id !== productId);
      return filtered;
    });
    toast.info('Item removed from comparison.', 'Removed');
  };

  const clearComparison = () => {
    setComparisonItems([]);
    toast.info('Comparison list cleared.', 'Cleared');
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonItems,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        isBarOpen,
        setIsBarOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
