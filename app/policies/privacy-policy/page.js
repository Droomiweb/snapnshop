export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-slate">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3>1. Information We Collect</h3>
      <p>We collect information you provide directly to us when you make a purchase, including your name, email address, shipping address, and phone number.</p>

      <h3>2. How We Use Your Information</h3>
      <p>We use your information to process orders, send shipping updates, and provide customer support.</p>

      <h3>3. Payment Information</h3>
      <p>Your payment details are processed securely by Razorpay. We do not store your credit card or bank account details on our servers.</p>

      <h3>4. Contact Us</h3>
      <p>If you have questions about this policy, contact us at support@snapnshop.com.</p>
    </div>
  );
}