'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// تحديث الواجهة لتكون مرنة وخالية تماماً من any
export interface CartItem {
  id: number | string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  // إبقاء attributes اختيارية لدعم التوافقية مع الأنظمة القديمة والجديدة دون تعارض
  attributes?: {
    name: string;
    price: number;
    images?: Record<string, unknown> | Record<string, unknown>[];
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number | string) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: number | string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // الحساب الذكي والهجين للمجموع لضمان عدم حدوث خطأ NaN أو undefined
  const total = items.reduce((sum, item) => {
    const price = item.price ?? item.attributes?.price ?? 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};