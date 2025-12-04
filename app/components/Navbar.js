"use client";
import Link from 'next/link';
import { ShoppingCart, Menu, X, ChevronDown, ShieldCheck, FileText, Truck, RefreshCw, Phone, Lock } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
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

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
            <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            <Link href="/tracking" className="hover:text-brand-dark transition-colors">Track Order</Link>
            
            {/* DROPDOWN: Help & Legal */}
            <div className="relative group">
                <button className="flex items-center gap-1 hover:text-brand-dark transition-colors py-4">
                    Help & Policies <ChevronDown size={14} />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 w-56 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    <div className="p-2 space-y-1">
                        <Link href="/policies/contact-us" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-brand-dark">
                            <Phone size={16} /> Contact Us
                        </Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <Link href="/policies/refund-policy" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-brand-dark">
                            <RefreshCw size={16} /> Returns & Refunds
                        </Link>
                        <Link href="/policies/shipping-policy" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-brand-dark">
                            <Truck size={16} /> Shipping Policy
                        </Link>
                        <Link href="/policies/privacy-policy" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-brand-dark">
                            <ShieldCheck size={16} /> Privacy Policy
                        </Link>
                        <Link href="/policies/terms-conditions" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-brand-dark">
                            <FileText size={16} /> Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="relative group cursor-pointer">
               <ShoppingCart className="w-6 h-6 text-gray-800" />
               <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">0</span>
            </div>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800 p-2">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWNN --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 shadow-xl absolute w-full max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col space-y-4">
                <Link href="/" onClick={closeMenu} className="font-bold text-gray-800 text-lg">Home</Link>
                <Link href="/tracking" onClick={closeMenu} className="font-bold text-gray-800 text-lg">Track My Order</Link>
                
                {/* Mobile Policies Section */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Legal & Support</p>
                    <Link href="/policies/contact-us" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Phone size={16} /> Contact Us
                    </Link>
                    <Link href="/policies/refund-policy" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <RefreshCw size={16} /> Returns & Refunds
                    </Link>
                    <Link href="/policies/shipping-policy" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Truck size={16} /> Shipping Policy
                    </Link>
                    <Link href="/policies/privacy-policy" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <ShieldCheck size={16} /> Privacy Policy
                    </Link>
                    <Link href="/policies/terms-conditions" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <FileText size={16} /> Terms & Conditions
                    </Link>
                </div>
            </div>
        </div>
      )}
    </nav>
  );
}