import { NextResponse } from 'next/server';
import crypto from 'crypto';
// CHANGED: Use ../../../ instead of ../../../../
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/order';
import { sendEmail, EMAIL_TEMPLATES } from '../../../lib/notifications';

export async function POST(req) {
  try {
    // 1. Get the Raw Body (Required for signature verification)
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    // 2. Verify Signature
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    // 3. Process Event
    const body = JSON.parse(rawBody);
    const event = body.event;

    await dbConnect();

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = body.payload.payment.entity;
      const orderId = payment.order_id; // Razorpay Order ID

      // Find and update order safely
      const order = await Order.findOne({ orderId: orderId });

      if (order && order.status !== 'Paid') {
        order.status = 'Paid';
        order.paymentId = payment.id;
        order.supplierStatus = 'Pending'; // Ready for processing
        
        order.auditLog.push({
          action: 'WEBHOOK_PAYMENT_SUCCESS',
          note: `Payment ${payment.id} captured via Webhook`,
          timestamp: new Date()
        });

        await order.save();

        // Send confirmation email
        await sendEmail({
          to: order.customer.email,
          subject: `Order Confirmed #${order.orderId}`,
          html: EMAIL_TEMPLATES.ORDER_CONFIRMATION(order)
        });

        console.log(`Webhook: Order ${orderId} marked as Paid.`);
      } else {
        console.log(`Webhook: Order ${orderId} already paid or not found.`);
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}