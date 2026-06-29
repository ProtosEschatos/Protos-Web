import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // Supported locales
  locales,

  // Default locale when no match
  defaultLocale,

  // Use prefix for all locales including default
  localePrefix: 'as-needed',

  // Detect locale from Accept-Language header
  localeDetection: true,
})

export const config = {
  // Match all paths except static files, API routes, and Next.js internals
  matcher: [
    '/',
    '/(hr|en|de|it|es)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
