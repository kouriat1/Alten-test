'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Barcode, Mail } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const menu = [
    { label: 'Accueil', icon: <Home size={18} />, href: '/' },
    { label: 'Produits', icon: <Barcode size={18} />, href: '/products' },
    { label: 'Contact', icon: <Mail size={18} />, href: '/contact' },

  ]

  return (
    <aside className="w-64 h-screen border-r bg-white p-4 shadow-md">
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-pink-100 transition shadow-sm ${
              pathname === item.href ? 'bg-pink-200 font-semibold' : ''
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
