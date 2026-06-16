import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n';

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes - check auth
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Public routes - apply i18n
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).+)',
    '/api/:path*',
  ],
};
