import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true }, 
  sku: { type: String, required: true },
  name: String,
  price: Number,
  originalPrice: Number,
  stock: Number,
  images: { type: [String], default: [] }, 
  
  description: String,
  features: [String],
  
  theme: {
    primaryColor: { type: String, default: '#E07A72' },
    headline: { type: String, default: 'Premium Home Gadgets' },
    subHeadline: { type: String, default: 'Quality checked for Indian Homes' }
  }
});

// COMPOUND INDEX: Ensures each store can have its own unique products
ProductSchema.index({ storeId: 1, sku: 1 }, { unique: true });

// FIX: Delete the model if it exists to force re-compilation with the new Schema
// This prevents "Schema hasn't changed" errors during hot-reload
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model('Product', ProductSchema);