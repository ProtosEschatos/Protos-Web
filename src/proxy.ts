import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './routing'
import {
  ABOUT_INTERNAL_HREF,
  LOCALIZED_PATHS,
  type SiteLocale,
} from '@/lib/routes/localized-paths'
import {
  ADMIN_COOKIE,
  isAdminLoginPath,
  isAdminPath,
  verifyAdminSessionEdge,
} from './lib/auth/admin-auth-shared'

/** Edge proxy — must not import mail/, imapflow, or Node-only admin-auth (crypto module). */

const intlMiddleware = createMiddleware(routing)

const defaultLocale = routing.defaultLocale

function handleLocalizedAboutUrls(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl

  for (const locale of routing.locales) {
    const localized = LOCALIZED_PATHS.about[locale as SiteLocale]
    const legacyPath = locale === defaultLocale ? ABOUT_INTERNAL_HREF : `/${locale}${ABOUT_INTERNAL_HREF}`
    const publicPath = locale === defaultLocale ? localized : `/${locale}${localized}`

    if (pathname === legacyPath && localized !== ABOUT_INTERNAL_HREF) {
      return NextResponse.redirect(new URL(`${publicPath}${search}`, request.url), 308)
    }

    if (pathname === publicPath && publicPath !== legacyPath) {
      return NextResponse.rewrite(new URL(`${legacyPath}${search}`, request.url))
    }
  }

  return null
}

function redirectDefaultLocalePrefix(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl
  const prefix = `/${defaultLocale}`
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    const stripped = pathname === prefix ? '/' : pathname.slice(prefix.length) || '/'
    return NextResponse.redirect(new URL(`${stripped}${search}`, request.url), 308)
  }
  return null
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const aboutRewrite = handleLocalizedAboutUrls(request)
  if (aboutRewrite) return aboutRewrite

  const localeRedirect = redirectDefaultLocalePrefix(request)
  if (localeRedirect) return localeRedirect

  // Never run i18n/admin gates on API routes (cron, contact, webhooks, etc.)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
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
    '/(hr|en|de|it|es|sr)/:path*',
    '/admin/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
