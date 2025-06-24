'use client';

import React, { useState } from 'react';

// Interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  code: string;
  category: string;
  internalReference: string;
  shellId: number;
  rating: number;
  inventoryStatus: string;
}

export type NewProduct = Omit<Product, 'id'>;

type Props = {
  initialProduct?: Partial<Product>;
  onSave: (product: NewProduct | Product) => void;
  onCancel: () => void;
};

export default function ProductForm({ initialProduct, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<Product>>(
    initialProduct || {
      code: '',
      name: '',
      description: '',
      image: '',
      price: 0,
      category: '',
      quantity: 0,
      internalReference: '',
      shellId: 0,
      rating: 0,
      inventoryStatus: 'INSTOCK',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['price', 'quantity', 'shellId', 'rating'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as Product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1 font-medium">Nom</label>
        <input
          name="name"
          value={form.name || ''}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Prix</label>
        <input
          type="number"
          name="price"
          value={form.price ?? 0}
          onChange={handleChange}
          required
          min={0}
          step="0.01"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={form.description || ''}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Catégorie</label>
        <select
          name="category"
          value={form.category || ''}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Choisir une catégorie --</option>
          <option value="Accessories">Accessories</option>
          <option value="Fitness">Fitness</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
        </select>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
