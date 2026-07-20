import type { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/lib/queries/blog'
import { locales } from '@/i18n'
import { buildLocaleUrl } from '@/lib/config/seo'
import { aboutPathForLocale } from '@/lib/routes/localized-paths'

/** Keep sitemap warm for Googlebot; avoid empty Last read / fetch stalls. */
export const revalidate = 3600

type PathConfig = {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}

const pathConfigs: PathConfig[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/usluge', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/kontakt', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/o-nama', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/proces', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/portfolio', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.75, changeFrequency: 'daily' },
  { path: '/portfolio-showcase', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
]

function buildStaticEntries(now: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  for (const locale of locales) {
    for (const { path, priority, changeFrequency } of pathConfigs) {
      const localizedPath = path === '/o-nama' ? aboutPathForLocale(locale) : path
      entries.push({
        url: buildLocaleUrl(locale, localizedPath),
        lastModified: now,
        changeFrequency,
        priority,
      })
    }
  }
  return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries = buildStaticEntries(now)

  try {
    const blogSlugs = await getAllBlogSlugs()
    for (const post of blogSlugs) {
      entries.push({
        url: buildLocaleUrl(post.language, `/blog/${post.slug}`),
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch (error) {
    console.error('[sitemap] blog slugs skipped:', error)
  }

  return entries
}
