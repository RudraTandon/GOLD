"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity?: number;
  }) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  toast: { message: string; visible: boolean } | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: 'luxe-royal-gold',
    name: 'TANDO Luxe Royal Gold Watch Combo',
    price: 499,
    quantity: 1,
    image: '/gold-combo.jpg',
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(DEFAULT_ITEMS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tando_cart_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tando_cart_v1', JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  }, [items, isLoaded]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 2800);
  };

  const addToCart = (product: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity?: number;
  }) => {
    const qtyToAdd = Math.max(1, product.quantity || 1);

    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + qtyToAdd } : it
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: qtyToAdd,
          image: product.image,
        },
      ];
    });

    showToast(`Added "${product.name.split('—')[0].trim()}" to Cart! ✨`);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: newQuantity } : it))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
        subtotal,
        toast,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toast && toast.visible && (
        <div className="cart-toast animate-slide-up" role="status" aria-live="polite">
          <span className="toast-icon">🛍️</span>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
