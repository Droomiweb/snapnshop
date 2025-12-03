import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-gray-600">
            Have a question about your order? We're here to help!
          </p>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-brand-dark"><Mail /></div>
            <div>
              <p className="font-bold">Email</p>
              <p className="text-gray-600">support@snapnshop.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-brand-dark"><Phone /></div>
            <div>
              <p className="font-bold">Phone</p>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-brand-dark"><MapPin /></div>
            <div>
              <p className="font-bold">Registered Office</p>
              <p className="text-gray-600">
                SnapNShop Retail Pvt Ltd<br/>
                123, Tech Park, Indiranagar<br/>
                Bangalore, Karnataka, 560001
              </p>
            </div>
          </div>
        </div>

        <form className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg">Send a Message</h3>
            <input type="text" placeholder="Your Name" className="w-full border p-3 rounded-lg" />
            <input type="email" placeholder="Your Email" className="w-full border p-3 rounded-lg" />
            <textarea placeholder="Message" rows="4" className="w-full border p-3 rounded-lg"></textarea>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-bold w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}