import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';

export async function POST(req) {
  await dbConnect();
  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  // Find by custom orderId OR mongo _id
  const order = await Order.findOne({ 
      $or: [{ orderId: orderId }, { _id: orderId.length === 24 ? orderId : null }] 
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Determine user-friendly status
  let displayStatus = order.status;
  if (order.supplierStatus === 'Placed') displayStatus = 'Processing';
  if (order.supplierStatus === 'Shipped') displayStatus = 'Shipped';

  return NextResponse.json({
    status: displayStatus,
    amount: order.amount,
    date: order.createdAt,
    customerName: order.customer.name,
    tracking: {
        courier: order.courier,
        number: order.trackingNumber,
        url: order.trackingUrl
    }
  });
}