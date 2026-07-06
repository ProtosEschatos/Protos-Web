import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './routing'
import {
  ADMIN_COOKIE,
  isAdminLoginPath,
  isAdminPath,
  verifyAdminSessionEdge,
} from './lib/admin-auth-shared'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  if (isAdminPath(pathname)) {
    if (!isAdminLoginPath(pathname)) {
      const token = request.cookies.get(ADMIN_COOKIE)?.value
      if (!(await verifyAdminSessionEdge(token))) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
    return intlMiddleware(request)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/(hr|en|de|it|es)/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
