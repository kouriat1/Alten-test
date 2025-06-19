'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/app/models/products/Product';
import Modal from '@/app/components/products/Modal';
import ProductForm from '@/app/components/products/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  const handleSave = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      } else {
        return [...prev, product];
      }
    });
    setShowModal(false);
    setEditedProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditedProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-gray-700 font-bold mb-4 text-center">Liste des produits</h1>

      <button
        onClick={() => {
          setEditedProduct(null);
          setShowModal(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 flex items-center mx-auto justify-center rounded hover:bg-blue-400 mb-4"
      >
        Créer produit
      </button>

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

      <div className="">
        {products.map((product) => (
          <div key={product.id} className="p-4 m-2 border rounded shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-lg font-bold text-pink-600">{product.price} €</p>
            <div className="flex gap-2 mt-4">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
