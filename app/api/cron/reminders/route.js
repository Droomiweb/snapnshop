import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/order';
import { sendEmail } from '../../../lib/notifications';

// Prevent unauthorized execution
export async function GET(req) {
  // Simple protection: Check for a secret key in query params
  // Usage: https://your-site.com/api/cron/reminders?key=YOUR_CRON_SECRET
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  
  const results = {
    stalled: 0,
    noTracking: 0
  };

  // 1. Alert on Stalled Orders (>24h Pending)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const stalledOrders = await Order.find({
    supplierStatus: 'Pending',
    status: 'Paid', // Only paid orders
    createdAt: { $lt: oneDayAgo }
  });

  if (stalledOrders.length > 0) {
    results.stalled = stalledOrders.length;
    const list = stalledOrders.map(o => `<li>#${o.orderId} (${o.amount} ${o.currency})</li>`).join('');
    
    await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `⚠️ URGENT: ${stalledOrders.length} Stalled Orders`,
        html: `
            <h3>Action Required</h3>
            <p>The following orders have been paid but not yet placed with the supplier (Pending > 24h):</p>
            <ul>${list}</ul>
            <p>Please check the Admin Dashboard immediately.</p>
        `
    });
  }

  // 2. Alert on "Placed" orders with no Tracking (>5 days)
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const lateTrackingOrders = await Order.find({
    supplierStatus: 'Placed',
    updatedAt: { $lt: fiveDaysAgo }
  });

  if (lateTrackingOrders.length > 0) {
    results.noTracking = lateTrackingOrders.length;
    await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `⚠️ Alert: ${lateTrackingOrders.length} Orders Missing Tracking`,
        html: `<p>These orders were placed with the supplier over 5 days ago but have no tracking number yet. Please follow up with the supplier.</p>`
    });
  }

  return NextResponse.json({ success: true, ...results });
}