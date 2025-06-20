'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/app/models/products/Product';
import Modal from '@/app/components/products/Modal';
import ProductForm from '@/app/components/products/ProductForm';
import { useCart } from '@/app/context/CartContext';
import { jwtDecode } from "jwt-decode";

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

  const { addToCart } = useCart();

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

  const handleSave = (product: Product) => {
    const exists = products.find((p) => p.id === product.id);
    setProducts((prev) =>
      exists ? prev.map((p) => (p.id === product.id ? product : p)) : [...prev, product]
    );
    setShowModal(false);
    setEditedProduct(null);
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
  console.log("Produits:", products);
  console.log("Email utilisateur:", userEmail);
  console.log("Est admin:", isAdmin);
  console.log("Token:", localStorage.getItem('token'));

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
                  onClick={() => addToCart(product)}
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
