import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/config/seo'

const ADMIN_DISALLOW = [
  '/admin',
  '/en/admin',
  '/de/admin',
  '/it/admin',
  '/es/admin',
  '/api/',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ADMIN_DISALLOW,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ADMIN_DISALLOW,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ADMIN_DISALLOW,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ADMIN_DISALLOW,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ADMIN_DISALLOW,
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ADMIN_DISALLOW,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl.replace(/^https?:\/\//, ''),
  }
}
