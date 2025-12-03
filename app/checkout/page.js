"use client";
import { useState } from "react";
import { ShieldCheck, Lock, CreditCard, Truck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script"; // Required for Razorpay
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // 1. Create Order
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ 
        amount: 24.99 * 86, // Approx conversion to INR (Razorpay works best with INR) or use USD if enabled
        customer: formData 
      }),
    });
    const data = await res.json();

    // 2. Open Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: data.amount,
      currency: data.currency,
      name: "SnapNShop",
      description: "Mini Chopper Purchase",
      order_id: data.id,
      handler: async function (response) {
        // 3. Verify Payment
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        
        const verifyData = await verifyRes.json();
          if (verifyData.valid) {
              // Pass the actual Razorpay Order ID to the success page
              router.push(`/success?orderId=${response.razorpay_order_id}`);
          } else {
          alert("Payment Verification Failed");
          setIsProcessing(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
      },
      theme: {
        color: "#F4A49E",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', function (response){
        alert(response.error.description);
        setIsProcessing(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Header */}
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-2xl tracking-tighter text-brand-dark flex items-center gap-2">
                <ArrowLeft size={20} className="text-gray-400" /> snapnshop
            </Link>
            <div className="text-sm text-gray-500 flex items-center gap-2">
                <Lock size={14} /> Secure Checkout
            </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Form */}
        <div className="md:col-span-7 space-y-6">
            <form onSubmit={handlePayment} className="space-y-6">
                
                {/* Contact Info */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                    <input 
                      name="email" onChange={handleChange} required
                      type="email" placeholder="Email Address" 
                      className="w-full border p-3 rounded-lg bg-gray-50" 
                    />
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
                    <input 
                      name="name" onChange={handleChange} required
                      type="text" placeholder="Full Name" 
                      className="border p-3 rounded-lg bg-gray-50 w-full" 
                    />
                    <input 
                      name="address" onChange={handleChange} required
                      type="text" placeholder="Address" 
                      className="w-full border p-3 rounded-lg bg-gray-50" 
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                          name="city" onChange={handleChange} required
                          type="text" placeholder="City" 
                          className="border p-3 rounded-lg bg-gray-50 w-full" 
                        />
                        <input 
                          name="zip" onChange={handleChange} required
                          type="text" placeholder="ZIP / Pincode" 
                          className="border p-3 rounded-lg bg-gray-50 w-full" 
                        />
                    </div>
                </div>

                <button 
                    disabled={isProcessing}
                    type="submit" 
                    className="w-full bg-brand-dark text-white font-bold text-xl py-4 rounded-xl hover:bg-brand-pink transition-all shadow-lg shadow-brand-pink/40 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                    {isProcessing ? "Processing..." : "Pay Now (Razorpay)"}
                </button>
            </form>
        </div>

        {/* Right: Summary */}
        <div className="md:col-span-5">
            <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-4">Order Summary</h3>
                <div className="flex gap-4 border-b pb-4 mb-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border">
                         <Image src="/chopper.webp" alt="Chopper" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800">Wireless Mini Chopper</h4>
                        <p className="text-sm text-gray-500">Pink / 250ml</p>
                    </div>
                    <div className="font-bold">$24.99</div>
                </div>
                <div className="flex justify-between items-center text-xl font-extrabold text-gray-900">
                    <span>Total</span>
                    <span>$24.99</span>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}