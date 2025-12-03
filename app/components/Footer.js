import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            snapnshop <span className="text-[10px] bg-white text-black px-2 rounded uppercase tracking-wider">India</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium home gadgets delivered to your doorstep. Quality checked and verified for the modern Indian home.
          </p>
        </div>

        {/* Policies (REQUIRED FOR RAZORPAY) */}
        <div>
          <h4 className="font-bold mb-4 text-gray-200">Legal & Policies</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/policies/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/policies/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
            <li><Link href="/policies/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold mb-4 text-gray-200">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/policies/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/tracking" className="hover:text-white transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Contact Info (REQUIRED FOR RAZORPAY) */}
        <div>
          <h4 className="font-bold mb-4 text-gray-200">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-2 items-center">
              <Mail size={16} className="shrink-0 text-brand-pink" /> 
              <span>support@snapnshop.com</span>
            </li>
            <li className="flex gap-2 items-center">
              <Phone size={16} className="shrink-0 text-brand-pink" /> 
              <span>+91 98765 43210</span>
            </li>
            <li className="flex gap-2 items-start">
              <MapPin size={16} className="shrink-0 text-brand-pink mt-1" /> 
              <span>123, Tech Park, Bangalore, Karnataka, 560001</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} SnapNShop India. All rights reserved.</p>
      </div>
    </footer>
  );
}