'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/app/models/products/Product';

const ProductsPage = () => {
      const [products, setProducts] = useState<Product[]>([]);

  const handleDelete = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

    useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
    return (
        <div>
        <h1 className="text-3xl text-gray-500 flex font-bold mb-4 justify-center items-center">Liste des produits</h1>
            <button className="bg-blue-500 text-white px-4 py-2 flex  items-center mx-auto justify-center rounded hover:bg-blue-400 mb-4">
                Ajouter un produit  
            </button>
         <div className="flex-row">
            {products.map((product) => (
                <div key={product.id} className=" p-4 m-2 rounded shadow-md">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-700">{product.description}</p>
                    <p className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</p>
                    <div className="flex gap-2 mt-4">
                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
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
};

export default ProductsPage;