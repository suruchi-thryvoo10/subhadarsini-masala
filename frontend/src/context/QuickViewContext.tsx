import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Product } from '../types';

interface QuickViewContextValue {
  product: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | undefined>(undefined);

/**
 * Holds the product currently shown in the quick-view modal.
 *
 * Kept in context rather than passed down so any ProductCard — on the catalogue,
 * the homepage, a category page or the wishlist — can open it without every
 * page having to own and thread the state.
 */
export const QuickViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [product, setProduct] = useState<Product | null>(null);

  const openQuickView = useCallback((next: Product) => setProduct(next), []);
  const closeQuickView = useCallback(() => setProduct(null), []);

  const value = useMemo(
    () => ({ product, openQuickView, closeQuickView }),
    [product, openQuickView, closeQuickView]
  );

  return <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>;
};

export const useQuickView = (): QuickViewContextValue => {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error('useQuickView must be used within a QuickViewProvider');
  return ctx;
};
