import type { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://protosweb.eu'

const paths = ['', '/o-meni', '/proces', '/portfolio', '/portfolio-showcase', '/usluge', '/blog', '/kontakt']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const path of paths) {
      const prefix = locale === defaultLocale ? '' : `/${locale}`
      entries.push({
        url: `${siteUrl}${prefix}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
      })
    }
  }

  return entries
}
