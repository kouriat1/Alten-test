'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';

export default function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow border-b bg-white">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={80} height={40} />
      </div>

   
      <h1 className="text-lg font-medium text-gray-800">ALTEN SHOP</h1>

      <Link href="/cart" className="relative">
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        {totalItems  > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full px-1.5">
            {totalItems }
          </span>
        )}
      </Link>
    </header>
  );
}
