"use client";
import { useState, useEffect } from "react";
import { Star, CheckCircle, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DynamicLandingPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Default to 'chopper' if env variable is missing
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'chopper';

  useEffect(() => {
    fetch(`/api/product?storeId=${storeId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        // Track Page View
        fetch('/api/analytics/track', {
            method: 'POST',
            body: JSON.stringify({ storeId, event: 'page_view', page: 'home' })
        });
      });
  }, [storeId]);

  const handleBuy = () => {
    fetch('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ storeId, event: 'initiate_checkout', page: 'home' })
    });
    router.push('/checkout?qty=1');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Store...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Store not found.</div>;

  // Use product images or a fallback
  const images = product.images && product.images.length > 0 ? product.images : ['/chopper.webp'];
  const activeImage = images[activeImageIndex];

  return (
    <div className="font-sans text-gray-900 bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            
            {/* LEFT: GALLERY */}
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group">
                    <img 
                        src={activeImage} 
                        alt={product.name} 
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                    )}
                </div>

                {/* Thumbnails (Only if > 1 image) */}
                {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                                    activeImageIndex === idx 
                                    ? 'border-gray-900 ring-2 ring-gray-900/20' 
                                    : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt={`View ${idx}`} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: DETAILS */}
            <div className="space-y-8 z-10">
                <div className="space-y-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.theme?.subHeadline || "Best Seller"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                        {product.theme?.headline || product.name}
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                        {product.description || "Experience premium quality with our latest collection."}
                    </p>
                </div>

                <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-gray-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <span className="text-xl text-gray-400 line-through decoration-2 decoration-red-400">
                            ₹{product.originalPrice}
                        </span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button 
                        onClick={handleBuy} 
                        style={{ backgroundColor: product.theme?.primaryColor || '#000' }} 
                        className="flex-1 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-pink/20 hover:opacity-90 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        Buy Now <ArrowRight size={20}/>
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-full"><ShieldCheck size={20}/></div>
                        <span className="text-xs font-bold text-gray-600">1 Year Warranty</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><Truck size={20}/></div>
                        <span className="text-xs font-bold text-gray-600">Free Shipping</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-full"><RotateCcw size={20}/></div>
                        <span className="text-xs font-bold text-gray-600">7 Day Returns</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why customers love it</h2>
                  <p className="text-gray-500">Designed for performance and built to last.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  {product.features?.map((feat, i) => (
                      <div key={i} className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-900 mb-6">
                              <CheckCircle size={24} strokeWidth={2.5} />
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">Feature {i + 1}</h3>
                          <p className="text-gray-600 font-medium">{feat}</p>
                      </div>
                  ))}
                  
                  {/* Empty State for Features */}
                  {(!product.features || product.features.length === 0) && (
                      <div className="col-span-3 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                          <p className="text-gray-400 font-bold">No features added yet.</p>
                          <p className="text-xs text-gray-400 mt-1">Go to Admin Panel {'>'} Website Editor to add features.</p>
                      </div>
                  )}
              </div>
          </div>
      </section>
    </div>
  );
}