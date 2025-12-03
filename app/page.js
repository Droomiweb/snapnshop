"use client";
import { useState, useEffect } from "react";
import { Star, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useRouter } from "next/navigation";

const faqs = [
  { q: "Is cash on delivery available?", a: "Currently we only accept online payments for faster processing." },
  { q: "How long does delivery take?", a: "Standard delivery across India takes 5-7 working days." },
  { q: "Is there a warranty?", a: "Yes, 6 months warranty on the motor." }
];

export default function LandingPage() {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New State for Gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetch('/api/product')
      .then(res => res.json())
      .then(data => {
        // Ensure images array exists, fallback to chopper.webp if broken
        if(!data.images || data.images.length === 0) data.images = ['/chopper.webp'];
        setProduct(data);
        setLoading(false);
      });
  }, []);

  const handleBuyNow = () => {
     router.push(`/checkout?qty=${qty}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Amazing Deals...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-24 md:pb-0 font-sans">
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* --- LEFT: GALLERY --- */}
           <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-brand-bg rounded-3xl overflow-hidden border-4 border-white shadow-xl group">
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.name} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                
                {product.originalPrice > product.price && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                )}
            </div>

            {/* Thumbnails (Only show if > 1 image) */}
            {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIndex === idx ? 'border-brand-dark ring-2 ring-brand-dark/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* --- RIGHT: DETAILS --- */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-sm font-medium text-gray-500">2,400+ Happy Indians</span>
            </div>

            <div className="bg-brand-bg/50 p-5 rounded-2xl border border-brand-pink/20 mb-8 backdrop-blur-sm">
                <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-black text-gray-900 tracking-tight">₹{product.price}</span>
                    <span className="text-xl text-gray-400 line-through decoration-brand-dark decoration-2">₹{product.originalPrice}</span>
                </div>
                <p className="text-sm text-green-700 font-bold">Inclusive of all taxes</p>
            </div>

            {/* Shipping Info */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex gap-3 text-sm text-blue-800">
               <Info className="shrink-0 text-blue-500" size={20} />
               <div>
                 <p className="font-bold mb-1">Fast Delivery</p>
                 <p className="opacity-80">
                   Dispatched within 24 hours. Delivered in <span className="font-bold">3-5 days</span> via BlueDart/Delhivery.
                 </p>
               </div>
            </div>

            {/* Qty & CTA */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                     <div className="flex items-center border-2 border-gray-200 rounded-xl h-14 w-32 justify-between px-2 bg-white">
                        <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-full text-gray-500 font-bold text-xl">-</button>
                        <span className="font-bold text-lg">{qty}</span>
                        <button onClick={() => setQty(q => q+1)} className="w-8 h-full text-gray-500 font-bold text-xl">+</button>
                    </div>
                    <button onClick={handleBuyNow} className="flex-1 bg-brand-dark hover:bg-brand-pink text-white h-14 rounded-xl font-bold text-xl shadow-lg transition-all hover:-translate-y-1">
                        Buy Now - ₹{(product.price * qty).toLocaleString('en-IN')}
                    </button>
                </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-black text-center mb-8">FAQ</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-white text-left font-bold"
                        >
                            {faq.q}
                            {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {openFaq === i && (
                            <div className="p-4 bg-white text-gray-600 border-t border-gray-100">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <button onClick={handleBuyNow} className="w-full bg-brand-dark text-white rounded-xl font-bold text-lg py-3 shadow-lg">
            Buy Now - ₹{(product.price * qty).toLocaleString('en-IN')}
        </button>
      </div>
    </div>
  );
}