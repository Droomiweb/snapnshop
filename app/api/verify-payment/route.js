import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../lib/mongodb';
import Order from '../../models/order';
import { sendEmail, EMAIL_TEMPLATES } from '../../lib/notifications'; // Import the mailer

export async function POST(req) {
  await dbConnect();
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // 1. Payment Success: Update DB
    // We also set the initial 'auditLog' entry here for the payment
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { 
        status: 'Paid', 
        supplierStatus: 'Pending', // Ready for admin to process
        paymentId: razorpay_payment_id,
        $push: { 
          auditLog: { 
            action: 'PAYMENT_RECEIVED', 
            note: `Razorpay ID: ${razorpay_payment_id}`, 
            timestamp: new Date() 
          } 
        }
      },
      { new: true } // Return the updated document
    );
    
    // 2. Trigger "Order Confirmed" Email NOW (only on success)
    if (updatedOrder) {
        await sendEmail({
            to: updatedOrder.customer.email,
            subject: `Order Confirmed #${updatedOrder.orderId}`,
            html: EMAIL_TEMPLATES.ORDER_CONFIRMATION(updatedOrder)
        });
    }

    return NextResponse.json({ message: "Success", valid: true });
  } else {
    return NextResponse.json({ message: "Invalid Signature", valid: false }, { status: 400 });
  }
}