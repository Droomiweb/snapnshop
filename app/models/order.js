import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true }, // Razorpay Order ID
  customer: {
    name: String,
    email: String,
    address: String,
    city: String,
    zip: String,
  },
  amount: Number,
  status: { type: String, default: 'Pending' }, // Pending, Paid, Shipped
  paymentId: String, // Razorpay Payment ID
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);