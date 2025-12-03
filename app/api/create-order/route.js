import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';
import shortid from 'shortid';
// We don't send the email here anymore, we wait for Payment Success (Verify or Webhook)
// to prevent "Order Confirmed" emails for unpaid abandoned carts.

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  await dbConnect();
  
  try {
    const { amount, customer } = await req.json();
    const currency = process.env.DEFAULT_CURRENCY || 'INR';

    // Razorpay Options
    const options = {
      amount: Math.round(amount * 100), // Ensure integer (paise)
      currency: currency,
      receipt: shortid.generate(),
    };

    const response = await razorpay.orders.create(options);
    
    // Create DB Record (Status: Pending Payment)
    const newOrder = new Order({
      orderId: response.id,
      customer: customer,
      amount: amount,
      currency: currency,
      status: 'Pending', // Pending Payment
      supplierStatus: 'Pending',
      auditLog: [{ 
        action: 'ORDER_INITIATED', 
        note: 'Customer reached payment gateway', 
        timestamp: new Date() 
      }]
    });
    
    await newOrder.save();

    return NextResponse.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID // Send pub key to client
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}