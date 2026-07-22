const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const SYSTEM_BOOST_PAGES_ORIGIN = 'https://protos-system-boost.pages.dev'
const isDev = process.env.NODE_ENV !== 'production'

// `'unsafe-eval'` is only needed by the Next.js dev server (eval-based HMR
// source maps). Production Next.js + Three.js/@react-three/fiber do not use
// eval, so we drop it in prod to shrink the XSS blast radius.
// `'unsafe-inline'` still has to stay: GA4's `dataLayer` bootstrap, Tailwind
// arbitrary-value inline styles, and Vercel Analytics ping all rely on it.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : null,
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://va.vercel-scripts.com',
]
  .filter(Boolean)
  .join(' ')

// `connect-src`: allow the origins the app fetches from at runtime.
//   - `*.supabase.co`: DB + storage
//   - `*.google-analytics.com` / `analytics.google.com`: GA4
//   - `vitals.vercel-insights.com` / `va.vercel-scripts.com`: Vercel Analytics
//   - `raw.githack.com`: @react-three/drei HDRI preset fetches
//     (`<Environment preset="warehouse">` -> raw.githack.com/pmndrs/drei-assets/...)
//   - `www.gstatic.com`: Draco decoder fallback for `useGLTF`
const connectSrc = [
  "'self'",
  'https://*.supabase.co',
  'https://www.google-analytics.com',
  'https://*.google-analytics.com',
  'https://analytics.google.com',
  'https://vitals.vercel-insights.com',
  'https://va.vercel-scripts.com',
  'https://raw.githack.com',
  'https://www.gstatic.com',
].join(' ')

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
      `script-src ${scriptSrc}`,
      `connect-src ${connectSrc}`,
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "media-src 'self' blob:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
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
