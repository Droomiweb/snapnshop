import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Product from '../../models/product';

export async function GET(req) {
  try {
    await dbConnect();
    
    // 1. Get Store ID safely
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId') || process.env.NEXT_PUBLIC_STORE_ID || 'chopper';

    console.log(`[API] Fetching product for store: ${storeId}`);

    // 2. Try to find the product
    let product = await Product.findOne({ storeId });

    // 3. If no product exists, create it (Auto-Setup)
    if (!product) {
      console.log(`[API] Product not found. Creating default for: ${storeId}`);
      
      try {
        product = new Product({
          storeId,
          sku: `SNS-${storeId.toUpperCase()}-001`,
          name: `SnapNShop ${storeId.charAt(0).toUpperCase() + storeId.slice(1)}`,
          price: 999,
          originalPrice: 1999,
          stock: 100,
          images: ['/chopper.webp'],
          description: 'Welcome to your new store! Go to the Admin Panel to edit this description.',
          features: ['Premium Quality', 'Fast Shipping'],
          theme: {
            headline: 'Welcome to our Store',
            subHeadline: 'Premium Quality',
            primaryColor: '#E07A72'
          }
        });

        await product.save();
        console.log(`[API] Successfully created default product.`);
      } catch (saveError) {
        console.error("[API] Failed to save default product:", saveError);
        throw saveError; // Re-throw to be caught below
      }
    }

    return NextResponse.json(product);
    
  } catch (error) {
    console.error("[API CRASH] Error in GET /api/product:", error);
    // Return the actual error message to the client for debugging
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { storeId } = data;

    if (!storeId) return NextResponse.json({ error: "Store ID required" }, { status: 400 });

    // Update or Create
    const product = await Product.findOneAndUpdate(
      { storeId }, 
      data, 
      { new: true, upsert: true }
    );

    return NextResponse.json(product);
  } catch (error) {
    console.error("[API CRASH] Error in POST /api/product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}