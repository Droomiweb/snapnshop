import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: String,
  price: Number,
  originalPrice: Number,
  currency: { type: String, default: 'INR' },
  stock: Number,
  // NEW: Array of strings to hold image URLs
  images: { type: [String], default: ['/chopper.webp'] }, 
  specs: {
    height: String,
    width: String,
    capacity: String,
    battery: String,
    blades: String
  }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);