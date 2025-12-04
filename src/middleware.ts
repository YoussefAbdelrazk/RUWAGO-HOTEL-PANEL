import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/register'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  const { pathname } = request.nextUrl;

  if (token) {
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|uploads|images|.*\\..*).*)'],
};
