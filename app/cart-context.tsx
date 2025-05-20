'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  [key: string]: any;
}
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
}
export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
} 