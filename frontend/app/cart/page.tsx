'use client';

import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

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
                    {item.name} ({item.quantity}) — {item.price} €
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={clearCart}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}
