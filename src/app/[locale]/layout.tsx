import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import AppChrome from '@/components/layout/AppChrome'
import LenisProvider from '@/components/providers/LenisProvider'
import Analytics from '@/components/providers/Analytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { locales, type Locale } from '@/i18n'
import {
  buildSeoIdentityMetadata,
  ogImage,
  organizationJsonLd,
  personJsonLd,
  siteUrl,
  websiteJsonLd,
  professionalServiceJsonLd,
} from '@/lib/seo'
import { BOOT_GATE_INIT_SCRIPT, BOOT_VIDEO } from '@/lib/boot-gate'
import { SITE_NAME } from '@/lib/site'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const defaultTitle = `${SITE_NAME} — Websites with Soul, Built in Zagreb`
const defaultDescription =
  'Web design studio from Zagreb crafting fast, modern websites with soul — built with love and care for businesses across Croatia and Europe.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  ...buildSeoIdentityMetadata('hr'),
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: 'website',
    locale: 'hr_HR',
    siteName: SITE_NAME,
    url: siteUrl,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage.url],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.className}>
      <head>
        <link rel="preload" href={BOOT_VIDEO} as="fetch" type="video/mp4" crossOrigin="anonymous" />
      </head>
      <body className="site-body">
        <Script id="boot-gate-init" strategy="beforeInteractive">
          {BOOT_GATE_INIT_SCRIPT}
        </Script>
        <div id="boot-ssr-veil" aria-hidden suppressHydrationWarning>
          <div className="boot-ssr-spinner" />
          <p className="boot-ssr-title">{SITE_NAME}</p>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd()) }}
        />
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Analytics />
            <AppChrome>{children}</AppChrome>
            <SpeedInsights />
            <VercelAnalytics />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
