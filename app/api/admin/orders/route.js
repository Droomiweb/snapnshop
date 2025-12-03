import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/order';

export async function GET() {
  await dbConnect();
  // Fetch orders, newest first
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}