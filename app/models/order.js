import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true }, // The website this order came from
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zip: String,
    state: String
  },
  items: [{
    sku: String,
    name: String,
    qty: Number,
    price: Number
  }],
  amount: Number,
  status: { type: String, default: 'Pending' },
  paymentId: String,
  
  // Fulfillment
  supplierStatus: { type: String, default: 'Pending' },
  supplierOrderId: String,
  supplierName: String,
  supplierNotes: String,
  courier: String,
  trackingNumber: String,
  trackingUrl: String,
  
  auditLog: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);