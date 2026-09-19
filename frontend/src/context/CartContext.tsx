import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variantSize: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantSize: string) => void;
  updateQuantity: (productId: string, variantSize: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('subhadarshini_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('subhadarshini_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, variantSize: string, quantity = 1) => {
    const variant = product.variants.find((v) => v.size === variantSize) || product.variants[0];
    const unitPrice = variant.discountPrice || variant.price;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product._id && item.variantSize === variantSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prevCart, { productId: product._id, product, variantSize, quantity, unitPrice }];
    });
  };

  const removeFromCart = (productId: string, variantSize: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantSize === variantSize)));
  };

  const updateQuantity = (productId: string, variantSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantSize === variantSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
