'use client';

import React, { useState } from 'react';
import { Product } from '@/app/models/products/Product';

type Props = {
  initialProduct?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
};

export default function ProductForm({ initialProduct, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Product>(
    initialProduct || {
      id: Date.now(),
      code: '',
      name: '',
      description: '',
      image: '',
      price: 0,
      category: '',
      quantity: 0,
      internalReference: '',
      shellId: 0,
      inventoryStatus: 'INSTOCK',
      rating: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Nom</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Prix</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Catégorie</label>
        <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="">-- Choisir une catégorie --</option>
          <option value="Accessories">Accessories</option>
          <option value="Fitness">Fitness</option>
          <option value="Clothing">Clothing</option>
          <option value="Electonics">Electonics</option>
        </select>
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onCancel} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Annuler</button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enregistrer</button>
      </div>
    </form>
  );
}
