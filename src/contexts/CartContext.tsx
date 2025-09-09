'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string; // Unique identifier for cart item
  ticketGroupId: number;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  city?: string;
  state?: string;
  section: string;
  row: string;
  seat?: string;
  quantity: number;
  pricePerTicket: number;
  totalPrice: number;
  format: string;
  image?: string;
  eventType?: string;
  addedAt: string; // ISO timestamp
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  loading: boolean;
  
  // Cart operations
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Utility functions
  getItemCount: () => number;
  isItemInCart: (ticketGroupId: number) => boolean;
  getCartItem: (itemId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tixport_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('tixport_cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, loading]);

  // Calculate cart summary
  const summary: CartSummary = React.useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const serviceFee = subtotal * 0.1; // 10% service fee
    const deliveryFee = items.length > 0 ? 4.99 : 0;
    const discount = 0; // Will be calculated based on promo codes
    const total = subtotal + serviceFee + deliveryFee - discount;

    return {
      itemCount,
      subtotal,
      serviceFee,
      deliveryFee,
      discount,
      total
    };
  }, [items]);

  // Add item to cart
  const addItem = useCallback((newItem: Omit<CartItem, 'id' | 'addedAt'>) => {
    // Check if item with same ticket group is already in cart
    const existingItemIndex = items.findIndex(
      item => item.ticketGroupId === newItem.ticketGroupId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      setItems(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { 
              ...item, 
              quantity: item.quantity + newItem.quantity,
              totalPrice: (item.quantity + newItem.quantity) * item.pricePerTicket
            }
          : item
      ));
    } else {
      // Add new item
      const cartItem: CartItem = {
        ...newItem,
        id: `${newItem.ticketGroupId}_${Date.now()}`,
        addedAt: new Date().toISOString()
      };
      setItems(prev => [...prev, cartItem]);
    }
  }, [items]);

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            quantity,
            totalPrice: quantity * item.pricePerTicket
          }
        : item
    ));
  }, [removeItem]);

  // Clear all items from cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Get total item count
  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Check if item is in cart
  const isItemInCart = useCallback((ticketGroupId: number) => {
    return items.some(item => item.ticketGroupId === ticketGroupId);
  }, [items]);

  // Get specific cart item
  const getCartItem = useCallback((itemId: string) => {
    return items.find(item => item.id === itemId);
  }, [items]);

  const value: CartContextType = {
    items,
    summary,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    isItemInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
