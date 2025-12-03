"use client";
import { useState, useEffect } from "react";
import { Lock, ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQty = parseInt(searchParams.get('qty') || '1');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", zip: ""
  });

  useEffect(() => {
    // Fetch real price
    fetch('/api/product').then(res => res.json()).then(data => setProduct(data));
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handlePayment = async (e) => {
    e.preventDefault();
    if(!product) return;
    setIsProcessing(true);

    const totalAmount = product.price * initialQty;

    // 1. Create Order
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ 
        amount: totalAmount, 
        customer: formData 
      }),
    });
    const data = await res.json();

    // 2. Open Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "SnapNShop India",
      description: `${product.name} (x${initialQty})`,
      order_id: data.id,
      handler: async function (response) {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.valid) router.push(`/success?orderId=${response.razorpay_order_id}`);
        else alert("Payment Verification Failed");
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: "#000000" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', function (response){
        alert("Payment Failed");
        setIsProcessing(false);
    });
  };

  if (!product) return <div className="p-10 text-center">Loading Secure Checkout...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="bg-white border-b py-4 mb-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="font-bold flex items-center gap-2 text-gray-600">
                <ArrowLeft size={18} /> Back
            </Link>
            <div className="text-sm font-bold text-green-700 flex items-center gap-2">
                <Lock size={14} /> 100% Secure Payment
            </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Form */}
        <div className="md:col-span-7 space-y-6">
            <form onSubmit={handlePayment} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <h2 className="text-lg font-bold mb-2">Shipping Details</h2>
                    <input name="name" onChange={handleChange} required type="text" placeholder="Full Name" className="w-full border p-3 rounded-lg outline-black" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="email" onChange={handleChange} required type="email" placeholder="Email" className="w-full border p-3 rounded-lg outline-black" />
                        <input name="phone" onChange={handleChange} required type="tel" placeholder="Phone Number" className="w-full border p-3 rounded-lg outline-black" />
                    </div>
                    <input name="address" onChange={handleChange} required type="text" placeholder="Address" className="w-full border p-3 rounded-lg outline-black" />
                    <div className="grid grid-cols-3 gap-4">
                        <input name="city" onChange={handleChange} required type="text" placeholder="City" className="w-full border p-3 rounded-lg outline-black" />
                        <input name="state" onChange={handleChange} required type="text" placeholder="State" className="w-full border p-3 rounded-lg outline-black" />
                        <input name="zip" onChange={handleChange} required type="text" placeholder="Pincode" className="w-full border p-3 rounded-lg outline-black" />
                    </div>
                </div>

                <button disabled={isProcessing} type="submit" className="w-full bg-brand-dark text-white font-bold text-xl py-4 rounded-xl hover:bg-black transition-all shadow-lg disabled:opacity-70">
                    {isProcessing ? "Processing..." : `Pay ₹${(product.price * initialQty).toLocaleString('en-IN')}`}
                </button>
            </form>
        </div>

        {/* Right: Summary */}
        <div className="md:col-span-5">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-4">Order Summary</h3>
                <div className="flex gap-4 border-b pb-4 mb-4">
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {initialQty}</p>
                    </div>
                    <div className="font-bold">₹{product.price.toLocaleString('en-IN')}</div>
                </div>
                
                <div className="space-y-2 py-4 border-b mb-4 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{(product.price * initialQty).toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-green-600 font-bold"><span>Shipping</span><span>Free</span></div>
                </div>

                <div className="flex justify-between items-center text-xl font-extrabold text-gray-900">
                    <span>Total</span>
                    <span>₹{(product.price * initialQty).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}