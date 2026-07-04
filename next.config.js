const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'www.protosweb.eu' },
      { protocol: 'https', hostname: 'protosweb.eu' },
      { protocol: 'https', hostname: 'www.protos-design.net' },
      { protocol: 'https', hostname: 'protos-design.net' },
    ],
  },

  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
}

module.exports = withNextIntl(nextConfig)
