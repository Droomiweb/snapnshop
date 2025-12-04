import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/product';

export async function GET() {
  await dbConnect();
  
  // Find all distinct storeIds
  const rawStores = await Product.distinct('storeId');
  
  // FILTER: Remove null, undefined, or empty strings
  const stores = rawStores.filter(store => store && typeof store === 'string');
  
  // If no valid stores found, default to 'chopper'
  if (stores.length === 0) {
    return NextResponse.json({ stores: ['chopper'] });
  }

  return NextResponse.json({ stores });
}