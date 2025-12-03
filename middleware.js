import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Check if user is trying to access /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Exception: Allow access to the login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 2. Check for the "admin_session" cookie
    const authCookie = request.cookies.get('admin_session');

    // 3. If no cookie, kick them to the login page
    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run on admin routes
export const config = {
  matcher: '/admin/:path*',
};