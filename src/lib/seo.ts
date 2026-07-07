import type { Metadata } from 'next'
import { locales, defaultLocale, type Locale } from '@/i18n'

import {
  AUTHOR_JOB_TITLE,
  AUTHOR_NAME,
  AUTHOR_URL_PATH,
  COMPANY_NAME,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SITE_NAME,
  SITE_NAME_ALT,
  SITE_URL,
} from '@/lib/site'
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
  alt: SITE_NAME,
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

function resolveLocale(locale: string): Locale {
  return (locale in openGraphLocale ? locale : defaultLocale) as Locale
}

function authorPageUrl(locale: string): string {
  return buildLocaleUrl(locale, AUTHOR_URL_PATH)
}

/** Profile URLs for Person/Organization sameAs (SEO graph). */
export function getSeoSameAs(): string[] {
  const urls = new Set<string>([INSTAGRAM_URL, ...getLiveSocialUrls()])
  return [...urls].filter((url) => url.startsWith('http'))
}

/** Invisible author/publisher meta on every public page. */
export function buildSeoIdentityMetadata(locale: string): Pick<
  Metadata,
  'authors' | 'creator' | 'publisher' | 'other'
> {
  return {
    authors: [{ name: AUTHOR_NAME, url: authorPageUrl(locale) }],
    creator: AUTHOR_NAME,
    publisher: SITE_NAME,
    other: {
      brand: SITE_NAME_ALT,
      company: COMPANY_NAME,
    },
  }
}

export function personJsonLd(locale: string) {
  const authorUrl = authorPageUrl(locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${authorUrl}#person`,
    name: AUTHOR_NAME,
    url: authorUrl,
    jobTitle: AUTHOR_JOB_TITLE,
    worksFor: {
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: SITE_NAME,
    },
    sameAs: getSeoSameAs(),
  }
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

function buildGoogleVerification(): Metadata['verification'] | undefined {
  const verification: Metadata['verification'] = {}
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }
  return Object.keys(verification).length ? verification : undefined
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path = '',
  ogTitle,
  ogType = 'website',
}: PageMetadataInput): Metadata {
  const safeLocale = resolveLocale(locale)
  const canonical = buildLocaleUrl(safeLocale, path)
  const languages = buildLanguageAlternates(path)
  const imagePath = buildOgImageUrl(ogTitle ?? title, description)

  const alternateLocales = locales
    .filter((loc) => loc !== safeLocale)
    .map((loc) => openGraphLocale[loc as Locale])

  return {
    title,
    description,
    verification: buildGoogleVerification(),
    ...buildSeoIdentityMetadata(safeLocale),
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
      siteName: SITE_NAME,
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
  const safeLocale = resolveLocale(locale)
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
    verification: buildGoogleVerification(),
    ...buildSeoIdentityMetadata(safeLocale),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: openGraphLocale[safeLocale],
      siteName: SITE_NAME,
      url: canonical,
      images: [{ url: imagePath, width: 1200, height: 630, alt: title }],
      authors: [AUTHOR_NAME],
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
  const safeLocale = resolveLocale(post.locale)
  const pageUrl = buildLocaleUrl(safeLocale, `/blog/${post.slug}`)
  const authorUrl = authorPageUrl(safeLocale)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    inLanguage: openGraphLocale[safeLocale],
    articleSection: 'Blog',
    image: `${siteUrl}${buildOgImageUrl(post.title, post.description)}`,
    author: {
      '@type': 'Person',
      '@id': `${authorUrl}#person`,
      name: AUTHOR_NAME,
      url: authorUrl,
      jobTitle: AUTHOR_JOB_TITLE,
      worksFor: {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: SITE_NAME,
      },
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: SITE_NAME,
      alternateName: [SITE_NAME_ALT, COMPANY_NAME],
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`,
      },
    },
  }
}

export function organizationJsonLd() {
  const organizationId = `${siteUrl}#organization`
  const authorUrl = buildLocaleUrl(defaultLocale, AUTHOR_URL_PATH)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: SITE_NAME,
    alternateName: [SITE_NAME_ALT, COMPANY_NAME],
    brand: {
      '@type': 'Brand',
      name: COMPANY_NAME,
    },
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    email: CONTACT_EMAIL,
    description:
      'Web design studio from Zagreb crafting fast, modern websites with soul — built with love and care for businesses across Croatia and Europe.',
    founder: {
      '@type': 'Person',
      '@id': `${authorUrl}#person`,
      name: AUTHOR_NAME,
      url: authorUrl,
      jobTitle: AUTHOR_JOB_TITLE,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zagreb',
      addressCountry: 'HR',
    },
    sameAs: getSeoSameAs(),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: SITE_NAME,
    alternateName: [SITE_NAME_ALT, COMPANY_NAME],
    url: siteUrl,
    inLanguage: locales,
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: SITE_NAME,
    },
  }
}

export function professionalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}#service`,
    name: SITE_NAME,
    alternateName: [SITE_NAME_ALT, COMPANY_NAME],
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
    founder: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: buildLocaleUrl(defaultLocale, AUTHOR_URL_PATH),
    },
    sameAs: getSeoSameAs(),
  }
}
