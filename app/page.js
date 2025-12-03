"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Star, Check, ShieldCheck, Truck, Clock, Battery, ChevronDown, ChevronUp, Instagram, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- Mock Data ---
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
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-extrabold text-2xl tracking-tighter text-brand-dark cursor-pointer">snapnshop</div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Free Shipping Unlocked</span>
            <div className="relative cursor-pointer hover:scale-105 transition-transform">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* --- Left: Product Media --- */}
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
            {/* Social Proof Thumbnails (Placeholder) */}
            <div className="grid grid-cols-4 gap-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg border-2 border-transparent hover:border-brand-pink cursor-pointer overflow-hidden relative">
                         <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">User Photo</div>
                    </div>
                ))}
            </div>
          </div>

          {/* --- Right: Product Details --- */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-sm font-medium text-gray-500 hover:text-brand-dark cursor-pointer underline decoration-dotted">
                {product.reviews} verified reviews
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 text-lg mb-6 leading-relaxed">
              Mince garlic, chop veggies, and prep baby food in seconds. <span className="text-brand-dark font-semibold">Wireless, waterproof, and portable.</span>
            </p>

            {/* Price Block */}
            <div className="bg-brand-bg/50 p-5 rounded-2xl border border-brand-pink/20 mb-8 backdrop-blur-sm">
                <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-black text-gray-900 tracking-tight">${product.price}</span>
                    <span className="text-xl text-gray-400 line-through decoration-brand-dark decoration-2">${product.originalPrice}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-dark font-bold animate-pulse">
                    <Clock size={16} />
                    <span>Offer ends in {formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border border-gray-100 bg-gray-50 p-4 rounded-xl hover:border-brand-pink/50 transition-colors">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Dimensions</p>
                    <p className="font-bold text-gray-700">{product.specs.height} x {product.specs.width}</p>
                </div>
                <div className="border border-gray-100 bg-gray-50 p-4 rounded-xl hover:border-brand-pink/50 transition-colors">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Blade Type</p>
                    <p className="font-bold text-gray-700">{product.specs.blades}</p>
                </div>
            </div>

            {/* Benefits */}
            <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={14} strokeWidth={3} /></div>
                    <span className="font-medium">One-touch operation (Save 90% prep time)</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Battery size={14} strokeWidth={3} /></div>
                    <span className="font-medium">USB Rechargeable (30 uses per charge)</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><ShieldCheck size={14} strokeWidth={3} /></div>
                    <span className="font-medium">Food-grade material & Child Safety Lock</span>
                </li>
            </ul>

            {/* Volume Upsell (Buy More Save More) */}
            <div className="mb-6 p-4 border-2 border-dashed border-brand-pink/30 rounded-xl bg-brand-bg/30">
                <p className="font-bold text-brand-dark mb-2 text-sm uppercase tracking-wide">Bundle & Save</p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setQty(1)}
                        className={`flex-1 p-3 rounded-lg border text-center transition-all ${qty === 1 ? 'border-brand-dark bg-white shadow-md' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <div className="text-sm font-bold">1x</div>
                        <div className="text-xs text-gray-500">$24.99</div>
                    </button>
                    <button 
                         onClick={() => setQty(2)}
                        className={`flex-1 p-3 rounded-lg border text-center transition-all ${qty === 2 ? 'border-brand-dark bg-white shadow-md relative overflow-hidden' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                         {qty === 2 && <div className="absolute top-0 right-0 bg-brand-dark text-white text-[9px] px-1.5 py-0.5">MOST POPULAR</div>}
                        <div className="text-sm font-bold">2x</div>
                        <div className="text-xs text-gray-500">$45.00 <span className="text-green-600">(-10%)</span></div>
                    </button>
                    <button 
                         onClick={() => setQty(3)}
                        className={`flex-1 p-3 rounded-lg border text-center transition-all ${qty === 3 ? 'border-brand-dark bg-white shadow-md' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <div className="text-sm font-bold">3x</div>
                        <div className="text-xs text-gray-500">$60.00 <span className="text-green-600">(-20%)</span></div>
                    </button>
                </div>
            </div>

            {/* Desktop CTA Area */}
            <div className="hidden md:block space-y-4 pt-2">
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
                <div className="flex justify-center gap-6 text-xs text-gray-500 font-medium">
                   <span className="flex items-center gap-1"><Truck size={14}/> Free Shipping</span>
                   <span className="flex items-center gap-1"><ShieldCheck size={14}/> 30-Day Guarantee</span>
                </div>
            </div>
          </div>
        </div>

        {/* --- Trust Badges Section --- */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-100 py-12">
            <div className="flex flex-col items-center gap-3 group">
                <div className="bg-brand-bg p-4 rounded-full text-brand-dark group-hover:scale-110 transition-transform">
                  <Truck size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Fast Delivery</h3>
                  <p className="text-sm text-gray-500">2-4 Days Shipping</p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-3 group">
                 <div className="bg-brand-bg p-4 rounded-full text-brand-dark group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Secure Checkout</h3>
                  <p className="text-sm text-gray-500">SSL Encrypted Payment</p>
                </div>
            </div>
             <div className="flex flex-col items-center gap-3 group">
                 <div className="bg-brand-bg p-4 rounded-full text-brand-dark group-hover:scale-110 transition-transform">
                  <Star size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Top Rated</h3>
                  <p className="text-sm text-gray-500">4.8/5 Customer Rating</p>
                </div>
            </div>
             <div className="flex flex-col items-center gap-3 group">
                 <div className="bg-brand-bg p-4 rounded-full text-brand-dark group-hover:scale-110 transition-transform">
                  <Battery size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Long Battery</h3>
                  <p className="text-sm text-gray-500">Rechargeable USB</p>
                </div>
            </div>
        </div>

        {/* --- FAQ Section --- */}
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

      {/* --- Footer --- */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="font-extrabold text-2xl tracking-tighter text-brand-dark mb-4">snapnshop</div>
                <p className="text-gray-500 max-w-sm mb-6">Making kitchen prep easier, faster, and more fun. Join thousands of happy customers today.</p>
                <div className="flex gap-4">
                    <Instagram className="text-gray-400 hover:text-brand-dark cursor-pointer" />
                    <Facebook className="text-gray-400 hover:text-brand-dark cursor-pointer" />
                    <Twitter className="text-gray-400 hover:text-brand-dark cursor-pointer" />
                </div>
            </div>
            <div>
                <h4 className="font-bold mb-4">Shop</h4>
                <ul className="space-y-2 text-gray-500 text-sm">
                    <li><a href="#" className="hover:text-brand-dark">Mini Chopper</a></li>
                    <li><a href="#" className="hover:text-brand-dark">Accessories</a></li>
                    <li><a href="#" className="hover:text-brand-dark">Bundle Deals</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-500 text-sm">
                    <li><a href="#" className="hover:text-brand-dark">Track Order</a></li>
                    <li><a href="#" className="hover:text-brand-dark">Shipping Policy</a></li>
                    <li><a href="#" className="hover:text-brand-dark">Returns & Refunds</a></li>
                    <li><a href="#" className="hover:text-brand-dark">Contact Us</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>© 2024 SnapNShop. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
            </div>
        </div>
      </footer>

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
                Add to Cart - ${(qty === 2 ? 45.00 : qty === 3 ? 60.00 : product.price * qty).toFixed(2)}
            </button>
        </div>
      </div>
    </div>
  );
}