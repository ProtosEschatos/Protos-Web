import type { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/actions/blog'
import { locales, defaultLocale } from '@/i18n'
import { buildLocaleUrl } from '@/lib/seo'

const paths = ['', '/o-meni', '/proces', '/portfolio', '/portfolio-showcase', '/usluge', '/blog', '/kontakt']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: buildLocaleUrl(locale, path),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
      })
    }
  }

  const blogSlugs = await getAllBlogSlugs()
  for (const post of blogSlugs) {
    entries.push({
      url: buildLocaleUrl(post.language, `/blog/${post.slug}`),
      lastModified: new Date(post.updated_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return entries
}
