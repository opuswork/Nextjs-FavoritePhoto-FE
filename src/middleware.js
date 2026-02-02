import { NextResponse } from 'next/server';

// JWT cookie is set by the backend (different origin, e.g. Render).
// Middleware runs on the frontend origin (Vercel) and only sees frontend cookies,
// so we cannot check the token here for cross-origin auth.
// /marketplace pages handle auth by calling GET /users/me (withCredentials sends
// the backend cookie); on 401 they redirect to /auth/login.
export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/marketplace', '/marketplace/:path*'],
};
