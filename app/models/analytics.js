import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true },
  event: { type: String, required: true }, // 'page_view', 'add_to_cart', 'initiate_checkout', 'purchase'
  page: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);