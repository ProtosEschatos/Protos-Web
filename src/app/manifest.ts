import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Protos Web',
    short_name: 'Protos Web',
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
