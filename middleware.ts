import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicPaths = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api/auth/',
  '/api/password/',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Check for root path - redirect to dashboard
  if (pathname === '/') {
    const token = request.cookies.get('accessToken')?.value;
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protected dashboard routes
  if (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/application-center') ||
      pathname.startsWith('/rank-center') ||
      pathname.startsWith('/api-keys') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/settings')) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token || !verifyToken(token)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protected API routes
  if (pathname.startsWith('/api/') &&
      !publicPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
