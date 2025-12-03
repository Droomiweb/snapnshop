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
  
  const { amount, customer } = await req.json();

  const options = {
    amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
    currency: "INR",
    receipt: shortid.generate(),
  };

  try {
    const response = await razorpay.orders.create(options);
    
    // Save preliminary order to DB
    const newOrder = new Order({
      orderId: response.id,
      customer: customer,
      amount: amount,
      status: 'Pending'
    });
    
    await newOrder.save();

    return NextResponse.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}