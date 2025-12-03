import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';

export async function POST(req) {
  await dbConnect();
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Payment Success: Update DB
    await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'Paid', paymentId: razorpay_payment_id }
    );
    
    return NextResponse.json({ message: "Success", valid: true });
  } else {
    return NextResponse.json({ message: "Invalid Signature", valid: false }, { status: 400 });
  }
}