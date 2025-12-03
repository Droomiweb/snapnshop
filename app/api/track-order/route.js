import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';

export async function POST(req) {
  await dbConnect();
  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  // Find order by the Razorpay Order ID
  const order = await Order.findOne({ orderId: orderId });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: order.status,
    amount: order.amount,
    date: order.createdAt,
    customerName: order.customer.name
  });
}