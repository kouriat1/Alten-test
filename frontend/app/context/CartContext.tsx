'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCart = async () => {
    console.log('[CartProvider] fetchCart: début');
    const token = localStorage.getItem('token');
    console.log('[CartProvider] token:', token);
    if (!token) {
      console.log('[CartProvider] Pas de token, panier non chargé');
      setCart([]);
      setTotalItems(0);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[CartProvider] fetchCart réponse status:', res.status);
      if (!res.ok) throw new Error('Erreur récupération panier');
      const data = await res.json();
      console.log('[CartProvider] fetchCart données:', data);
      setCart(data);
      const total = data.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      console.log('[CartProvider] Total items calculé:', total);
      setTotalItems(total);
    } catch (error) {
      console.error('[CartProvider] fetchCart erreur:', error);
    }
  };

  useEffect(() => {
    console.log('[CartProvider] useEffect montage, chargement panier...');
    fetchCart();
  }, []);

  const refreshCart = async () => {
    console.log('[CartProvider] refreshCart appelée');
    await fetchCart();
  };

  const addToCart = async (productId: number) => {
    console.log('[CartProvider] addToCart appelé avec productId:', productId);
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[CartProvider] addToCart: pas de token');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[CartProvider] addToCart réponse status:', res.status);
      if (!res.ok) throw new Error('Erreur ajout panier');
      await fetchCart(); // refresh local state et total
    } catch (err) {
      console.error('[CartProvider] addToCart erreur:', err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    console.log('[CartProvider] removeFromCart appelé avec cartItemId:', cartItemId);
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[CartProvider] removeFromCart: pas de token');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[CartProvider] removeFromCart réponse status:', res.status);
      if (!res.ok) throw new Error('Erreur suppression panier');
      await fetchCart();
    } catch (err) {
      console.error('[CartProvider] removeFromCart erreur:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, totalItems, refreshCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};
