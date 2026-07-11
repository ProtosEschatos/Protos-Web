import type { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/actions/blog'
import { locales } from '@/i18n'
import { buildLocaleUrl } from '@/lib/seo'

type PathConfig = {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}

const pathConfigs: PathConfig[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/usluge', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/kontakt', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/o-meni', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/proces', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/portfolio', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.75, changeFrequency: 'daily' },
  { path: '/portfolio-showcase', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const locale of locales) {
    for (const { path, priority, changeFrequency } of pathConfigs) {
      entries.push({
        url: buildLocaleUrl(locale, path),
        lastModified: now,
        changeFrequency,
        priority,
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
