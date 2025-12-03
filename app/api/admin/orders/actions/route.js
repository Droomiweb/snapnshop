import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/order';

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
        // status remains "Paid" for customer until shipped
        auditNote = `Order placed with supplier ${order.supplierName}. Supplier ID: ${data.supplierOrderId}`;
        break;

      case 'ADD_TRACKING':
        order.supplierStatus = 'Shipped';
        order.status = 'Shipped'; // Update customer facing status
        order.courier = data.courier;
        order.trackingNumber = data.trackingNumber;
        order.trackingUrl = data.trackingUrl;
        auditNote = `Tracking added: ${data.courier} - ${data.trackingNumber}`;
        // In a real app, trigger "Order Shipped" email here
        break;

      case 'UPDATE_NOTE':
        order.supplierNotes = data.notes;
        auditNote = `Updated internal notes.`;
        break;
        
      default:
        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
    }

    // Add to audit log
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