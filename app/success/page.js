"use client";
import { CheckCircle, ArrowRight, Copy, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "SNS-UNKNOWN";

  return (
    <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center border border-gray-100">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <CheckCircle className="text-green-600 w-10 h-10" />
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-6">
        Thank you! We have received your order.
      </p>

      {/* NEW: Explicit Next Steps */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-left mb-8 text-sm text-blue-900">
          <h3 className="font-bold mb-2">What happens next?</h3>
          <ol className="list-decimal list-inside space-y-1 opacity-90">
              <li>We are manually processing your order (2-5 days).</li>
              <li>You will receive a <strong>Shipping Email</strong> with tracking.</li>
              <li>Delivery takes 7-14 days depending on location.</li>
          </ol>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border mb-6 text-left relative group">
        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Order Number</p>
        <div className="flex justify-between items-center">
            <p className="font-mono text-gray-800 font-bold text-lg">{orderId}</p>
            <button 
                onClick={() => navigator.clipboard.writeText(orderId)}
                className="text-brand-dark hover:text-brand-pink transition-colors p-1"
                title="Copy Order ID"
            >
                <Copy size={16}/>
            </button>
        </div>
      </div>

      <div className="space-y-3">
        <Link href="/tracking" className="block w-full bg-white border-2 border-brand-dark text-brand-dark py-3 rounded-xl font-bold hover:bg-brand-bg transition-colors">
            Track My Order
        </Link>
        <a href="mailto:support@snapnshop.com" className="flex items-center justify-center gap-2 w-full text-gray-400 text-sm font-medium hover:text-brand-dark">
            <MessageCircle size={16} /> Need help? Contact Support
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}