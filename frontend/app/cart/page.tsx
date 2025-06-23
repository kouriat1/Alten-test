'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { CartItem } from '@/app/models/cart/CartItem';

export default function CartPage() {
const [cart, setCart] = useState<CartItem[]>([]);
  const { removeFromCart: removeFromCartContext, clearCart: clearCartContext } = useCart();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch('http://localhost:3000/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur chargement panier');
      return res.json();
    })
    .then((data: CartItem[]) => setCart(data))
    .catch(err => console.error(err));
}, []);


  const handleRemove = async (productId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3000/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur suppression produit');
        setCart(prev => prev.filter(item => item.product.id !== productId));
      removeFromCartContext(productId); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3000/cart/clear', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur vidage panier');
      setCart([]);
      clearCartContext();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mon panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
  <li key={item.id} className="border p-4 rounded shadow">
    <div className="flex justify-between">
      <span>
        {item.product.id}  {item.product.name} ({item.quantity}) — {item.product.price} €
      </span>
            <button
              onClick={() => handleRemove(item.product.id)}
              className="text-red-600 hover:underline"
            >
              Retirer
            </button>
          </div>
        </li>
      ))}
          </ul>
          <button
            onClick={handleClear}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}
