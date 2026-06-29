import type { Metadata } from 'next'
import type { Locale } from '@/i18n'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://protosweb.eu'

export const ogImage = {
  url: '/og-image.svg',
  width: 1200,
  height: 630,
  alt: 'Protos Web',
} as const

const openGraphLocale: Record<Locale, string> = {
  hr: 'hr_HR',
  en: 'en_US',
  de: 'de_DE',
  it: 'it_IT',
  es: 'es_ES',
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
  const safeLocale = (locale in openGraphLocale ? locale : 'hr') as Locale
  const prefix = safeLocale === 'hr' ? '' : `/${safeLocale}`
  const canonicalPath = `${prefix}${path}`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${canonicalPath || '/'}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: openGraphLocale[safeLocale],
      siteName: 'Protos Web',
      url: `${siteUrl}${canonicalPath || '/'}`,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
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
    'Professional web design agency from Zagreb. Modern, fast and visually stunning websites that turn visitors into customers.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Zagreb',
    addressCountry: 'HR',
  },
  sameAs: [] as string[],
}
