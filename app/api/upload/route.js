import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'Filename and body required' }, { status: 400 });
  }

  // Upload to Vercel Blob
  // access: 'public' means the image can be viewed by anyone on your site
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}