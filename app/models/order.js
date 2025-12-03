import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // --- Core Order Info ---
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: String,
    email: String,
    phone: String, // Added phone for IndiaMART/Couriers
    address: String,
    city: String,
    zip: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  items: [{ // specific items array for CSV export clarity
    sku: String,
    name: String,
    qty: Number,
    price: Number
  }],
  amount: Number,
  currency: { type: String, default: 'INR' },
  
  // --- Payment & Status ---
  status: { type: String, default: 'Pending' }, // Customer facing: Pending, Paid, Shipped, Delivered, Cancelled
  paymentId: String,
  
  // --- Supplier / Fulfillment Fields ---
  supplierStatus: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Placed', 'Shipped', 'Failed'] 
  },
  supplierOrderId: String, // The ID given by the IndiaMART supplier
  supplierName: String,
  supplierNotes: String, // Internal notes (e.g., "Spoke to Raj, shipping delayed")
  
  // --- Shipping & Dates ---
  courier: String,
  trackingNumber: String,
  trackingUrl: String,
  expectedDeliveryDate: Date,
  
  // --- Audit Trail ---
  auditLog: [{
    action: String, // e.g., "Marked Placed", "Exported CSV"
    timestamp: { type: Date, default: Date.now },
    note: String
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);