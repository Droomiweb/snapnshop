import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Product from '../../models/product';

export async function GET() {
  await dbConnect();
  
  let product = await Product.findOne({ sku: 'SNS-MINI-PK01' });

  if (!product) {
    product = new Product({
      sku: 'SNS-MINI-PK01',
      name: "SnapNShop Wireless Mini Chopper",
      price: 1499,
      originalPrice: 2999,
      currency: 'INR',
      stock: 50,
      // Default image if none exists
      images: ['/chopper.webp'], 
      specs: {
        height: "130mm",
        width: "92mm",
        capacity: "250ml",
        battery: "USB Rechargeable",
        blades: "304 Stainless Steel"
      }
    });
    await product.save();
  }

  return NextResponse.json(product);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  const product = await Product.findOneAndUpdate(
    { sku: 'SNS-MINI-PK01' }, 
    data, 
    { new: true, upsert: true }
  );

  return NextResponse.json(product);
}