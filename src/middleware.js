import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'token';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/marketplace')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME);
    if (!token?.value) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/marketplace', '/marketplace/:path*'],
};
