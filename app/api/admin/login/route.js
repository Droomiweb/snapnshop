import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // Set a cookie that lasts 1 day
    response.cookies.set('admin_session', 'true', {
      httpOnly: true, // Cannot be accessed by client JS (secure)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
}