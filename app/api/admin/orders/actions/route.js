import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/order';
import { sendEmail, EMAIL_TEMPLATES } from '../../../../lib/notifications'; // Import added

export async function POST(req) {
  await dbConnect();
  const { action, orderId, data } = await req.json();

  if (!orderId) return NextResponse.json({ error: "No Order ID" }, { status: 400 });

  const order = await Order.findOne({ _id: orderId });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  let auditNote = "";

  try {
    switch (action) {
      case 'MARK_PLACED':
        order.supplierStatus = 'Placed';
        order.supplierOrderId = data.supplierOrderId;
        order.supplierName = data.supplierName || 'IndiaMART Supplier';
        order.supplierNotes = data.notes;
        auditNote = `Order placed with supplier ${order.supplierName}. ID: ${data.supplierOrderId}`;
        break;

      case 'ADD_TRACKING':
        // Update Fields
        order.supplierStatus = 'Shipped';
        order.status = 'Shipped';
        order.courier = data.courier;
        order.trackingNumber = data.trackingNumber;
        order.trackingUrl = data.trackingUrl || `https://www.google.com/search?q=${data.trackingNumber}`;
        
        auditNote = `Tracking added: ${data.courier} - ${data.trackingNumber}`;
        
        // --- NEW: Send Shipping Email ---
        await sendEmail({
            to: order.customer.email,
            subject: `Shipped: Your Order #${order.orderId}`,
            html: EMAIL_TEMPLATES.SHIPPING_UPDATE(order)
        });
        break;

      case 'UPDATE_NOTE':
        order.supplierNotes = data.notes;
        auditNote = `Updated notes.`;
        break;
        
      default:
        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
    }

    // Save
    order.auditLog.push({
      action: action,
      note: auditNote,
      timestamp: new Date()
    });

    await order.save();
    return NextResponse.json({ success: true, order });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}