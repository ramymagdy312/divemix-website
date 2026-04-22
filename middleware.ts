import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSupabaseSessionCookie = req.cookies
    .getAll()
    .some((cookie) => cookie.name.includes('auth-token') || cookie.name.startsWith('sb-'));

  const isRevalidateApi = pathname.startsWith('/api/revalidate');
  const isProtectedApi = isRevalidateApi;

  if (isProtectedApi) {
    if (!hasSupabaseSessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};