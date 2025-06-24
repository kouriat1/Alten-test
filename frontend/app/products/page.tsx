'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/app/models/products/Product';
import Modal from '@/app/components/products/Modal';
import ProductForm from '@/app/components/products/ProductForm';
import { useCart } from '@/app/context/CartContext';
 import { jwtDecode } from "jwt-decode";
import { addToCartApi } from '../utils/cartapi';


interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
  sub: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserEmail(decoded.email);

        fetch('http://localhost:3000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setProducts(data))
          .catch((err) => console.error("Erreur chargement produits:", err));
      } catch (err) {
        console.error("Erreur lors du décodage du token", err);
      }
    }
  }, []);

  const isAdmin = userEmail === "admin@admin.com";

  const handleSave = async (product: Product) => {
    const token = localStorage.getItem('token');
    try {
      let savedProduct: Product;
      if (product.id === undefined) {
        const res = await fetch('http://localhost:3000/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        });
        if (!res.ok) throw new Error('Erreur création produit');
        savedProduct = await res.json();
      } else {
        const res = await fetch(`http://localhost:3000/products/${product.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        });
        if (!res.ok) throw new Error('Erreur mise à jour produit');
        savedProduct = await res.json();
      }

      setProducts((prev) => {
        const exists = prev.find((p) => p.id === savedProduct.id);
        if (exists) {
          return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
        } else {
          return [...prev, savedProduct];
        }
      });

      setShowModal(false);
      setEditedProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression produit", err);
    }
  };

    const handleAddToCart = async (product: Product) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Vous devez être connecté pour ajouter au panier.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Erreur ajout panier');
    }
    
    alert(`Produit "${product.name}" ajouté au panier !`);
  } catch (error) {
    alert(`Erreur ajout au panier: ${(error as Error).message}`);
  }
};

  

  return (
    <div>
      <h1 className="text-3xl text-gray-700 font-bold mb-4 text-center">Liste des produits</h1>

      {isAdmin && (
        <button
          onClick={() => {
            setEditedProduct(null);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 flex items-center mx-auto justify-center rounded hover:bg-blue-400 mb-4"
        >
          Créer produit
        </button>
      )}

      {showModal && (
        <Modal
          title={editedProduct ? 'Modifier un produit' : 'Créer un produit'}
          onClose={() => {
            setShowModal(false);
            setEditedProduct(null);
          }}
        >
          <ProductForm
            initialProduct={editedProduct || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowModal(false);
              setEditedProduct(null);
            }}
          />
        </Modal>
      )}

      <div>
        {products.map((product) => (
          <div key={product.id} className="p-4 m-2 border rounded shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-lg font-bold text-pink-600">{product.price} €</p>

            <div className="flex gap-2 mt-4">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700"
                >
                  Ajouter au panier
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
