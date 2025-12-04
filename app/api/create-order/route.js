import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';
import shortid from 'shortid';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  await dbConnect();
  
  try {
    const { amount, customer, storeId } = await req.json(); // Now accepting storeId
    const currency = 'INR';

    const options = {
      amount: Math.round(amount * 100),
      currency: currency,
      receipt: shortid.generate(),
      notes: { storeId: storeId } // Tagging transaction in Razorpay Dashboard
    };

    const response = await razorpay.orders.create(options);
    
    const newOrder = new Order({
      storeId: storeId || 'unknown', // Critical for multi-store
      orderId: response.id,
      customer: customer,
      amount: amount,
      currency: currency,
      status: 'Pending',
      supplierStatus: 'Pending',
      auditLog: [{ 
        action: 'ORDER_INITIATED', 
        note: `Started checkout on ${storeId}`, 
        timestamp: new Date() 
      }]
    });
    
    await newOrder.save();

    return NextResponse.json(response);
  } catch (error) {
    console.error("Order Create Error:", error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}