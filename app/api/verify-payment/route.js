import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';
import { sendEmail, EMAIL_TEMPLATES } from '../../lib/notifications';

export async function POST(req) {
  await dbConnect();
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Fetch order to check current status
    const order = await Order.findOne({ orderId: razorpay_order_id });

    if (!order) {
       return NextResponse.json({ message: "Order not found", valid: false }, { status: 404 });
    }

    // IDEMPOTENCY CHECK: If Webhook already marked it as Paid, skip update & email
    if (order.status === 'Paid') {
        console.log(`[Verify] Order ${razorpay_order_id} already processed by Webhook.`);
        return NextResponse.json({ message: "Already Processed", valid: true });
    }

    // If not paid yet, update it manually
    order.status = 'Paid';
    order.supplierStatus = 'Pending';
    order.paymentId = razorpay_payment_id;
    order.auditLog.push({ 
        action: 'PAYMENT_VERIFIED_CLIENT', 
        note: `Verified via Client Return URL`, 
        timestamp: new Date() 
    });
    
    await order.save();
    
    // Trigger "Order Confirmed" Email
    await sendEmail({
        to: order.customer.email,
        subject: `Order Confirmed #${order.orderId}`,
        html: EMAIL_TEMPLATES.ORDER_CONFIRMATION(order)
    });

    return NextResponse.json({ message: "Success", valid: true });
  } else {
    return NextResponse.json({ message: "Invalid Signature", valid: false }, { status: 400 });
  }
}