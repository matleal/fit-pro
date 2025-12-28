import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie (NextAuth creates these cookies)
  const sessionToken =
    request.cookies.get('authjs.session-token') ||
    request.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!sessionToken;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/convite',
    '/escolher-tipo',
    '/debug-auth',
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // API routes - let them handle their own auth
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Home page is public
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Public routes are always accessible
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes require login
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
