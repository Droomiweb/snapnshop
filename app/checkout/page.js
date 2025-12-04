"use client";
import { useState, useEffect, Suspense } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, CreditCard, Smartphone } from "lucide-react";

function CheckoutForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState(null);
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'chopper';
  
  // User Form Data
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '' });

  useEffect(() => {
    fetch(`/api/product?storeId=${storeId}`).then(res => res.json()).then(setProduct);
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // 1. Create Order in DB
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: product.price, customer: form, storeId }), // Sending StoreId
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

  if(!product) return <div>Loading Secure Gateway...</div>;

  return (
    <div className="max-w-md mx-auto p-4 pt-8">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-green-700 bg-green-50 p-3 rounded-lg">
                <ShieldCheck size={20} /> <span className="font-bold text-sm">256-Bit Secure SSL Payment</span>
            </div>

            <div className="mb-6 text-center">
                <p className="text-gray-500 text-sm">Total Amount To Pay</p>
                <h1 className="text-4xl font-black text-gray-900">₹{product.price}</h1>
            </div>

            {/* Payment Methods Visual */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="border rounded-xl p-3 flex flex-col items-center gap-2 bg-gray-50">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-upi-2085056-1747946.png" className="w-8 h-8 object-contain" />
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

            <form onSubmit={handlePay} className="space-y-4">
                <h3 className="font-bold text-sm uppercase text-gray-400">Shipping Details</h3>
                <input required placeholder="Full Name" className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, name: e.target.value})} />
                <input required placeholder="Phone Number" type="tel" className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, phone: e.target.value})} />
                <input required placeholder="Email" type="email" className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, email: e.target.value})} />
                <input required placeholder="Full Address with Pincode" className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, address: e.target.value})} />
                
                <button disabled={isProcessing} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity mt-4">
                    {isProcessing ? "Connecting to Bank..." : "Proceed to Pay"}
                </button>
            </form>
        </div>
    </div>
  );
}

export default function CheckoutPage() {
    return <Suspense fallback={<div>Loading...</div>}><CheckoutForm/></Suspense>;
}