const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for development warnings
  reactStrictMode: true,

  // Image optimization config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Transpile Three.js packages for SSR compatibility
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
  ],

  // Webpack config for Three.js / GLSL support
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify-loader'],
    })
    return config
  },
}

module.exports = withNextIntl(nextConfig)
