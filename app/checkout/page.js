"use client";
import { useState, useEffect, Suspense } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Smartphone, MapPin } from "lucide-react";

function CheckoutForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState(null);
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'chopper';
  
  // UPDATED: Added 'state' to the form object
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    state: '',
    zip: '' 
  });

  useEffect(() => {
    fetch(`/api/product?storeId=${storeId}`).then(res => res.json()).then(setProduct);
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // 1. Create Order in DB
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: product.price, customer: form, storeId }), 
    });
    const orderData = await res.json();

    // 2. Open Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "SnapNShop Secure",
      description: `Order #${orderData.id}`,
      order_id: orderData.id,
      handler: async (response) => {
         // Verify Payment
         const verify = await fetch("/api/verify-payment", {
             method: 'POST',
             body: JSON.stringify(response)
         });
         const verifyData = await verify.json();
         if(verifyData.valid) router.push(`/success?orderId=${orderData.id}`);
      },
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: product.theme?.primaryColor || "#000" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on('payment.failed', () => setIsProcessing(false));
  };

  if(!product) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Secure Gateway...</div>;

  return (
    <div className="max-w-md mx-auto p-4 pt-8 font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            {/* Trust Header */}
            <div className="flex items-center gap-2 mb-6 text-green-700 bg-green-50 p-3 rounded-lg">
                <ShieldCheck size={20} /> <span className="font-bold text-sm">256-Bit Secure SSL Payment</span>
            </div>

            {/* Price Summary */}
            <div className="mb-6 text-center border-b border-gray-100 pb-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Amount To Pay</p>
                <h1 className="text-4xl font-black text-gray-900">₹{product.price}</h1>
                <p className="text-xs text-green-600 font-bold mt-2">Free Delivery Applied</p>
            </div>

            {/* Payment Icons */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="border rounded-xl p-3 flex flex-col items-center gap-2 bg-gray-50">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-upi-2085056-1747946.png" className="w-8 h-8 object-contain" alt="UPI"/>
                    <span className="text-[10px] font-bold">UPI</span>
                </div>
                <div className="border rounded-xl p-3 flex flex-col items-center gap-2 bg-gray-50">
                    <CreditCard size={24} className="text-blue-600"/>
                    <span className="text-[10px] font-bold">Cards</span>
                </div>
                <div className="border rounded-xl p-3 flex flex-col items-center gap-2 bg-gray-50">
                    <Smartphone size={24} className="text-purple-600"/>
                    <span className="text-[10px] font-bold">NetBanking</span>
                </div>
            </div>

            {/* Shipping Form */}
            <form onSubmit={handlePay} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-gray-400"/>
                    <h3 className="font-bold text-sm uppercase text-gray-400">Shipping Details</h3>
                </div>
                
                <input required placeholder="Full Name" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-pink" onChange={e => setForm({...form, name: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Phone Number" type="tel" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-pink" onChange={e => setForm({...form, phone: e.target.value})} />
                    <input required placeholder="Email" type="email" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-pink" onChange={e => setForm({...form, email: e.target.value})} />
                </div>

                {/* UPDATED ADDRESS FIELDS */}
                <input required placeholder="Address Line 1 (House No, Street)" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-pink" onChange={e => setForm({...form, address: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="City" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-pink" onChange={e => setForm({...form, city: e.target.value})} />
                    <input required placeholder="State" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-pink" onChange={e => setForm({...form, state: e.target.value})} />
                </div>
                
                <input required placeholder="Pincode / Zip Code" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-pink" onChange={e => setForm({...form, zip: e.target.value})} />
                
                <button disabled={isProcessing} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 mt-6 shadow-lg">
                    {isProcessing ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
            <ShieldCheck size={12}/> 100% Safe & Secure Payments
        </p>
    </div>
  );
}

export default function CheckoutPage() {
    return <Suspense fallback={<div>Loading...</div>}><CheckoutForm/></Suspense>;
}