"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Star, Check, ShieldCheck, Truck, Clock, Battery, ChevronDown, ChevronUp, Instagram, Facebook, Twitter, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ... (Keep existing Product & FAQ data) ...
const product = {
  name: "SnapNShop Wireless Mini Chopper",
  price: 24.99,
  originalPrice: 49.99,
  sku: "SNS-MINI-PK01",
  rating: 4.8,
  reviews: 1240,
  stock: 15, 
  specs: {
    height: "130mm / 5.1in",
    width: "92mm / 3.6in",
    capacity: "250ml",
    battery: "USB Rechargeable",
    blades: "304 Stainless Steel"
  }
};

// ... (Keep existing Mock Data & Helper functions) ...
// Copy the faqs array and formatTime function from your original file

const faqs = [
  { q: "Is the cup dishwasher safe?", a: "Yes! The clear container and blades are top-rack dishwasher safe. Just wipe the motor head with a damp cloth." },
  { q: "How long does the battery last?", a: "A single 2-hour charge lasts for approximately 35+ uses." },
  { q: "Can it chop nuts and ice?", a: "It is perfect for nuts, peppers, garlic, and veggies. We do not recommend large ice cubes to preserve blade sharpness." },
  { q: "What is the warranty?", a: "We offer a 30-day money-back guarantee and a 1-year manufacturer warranty on the motor." }
];

export default function LandingPage() {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3600 * 4);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const handleBuyNow = () => {
     router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-24 md:pb-0 font-sans">
      {/* ... (Keep existing Header) ... */}
       <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-extrabold text-2xl tracking-tighter text-brand-dark cursor-pointer">snapnshop</div>
          <div className="flex items-center gap-4">
             {/* Disclaimer Badge */}
             <span className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-1 rounded">Direct from Warehouse</span>
            <div className="relative cursor-pointer hover:scale-105 transition-transform">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* ... (Keep Product Media - Left Side) ... */}
           <div className="space-y-4">
            <div className="relative aspect-square bg-brand-bg rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center text-brand-dark/20">
                    <Image 
                      src="/chopper.webp" 
                      alt="SnapNShop Mini Chopper" 
                      width={600} 
                      height={600}
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      priority
                    />
                </div>
                <div className="absolute top-4 left-4 bg-brand-dark text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                    50% OFF TODAY
                </div>
            </div>
          </div>

          {/* --- Right: Product Details --- */}
          <div className="flex flex-col justify-center">
             {/* ... (Keep Title, Price, Specs) ... */}
            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-sm font-medium text-gray-500">{product.reviews} reviews</span>
            </div>

            <div className="bg-brand-bg/50 p-5 rounded-2xl border border-brand-pink/20 mb-8 backdrop-blur-sm">
                <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-black text-gray-900 tracking-tight">${product.price}</span>
                    <span className="text-xl text-gray-400 line-through decoration-brand-dark decoration-2">${product.originalPrice}</span>
                </div>
            </div>

            {/* --- NEW: Shipping Disclaimer --- */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex gap-3 text-sm text-blue-800">
               <Info className="shrink-0 text-blue-500" size={20} />
               <div>
                 <p className="font-bold mb-1">Shipping Information</p>
                 <p className="opacity-80">
                   Orders are processed manually within <span className="font-bold">2–5 business days</span>. 
                   Standard shipping takes <span className="font-bold">7–14 days</span>. 
                   You will receive a tracking email once your order leaves the warehouse.
                 </p>
               </div>
            </div>

            {/* ... (Keep Volume Upsell & CTA) ... */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                     <div className="flex items-center border-2 border-gray-200 rounded-xl h-14 w-32 justify-between px-2 bg-white">
                        <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-full text-gray-500 hover:text-brand-dark text-xl font-bold">-</button>
                        <span className="font-bold text-lg">{qty}</span>
                        <button onClick={() => setQty(q => q+1)} className="w-8 h-full text-gray-500 hover:text-brand-dark text-xl font-bold">+</button>
                    </div>
                    <button onClick={handleBuyNow} className="flex-1 bg-brand-dark hover:bg-brand-pink text-white h-14 rounded-xl font-bold text-xl shadow-lg shadow-brand-pink/40 transition-all hover:-translate-y-1">
                        Add to Cart - ${(qty === 2 ? 45.00 : qty === 3 ? 60.00 : product.price * qty).toFixed(2)}
                    </button>
                </div>
            </div>

          </div>
        </div>
        
        {/* ... (Keep Trust Badges, FAQ, Footer) ... */}
        {/* Simplified for brevity, assume previous content remains */}
        <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-black text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-white transition-colors text-left font-bold"
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
      
       {/* --- Sticky Mobile Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-8">
        <div className="flex gap-3 h-14">
            <div className="flex items-center border border-gray-300 rounded-xl w-28 justify-between px-3 bg-gray-50">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="text-2xl text-gray-500 pb-1">-</button>
                <span className="font-bold text-lg text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => q+1)} className="text-2xl text-gray-500 pb-1">+</button>
            </div>
            <button 
                onClick={handleBuyNow}
                className="flex-1 bg-brand-dark text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-pink/50 active:scale-95 transition-transform"
            >
                Add - ${(qty === 2 ? 45.00 : qty === 3 ? 60.00 : product.price * qty).toFixed(2)}
            </button>
        </div>
      </div>

    </div>
  );
}