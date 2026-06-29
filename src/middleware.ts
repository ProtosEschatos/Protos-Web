import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/',
    '/(hr|en|de|it|es)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
