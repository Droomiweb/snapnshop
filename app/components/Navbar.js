"use client";
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo'; // Import the logo

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO SECTION UPDATED */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* The SVG Logo */}
            <div className="text-brand-dark group-hover:text-brand-pink transition-colors">
                <Logo className="w-8 h-8" /> 
            </div>
            
            <div className="flex flex-col leading-none">
                <span className="font-extrabold text-xl tracking-tighter text-brand-dark">
                    snapnshop
                </span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                    India
                </span>
            </div>
          </Link>

          {/* Desktop Links (No changes needed below here) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
            <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            <Link href="/tracking" className="hover:text-brand-dark transition-colors">Track Order</Link>
            
            <div className="relative group cursor-pointer">
               <ShoppingCart className="w-6 h-6 text-gray-800" />
               <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">0</span>
            </div>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl absolute w-full">
            <Link href="/" onClick={() => setIsOpen(false)} className="block font-bold text-gray-800">Home</Link>
            <Link href="/tracking" onClick={() => setIsOpen(false)} className="block font-bold text-gray-800">Track My Order</Link>
            <Link href="/admin" onClick={() => setIsOpen(false)} className="block font-bold text-gray-400">Admin Login</Link>
        </div>
      )}
    </nav>
  );
}