import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/order';
import Analytics from '../../../models/analytics';
import Product from '../../../models/product';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('storeId');

  if (!storeId) return NextResponse.json({ error: "Store ID required" }, { status: 400 });

  // 1. Fetch Orders for this store
  const orders = await Order.find({ storeId }).sort({ createdAt: -1 });

  // 2. Fetch Product Config (CMS Data)
  const product = await Product.findOne({ storeId });

  // 3. Calculate Analytics
  const pageViews = await Analytics.countDocuments({ storeId, event: 'page_view' });
  const checkoutInitiated = await Analytics.countDocuments({ storeId, event: 'initiate_checkout' });
  
  // Count successful purchases from real orders, not just analytics events (more accurate)
  const purchases = await Order.countDocuments({ storeId, status: 'Paid' });

  return NextResponse.json({
    orders,
    product,
    analytics: {
        pageViews,
        checkoutInitiated,
        purchases
    }
  });
}