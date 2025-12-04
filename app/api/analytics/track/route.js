import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';   // Changed from ../../../../
import Analytics from '../../../models/analytics'; // Changed from ../../../../

export async function POST(req) {
  try {
    await dbConnect();
    const { storeId, event, page } = await req.json();
    
    // Validate required fields
    if (!event) {
        return NextResponse.json({ error: "Event is required" }, { status: 400 });
    }

    await Analytics.create({
      storeId: storeId || 'unknown',
      event,
      page: page || 'unknown'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}