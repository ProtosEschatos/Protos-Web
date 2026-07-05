import type { Metadata } from 'next'
import { locales, defaultLocale, type Locale } from '@/i18n'

const DEFAULT_SITE_URL = 'https://www.protosweb.eu'

export function normalizeSiteUrl(url?: string): string {
  const raw = (url || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')
  return raw || DEFAULT_SITE_URL
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const ogImage = {
  url: '/api/og',
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
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path = '',
}: PageMetadataInput): Metadata {
  const safeLocale = (locale in openGraphLocale ? locale : defaultLocale) as Locale
  const canonical = buildLocaleUrl(safeLocale, path)

  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = buildLocaleUrl(loc, path)
  }
  languages['x-default'] = buildLocaleUrl(defaultLocale, path)

  const alternateLocales = locales
    .filter((loc) => loc !== safeLocale)
    .map((loc) => openGraphLocale[loc as Locale])

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
      type: 'website',
      locale: openGraphLocale[safeLocale],
      alternateLocale: alternateLocales,
      siteName: 'Protos Web',
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}${ogImage.url}`],
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

export function blogPostingJsonLd(post: {
  title: string
  description: string
  slug: string
  locale: string
  createdAt: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.createdAt,
    url: buildLocaleUrl(post.locale, `/blog/${post.slug}`),
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

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Protos Web',
  url: siteUrl,
  logo: `${siteUrl}/favicon.svg`,
  description:
    'Web design studio from Zagreb crafting fast, modern websites with soul — built with love and care for businesses across Croatia and Europe.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Zagreb',
    addressCountry: 'HR',
  },
  sameAs: [] as string[],
}
