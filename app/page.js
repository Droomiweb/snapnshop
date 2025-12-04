"use client";
import { useState, useEffect } from "react";
import { Star, CheckCircle, ArrowRight, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";

// --- FAKE REVIEWS DATA ---
const REVIEWS = [
  { 
    name: "Aditi Rao", 
    role: "Verified Buyer", 
    rating: 5, 
    text: "I was skeptical at first, but the quality is actually premium. It looks great in my kitchen and works perfectly!" 
  },
  { 
    name: "Rahul Mehta", 
    role: "Verified Buyer", 
    rating: 5, 
    text: "Super fast delivery to Bangalore. The product works exactly as described. Highly recommended." 
  },
  { 
    name: "Sneha Kapoor", 
    role: "Verified Buyer", 
    rating: 4, 
    text: "Value for money. Customer support helped me with tracking immediately when I had a doubt." 
  },
  { 
    name: "Vikram Singh", 
    role: "Verified Buyer", 
    rating: 5, 
    text: "Best purchase I've made this month. The packaging was very secure and the gadget feels very durable." 
  }
];

export default function DynamicLandingPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'chopper';

  useEffect(() => {
    fetch(`/api/product?storeId=${storeId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        // Track View
        fetch('/api/analytics/track', {
            method: 'POST',
            body: JSON.stringify({ storeId, event: 'page_view', page: 'home' })
        });
      });
  }, [storeId]);

  // Auto-Scroll Logic (Cycles every 3 seconds)
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1 || isPaused) return;
    
    const timer = setInterval(() => {
        setActiveImageIndex(prev => (prev + 1) % product.images.length);
    }, 3000); 

    return () => clearInterval(timer);
  }, [product, isPaused]);

  const handleBuy = () => {
    fetch('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ storeId, event: 'initiate_checkout', page: 'home' })
    });
    router.push('/checkout?qty=1');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Store...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-gray-500">Store not found.</div>;

  // Fallback if no images exist
  const images = product.images && product.images.length > 0 ? product.images : ['/chopper.webp'];
  const activeImage = images[activeImageIndex];

  return (
    <div className="font-sans text-gray-900 bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 md:gap-10 items-start">
            
            {/* LEFT: GALLERY 
                FIX: Removed sticky from mobile (added md: prefix)
                FIX: Adjusted z-index to ensure it doesn't overlap navbar
            */}
            <div className="space-y-4 max-w-lg mx-auto w-full relative md:sticky md:top-24 z-0">
                {/* Main Image Display */}
                <div 
                    className="relative aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group z-0"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <img 
                        src={activeImage} 
                        alt={product.name} 
                        className="object-contain w-full h-full p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Hover Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)}} 
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-700 z-10"
                            >
                                <ChevronLeft size={20}/>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex + 1) % images.length)}} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-700 z-10"
                            >
                                <ChevronRight size={20}/>
                            </button>
                        </>
                    )}

                    {/* Discount Tag */}
                    {product.originalPrice > product.price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                    )}
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                        {images.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                                    activeImageIndex === idx 
                                    ? 'border-brand-pink ring-2 ring-brand-pink/20 scale-105 opacity-100' 
                                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
                                }`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt={`View ${idx}`} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: DETAILS */}
            <div className="space-y-6 pt-2">
                <div className="space-y-3">
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {product.theme?.subHeadline || "Trending Now"}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                        {product.theme?.headline || product.name}
                    </h1>
                    <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-xs text-gray-500 font-medium ml-2">({REVIEWS.length * 42} Reviews)</span>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed font-medium">
                        {product.description || "Upgrade your lifestyle with this premium gadget. Designed for performance and built to last."}
                    </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                            <span className="text-lg text-gray-400 line-through decoration-gray-300">
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                            Inclusive of all taxes
                        </span>
                    </div>

                    <button 
                        onClick={handleBuy} 
                        style={{ backgroundColor: product.theme?.primaryColor || '#000' }} 
                        className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Buy Now <ArrowRight size={18}/>
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                        <ShieldCheck size={12}/> Secure Payment via Razorpay
                    </p>
                </div>

                {/* Trust Features Grid */}
                <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-gray-50 rounded-full text-gray-600"><Truck size={18}/></div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Free Shipping</p>
                            <p className="text-[10px] text-gray-500">Across India</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-gray-50 rounded-full text-gray-600"><RotateCcw size={18}/></div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">7 Day Returns</p>
                            <p className="text-[10px] text-gray-500">Easy Policy</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-gray-50 rounded-full text-gray-600"><ShieldCheck size={18}/></div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Warranty</p>
                            <p className="text-[10px] text-gray-500">1 Year Brand</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-10">
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Why customers love it</h2>
                  <p className="text-sm text-gray-500">Premium features that stand out.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                  {product.features?.map((feat, i) => (
                      <div key={i} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-900 mb-4">
                              <CheckCircle size={20} strokeWidth={2.5} />
                          </div>
                          <h3 className="font-bold text-sm text-gray-900 mb-1">Feature {i + 1}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{feat}</p>
                      </div>
                  ))}
                  
                  {(!product.features || product.features.length === 0) && (
                      <div className="col-span-3 text-center py-8 text-sm text-gray-400 border border-dashed rounded-xl">
                          No features added yet. Go to Admin Panel.
                      </div>
                  )}
              </div>
          </div>
      </section>

       {/* --- CUSTOMER REVIEWS SECTION --- */}
       <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">What our customers say</h2>
            <p className="text-gray-500">Real feedback from verified purchases across India.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                 <div>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(review.rating)].map((_, r) => <Star key={r} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{review.text}"</p>
                 </div>
                 
                 <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{review.name}</p>
                      <p className="text-[10px] text-green-600 flex items-center gap-1 font-bold">
                        <CheckCircle size={8} /> {review.role}
                      </p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}