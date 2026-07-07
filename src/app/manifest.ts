import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: 'Web design studio from Zagreb — websites with soul.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a1a',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
