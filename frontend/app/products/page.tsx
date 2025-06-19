'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/app/models/products/Product';

const ProductsPage = () => {
      const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
    return (
        <div>
            <h1>Products LIST</h1>
         <div className="flex-row">
            {products.map((product) => (
                <div key={product.id} className="border p-4 m-2 rounded shadow">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-700">{product.description}</p>
                    <p className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</p>
                </div>
            ))}
           </div>
            
        </div>
    );
};

export default ProductsPage;