import type { Metadata } from 'next'
import { locales, defaultLocale, type Locale } from '@/i18n'
import type { SeoPageKey } from '@/lib/config/seo-keywords'
import { formatKeywords } from '@/lib/config/seo-keywords'
import { buildBlogAuthorGraph } from '@/lib/config/creator-seo'
import { siteFaviconUrl } from '@/lib/assets/storage-cdn'

import { SITE_URL } from '@/lib/config/site'

const DEFAULT_SITE_URL = SITE_URL

export function normalizeSiteUrl(url?: string): string {
  const raw = (url || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')
  return raw || DEFAULT_SITE_URL
}

/** Canonical site URL — single source of truth (see src/lib/site.ts). */
export const siteUrl = SITE_URL

export const ogImage = {
  url: `${SITE_URL}/api/og`,
  width: 1200,
  height: 630,
  alt: 'Protos Web',
  type: 'image/png',
} as const

const openGraphLocale: Record<Locale, string> = {
  hr: 'hr_HR',
  en: 'en_US',
  de: 'de_DE',
  it: 'it_IT',
  es: 'es_ES',
  sr: 'sr_RS',
}

/** Build a locale-aware path (no domain), respecting localePrefix: as-needed */
export function buildLocalePath(locale: string, path = ''): string {
  const safeLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale
  const prefix = safeLocale === defaultLocale ? '' : `/${safeLocale}`
  return `${prefix}${path}`
}

/** Full absolute URL for a locale + path */
export function buildLocaleUrl(locale: string, path = ''): string {
  const localePath = buildLocalePath(locale, path)
  if (!localePath) return siteUrl
  return `${siteUrl}${localePath}`
}

type PageMetadataInput = {
  title: string
  description: string
  locale: string
  /** Path without locale prefix, e.g. `/o-meni` or `` for home */
  path?: string
  /** Per-locale paths for hreflang (e.g. about page) */
  pathsByLocale?: Partial<Record<Locale, string>>
  /** Merges global + page-specific regional/web-dev keywords */
  seoPage?: SeoPageKey
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path = '',
  pathsByLocale,
  ogImagePath,
  seoPage,
}: PageMetadataInput & { ogImagePath?: string }): Metadata {
  const safeLocale = (locale in openGraphLocale ? locale : defaultLocale) as Locale
  const pathForLocale = (loc: Locale) => pathsByLocale?.[loc] ?? path
  const canonical = buildLocaleUrl(safeLocale, pathForLocale(safeLocale))
  const ogImageUrl = ogImagePath
    ? { ...ogImage, url: ogImagePath.startsWith('http') ? ogImagePath : `${siteUrl}${ogImagePath}` }
    : ogImage
  const ogImageAbsolute = ogImageUrl.url.startsWith('http')
    ? ogImageUrl.url
    : `${siteUrl}${ogImageUrl.url}`

  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = buildLocaleUrl(loc, pathForLocale(loc))
  }
  languages['x-default'] = buildLocaleUrl(defaultLocale, pathForLocale(defaultLocale))

  const alternateLocales = locales
    .filter((loc) => loc !== safeLocale)
    .map((loc) => openGraphLocale[loc as Locale])

  return {
    title,
    description,
    keywords: formatKeywords(safeLocale, seoPage),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: openGraphLocale[safeLocale],
      alternateLocale: alternateLocales,
      siteName: 'Protos Web',
      url: canonical,
      images: [{ ...ogImageUrl, url: ogImageAbsolute }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageAbsolute],
    },
  }
}

export function buildBlogPostMetadata({
  title,
  description,
  locale,
  slug,
}: {
  title: string
  description: string
  locale: string
  slug: string
}): Metadata {
  return buildPageMetadata({
    title,
    description,
    locale,
    path: `/blog/${slug}`,
  })
}

export type AuthorSlug = 'dario' | 'martina' | 'both'

export function normalizeAuthorSlug(value: string | null | undefined): AuthorSlug {
  if (value === 'martina' || value === 'both') return value
  return 'dario'
}

export function blogPostingJsonLd(post: {
  title: string
  description: string
  slug: string
  locale: string
  createdAt: string
  authorSlug?: AuthorSlug | string | null
}) {
  const authorSlug = normalizeAuthorSlug(post.authorSlug)
  const authors = buildBlogAuthorGraph(post.locale, authorSlug)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.createdAt,
    url: buildLocaleUrl(post.locale, `/blog/${post.slug}`),
    author: authors.length === 1 ? authors[0] : authors,
    publisher: {
      '@type': 'Organization',
      name: 'Protos Web',
      logo: {
        '@type': 'ImageObject',
        url: siteFaviconUrl,
      },
    },
  }
}

export function blogIndexJsonLd(
  locale: string,
  pageTitle: string,
  description: string,
  posts: Array<{ title: string; slug: string; createdAt: string }>,
) {
  const url = buildLocaleUrl(locale, '/blog')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        url,
        name: pageTitle,
        description,
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#itemlist`,
        url,
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'BlogPosting',
            headline: post.title,
            url: buildLocaleUrl(locale, `/blog/${post.slug}`),
            datePublished: post.createdAt,
          },
        })),
      },
    ],
  }
}

export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
  pageUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: pageUrl,
  }
}

type BreadcrumbItem = { name: string; path?: string }

export function breadcrumbListJsonLd(items: BreadcrumbItem[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path !== undefined ? { item: buildLocaleUrl(locale, item.path) } : {}),
    })),
  }
}

export function servicesPageJsonLd(
  locale: string,
  pageTitle: string,
  description: string,
) {
  const url = buildLocaleUrl(locale, '/usluge')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: pageTitle,
    description,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#professional-service` },
  }
}

export function contactPageJsonLd(
  locale: string,
  pageTitle: string,
  description: string,
) {
  const url = buildLocaleUrl(locale, '/kontakt')
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${url}#webpage`,
    url,
    name: pageTitle,
    description,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${SITE_URL}/#professional-service` },
  }
}

export function portfolioItemListJsonLd(
  items: Array<{
    title: string
    description: string | null
    image_url: string | null
    project_url: string | null
  }>,
  locale: string,
) {
  if (items.length === 0) return null

  const pageUrl = buildLocaleUrl(locale, '/portfolio-showcase')
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: pageUrl,
    name: 'Protos Web 3D Portfolio Showcase',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.title,
        ...(item.description ? { description: item.description } : {}),
        ...(item.image_url ? { image: item.image_url } : {}),
        url: item.project_url ?? pageUrl,
        creator: { '@id': `${SITE_URL}/#dario-imsirovic` },
        contributor: { '@id': `${SITE_URL}/#martina-markulin` },
      },
    })),
  }
}

export function showcasePageJsonLd(locale: string, title: string, description: string) {
  const url = buildLocaleUrl(locale, '/portfolio-showcase')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#professional-service` },
    mainEntity: {
      '@type': 'WebApplication',
      name: title,
      description,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web browser',
    },
  }
}
