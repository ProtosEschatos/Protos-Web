const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const SYSTEM_BOOST_PAGES_ORIGIN = 'https://protos-system-boost.pages.dev'

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "media-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      `frame-src 'self' ${SYSTEM_BOOST_PAGES_ORIGIN}`,
    ].join('; '),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  staticPageGenerationTimeout: 120,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'protosweb.eu' },
      { protocol: 'https', hostname: 'www.protosweb.eu' },
    ],
  },

  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  async redirects() {
    return [
      // Legacy Croatian slug — permanent 308 redirect after o-meni → o-nama rename.
      // Google, bookmarks, and external social links keep working.
      { source: '/o-meni', destination: '/o-nama', permanent: true },
      { source: '/o-meni/:path*', destination: '/o-nama/:path*', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          ...securityHeaders,
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          ...securityHeaders,
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      { source: '/(.*)', headers: securityHeaders },
    ]
  },

}

module.exports = withNextIntl(nextConfig)
