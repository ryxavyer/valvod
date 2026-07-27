import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@src/lib/supabase'

// Routes that consume an auth `code` themselves.
const CODE_HANDLING_PATHS = ['/auth/callback', '/auth/confirm']

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const code = searchParams.get('code')

  // Safety net: if Supabase's redirect allow-list is stale it drops the user on
  // the Site URL with `?code=` attached, where nothing exchanges it. Forward any
  // stray code to the callback so the session still gets created.
  if (code && !CODE_HANDLING_PATHS.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    url.search = ''
    url.searchParams.set('code', code)
    if (pathname !== '/') url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  const response = await updateSession(request)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
