import type { Metadata } from 'next'
import { locales, defaultLocale, type Locale } from '@/i18n'

import { CONTACT_EMAIL, SITE_URL } from '@/lib/site'
import { getLiveSocialUrls } from '@/lib/social-links'

const DEFAULT_SITE_URL = SITE_URL

export function normalizeSiteUrl(url?: string): string {
  const raw = (url || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')
  return raw || DEFAULT_SITE_URL
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export function buildOgImageUrl(title?: string, description?: string): string {
  const params = new URLSearchParams()
  if (title) params.set('title', title)
  if (description) params.set('description', description)
  const query = params.toString()
  return query ? `/api/og?${query}` : '/api/og'
}

export const ogImage = {
  url: buildOgImageUrl(),
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
  ogTitle?: string
  ogType?: 'website' | 'article'
}

export function buildLanguageAlternates(path = ''): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = buildLocaleUrl(loc, path)
  }
  languages['x-default'] = buildLocaleUrl(defaultLocale, path)
  return languages
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path = '',
  ogTitle,
  ogType = 'website',
}: PageMetadataInput): Metadata {
  const safeLocale = (locale in openGraphLocale ? locale : defaultLocale) as Locale
  const canonical = buildLocaleUrl(safeLocale, path)
  const languages = buildLanguageAlternates(path)
  const imagePath = buildOgImageUrl(ogTitle ?? title, description)

  const alternateLocales = locales
    .filter((loc) => loc !== safeLocale)
    .map((loc) => openGraphLocale[loc as Locale])

  const verification: Metadata['verification'] = {}
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }

  return {
    title,
    description,
    verification: Object.keys(verification).length ? verification : undefined,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: ogTitle ?? title,
      description,
      type: ogType,
      locale: openGraphLocale[safeLocale],
      alternateLocale: alternateLocales,
      siteName: 'Protos Web',
      url: canonical,
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: ogTitle ?? title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description,
      images: [`${siteUrl}${imagePath}`],
    },
  }
}

export async function buildBlogPostMetadata({
  title,
  description,
  locale,
  slug,
  slugLocales,
}: {
  title: string
  description: string
  locale: string
  slug: string
  slugLocales: string[]
}): Promise<Metadata> {
  const path = `/blog/${slug}`
  const safeLocale = (locale in openGraphLocale ? locale : defaultLocale) as Locale
  const canonical = buildLocaleUrl(safeLocale, path)

  const languages: Record<string, string> = {}
  for (const loc of slugLocales) {
    if (locales.includes(loc as Locale)) {
      languages[loc] = buildLocaleUrl(loc, path)
    }
  }
  languages['x-default'] = languages[defaultLocale] ?? canonical

  const imagePath = buildOgImageUrl(title, description)

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: openGraphLocale[safeLocale],
      siteName: 'Protos Web',
      url: canonical,
      images: [{ url: imagePath, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}${imagePath}`],
    },
  }
}

export function blogPostingJsonLd(post: {
  title: string
  description: string
  slug: string
  locale: string
  createdAt: string
}) {
  const pageUrl = buildLocaleUrl(post.locale, `/blog/${post.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    image: `${siteUrl}${buildOgImageUrl(post.title, post.description)}`,
    author: {
      '@type': 'Organization',
      name: 'Protos Web',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Protos Web',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`,
      },
    },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Protos Web',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    email: CONTACT_EMAIL,
    description:
      'Web design studio from Zagreb crafting fast, modern websites with soul — built with love and care for businesses across Croatia and Europe.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zagreb',
      addressCountry: 'HR',
    },
    sameAs: getLiveSocialUrls(),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Protos Web',
    url: siteUrl,
    inLanguage: locales,
    publisher: {
      '@type': 'Organization',
      name: 'Protos Web',
    },
  }
}

export function professionalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Protos Web',
    url: siteUrl,
    image: `${siteUrl}/favicon.svg`,
    telephone: '+385976043941',
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zagreb',
      addressCountry: 'HR',
    },
    areaServed: ['HR', 'EU'],
    sameAs: getLiveSocialUrls(),
  }
}
