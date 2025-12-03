"use client";
import { useState } from "react";
import { Search, Package, CheckCircle, Truck, MapPin } from "lucide-react";
import Link from "next/link";

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
       {/* Simple Nav */}
       <div className="border-b p-4">
          <div className="max-w-4xl mx-auto font-bold text-2xl text-brand-dark">
            <Link href="/">snapnshop</Link>
          </div>
       </div>

       <main className="max-w-xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-black text-center mb-2">Track Your Order</h1>
          <p className="text-gray-500 text-center mb-8">Enter your Order ID to see the current status.</p>

          <form onSubmit={handleTrack} className="flex gap-2 mb-12">
             <input 
                type="text" 
                placeholder="Order ID (e.g. order_Pz...)" 
                className="flex-1 border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 ring-brand-pink"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
             />
             <button disabled={loading} className="bg-brand-dark text-white px-6 rounded-xl font-bold hover:bg-brand-pink transition-colors disabled:opacity-50">
                {loading ? "..." : <Search />}
             </button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
                {error}
            </div>
          )}

         // ... existing imports ...
// Inside the component...
// Replace the result rendering block:

          {result && (
             <div className="bg-white border rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-brand-bg p-6 border-b border-brand-pink/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Order Status</p>
                            <h2 className="text-2xl font-bold text-brand-dark capitalize">{result.status}</h2>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    {/* Status Steps */}
                    <div className="relative flex justify-between mb-8">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
                        {/* Mapped statuses: Pending -> Processing -> Shipped -> Delivered */}
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                             const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                             // Map API status to index
                             let apiStatusIdx = statuses.indexOf(result.status);
                             if(result.status === 'Paid') apiStatusIdx = 0; // Treat Paid as Pending for visual simplicity
                             
                             const stepIdx = statuses.indexOf(step);
                             const isActive = stepIdx <= apiStatusIdx;

                             return (
                                <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {isActive ? <CheckCircle size={14} /> : i + 1}
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                                </div>
                             )
                        })}
                    </div>

                    {/* NEW: Tracking Info Block */}
                    {result.tracking?.number && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-blue-500 uppercase">Tracking Number</p>
                                <p className="font-mono font-bold text-lg text-blue-900">{result.tracking.number}</p>
                                <p className="text-xs text-blue-600">via {result.tracking.courier}</p>
                            </div>
                            <Truck className="text-blue-300" size={32} />
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                        {/* ... Existing details ... */}
                         <div className="flex gap-3">
                            <Package className="text-gray-400" size={18}/>
                            <div>
                                <p className="font-bold text-gray-700">Order Placed</p>
                                <p className="text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          )}
       </main>
    </div>
  );
}