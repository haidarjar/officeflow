import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const map: Record<string, string> = {
    '/signin': '/sign_in',
    '/sign-in': '/sign_in',
    '/signup': '/sign_up',
    '/sign-up': '/sign_up',
  };
  const to = map[url.pathname];
  if (to) {
    url.pathname = to;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/sign-in', '/signup', '/sign-up'],
};
