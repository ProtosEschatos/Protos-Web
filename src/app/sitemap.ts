import type { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/actions/blog'
import { locales } from '@/i18n'
import { buildLanguageAlternates, buildLocaleUrl } from '@/lib/seo'

const paths = ['', '/o-meni', '/proces', '/portfolio', '/portfolio-showcase', '/usluge', '/blog', '/kontakt', '/privacy', '/terms', '/cookies']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: buildLocaleUrl(locale, path),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path === '/privacy' || path === '/terms' || path === '/cookies' ? 0.4 : 0.8,
        alternates: {
          languages: buildLanguageAlternates(path),
        },
      })
    }
  }

  const blogSlugs = await getAllBlogSlugs()
  const slugMap = new Map<string, { updated_at: string; languages: Set<string> }>()
  for (const post of blogSlugs) {
    const existing = slugMap.get(post.slug)
    if (existing) {
      existing.languages.add(post.language)
      if (post.updated_at > existing.updated_at) existing.updated_at = post.updated_at
    } else {
      slugMap.set(post.slug, { updated_at: post.updated_at, languages: new Set([post.language]) })
    }
  }

  for (const [slug, meta] of slugMap) {
    const languages: Record<string, string> = {}
    for (const lang of meta.languages) {
      languages[lang] = buildLocaleUrl(lang, `/blog/${slug}`)
    }
    for (const lang of meta.languages) {
      entries.push({
        url: buildLocaleUrl(lang, `/blog/${slug}`),
        lastModified: new Date(meta.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      })
    }
  }

  return entries
}
