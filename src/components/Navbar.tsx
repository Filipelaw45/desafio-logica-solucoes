'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-secondary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg md:text-xl font-bold truncate" onClick={closeMenu}>
            Gerenciador de Usuários
          </Link>

          <div className="hidden md:flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-secondary-700' : 'hover:bg-secondary-900'
              }`}
            >
              Usuários Salvos
            </Link>
            <Link
              href="/fetch-users"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/fetch-users') ? 'bg-secondary-700' : 'hover:bg-secondary-900'
              }`}
            >
              Buscar Novos Usuários
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-secondary-500 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-2 space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/') ? 'bg-secondary-700' : 'hover:bg-secondary-900'
              }`}
            >
              Usuários Salvos
            </Link>
            <Link
              href="/fetch-users"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/fetch-users') ? 'bg-secondary-700' : 'hover:bg-secondary-900'
              }`}
            >
              Buscar Novos Usuários
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
