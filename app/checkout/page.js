"use client";
import { useState, useEffect, Suspense } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Smartphone, MapPin, Home, User } from "lucide-react";

function CheckoutForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState(null);
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'chopper';
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    houseNumber: '',
    houseName: '',
    address: '',    
    landmark: '',
    place: '',
    city: '', 
    district: '',
    state: '',
    zip: '' 
  });

  useEffect(() => {
    fetch(`/api/product?storeId=${storeId}`).then(res => res.json()).then(setProduct);
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: product.price, customer: form, storeId }), 
    });
    const orderData = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "SnapNShop Secure",
      description: `Order #${orderData.id}`,
      order_id: orderData.id,
      handler: async (response) => {
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

  // --- STYLE OVERRIDE FOR CLEAN INPUTS ---
  // This CSS forces the browser to keep the background white even after autofilling.
  const inputStyles = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
        -webkit-text-fill-color: #111827 !important;
        transition: background-color 5000s ease-in-out 0s;
    }
  `;

  // Common input class for consistency
  const inputClass = "w-full border border-gray-300 p-3.5 rounded-xl text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 bg-white transition-all shadow-sm";

  return (
    <div className="max-w-xl mx-auto p-4 pt-8 font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <style>{inputStyles}</style>
        
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout</h1>
                  <p className="text-sm text-gray-500">Complete your purchase safely</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                   <p className="text-3xl font-black text-brand-dark">₹{product.price}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-8 text-green-800 bg-green-50 p-3 rounded-xl border border-green-100">
                <ShieldCheck size={20} /> <span className="font-bold text-xs">256-Bit SSL Secured Payment</span>
            </div>

            {/* Detailed Form */}
            <form onSubmit={handlePay} className="space-y-6">
                
                {/* Section 1: Contact */}
                <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase text-gray-400 flex items-center gap-2 tracking-wider">
                        <User size={14}/> Contact Info
                    </h3>
                    <input required placeholder="Full Name" className={inputClass} onChange={e => setForm({...form, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="Phone Number" type="number" className={inputClass} onChange={e => setForm({...form, phone: e.target.value})} />
                        <input required placeholder="Email Address" type="email" className={inputClass} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                </div>

                {/* Section 2: Detailed Address */}
                <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-xs uppercase text-gray-400 flex items-center gap-2 tracking-wider">
                        <Home size={14}/> Shipping Address
                    </h3>
                    
                    {/* House Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="House No." className={inputClass} onChange={e => setForm({...form, houseNumber: e.target.value})} />
                        <input placeholder="House Name (Opt)" className={inputClass} onChange={e => setForm({...form, houseName: e.target.value})} />
                    </div>

                    {/* Street & Landmark */}
                    <input required placeholder="Street / Area / Road Name" className={inputClass} onChange={e => setForm({...form, address: e.target.value})} />
                    <input placeholder="Landmark (e.g. Near Metro Station)" className={inputClass} onChange={e => setForm({...form, landmark: e.target.value})} />

                    {/* Location Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="City / Town" className={inputClass} onChange={e => setForm({...form, city: e.target.value})} />
                        <input required placeholder="Place" className={inputClass} onChange={e => setForm({...form, place: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <input required placeholder="District" className={inputClass} onChange={e => setForm({...form, district: e.target.value})} />
                         <input required placeholder="State" className={inputClass} onChange={e => setForm({...form, state: e.target.value})} />
                    </div>

                    <input required placeholder="Pincode (6 Digits)" type="tel" maxLength="6" className={`${inputClass} tracking-widest font-bold`} onChange={e => setForm({...form, zip: e.target.value})} />
                </div>
                
                <button disabled={isProcessing} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all active:scale-95 mt-6 shadow-xl flex items-center justify-center gap-2">
                    {isProcessing ? "Processing..." : <>Pay ₹{product.price} Now <CreditCard size={20}/></>}
                </button>
            </form>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1 opacity-70">
            <ShieldCheck size={12}/> Guaranteed safe checkout
        </p>
    </div>
  );
}

export default function CheckoutPage() {
    return <Suspense fallback={<div>Loading...</div>}><CheckoutForm/></Suspense>;
}