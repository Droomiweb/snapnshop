import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';
import shortid from 'shortid';
import { sendEmail, EMAIL_TEMPLATES } from '../../lib/notifications'; // Import added

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  await dbConnect();
  
  const { amount, customer } = await req.json();

  // Razorpay Options
  const options = {
    amount: amount * 100, 
    currency: "INR",
    receipt: shortid.generate(),
  };

  try {
    const response = await razorpay.orders.create(options);
    
    // Create DB Record
    const newOrder = new Order({
      orderId: response.id,
      customer: customer,
      amount: amount,
      status: 'Pending',
      supplierStatus: 'Pending',
      auditLog: [{ action: 'ORDER_CREATED', note: 'Customer initiated checkout', timestamp: new Date() }]
    });
    
    await newOrder.save();

    // --- NEW: Send Confirmation Email (Async - don't await to speed up UI) ---
    sendEmail({
      to: customer.email,
      subject: `Order Confirmed #${newOrder.orderId}`,
      html: EMAIL_TEMPLATES.ORDER_CONFIRMATION(newOrder)
    });

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