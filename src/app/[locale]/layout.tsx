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
import { locales, type Locale } from '@/i18n'
import { ogImage, siteUrl } from '@/lib/seo'
import { LEGAL_OWNER, LEGAL_COLLABORATOR, SITE_URL, GOOGLE_SITE_VERIFICATION } from '@/lib/site'
import LocaleCreatorSeo from '@/components/seo/LocaleCreatorSeo'
import { BOOT_GATE_INIT_SCRIPT, BOOT_VIDEO } from '@/lib/boot-gate'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Protos Web — Websites with Soul, Built in Zagreb',
    template: '%s | Protos Web',
  },
  description:
    'Web design studio from Zagreb crafting fast, modern websites with soul — built with love and care for businesses across Croatia and Europe.',
  keywords: [
    'protos',
    'protos web',
    'protosweb',
    'protos web studio',
    'izrada web stranica',
    'web developer zagreb',
    'web dizajn zagreb',
    'Dario Imsirović',
    'Dario Imsirovic',
    'Martina Markulin',
    'next.js developer',
    'react developer hrvatska',
    'custom web stranice',
  ],
  authors: [
    { name: LEGAL_OWNER, url: `${SITE_URL}/o-meni#dario-imsirovic` },
    { name: LEGAL_COLLABORATOR, url: `${SITE_URL}/o-meni#martina-markulin` },
  ],
  creator: `${LEGAL_OWNER} & ${LEGAL_COLLABORATOR} — Protos Web`,
  openGraph: {
    type: 'website',
    locale: 'hr_HR',
    siteName: 'Protos Web',
    url: siteUrl,
    title: 'Protos Web — Websites with Soul, Built in Zagreb',
    description:
      'Brze, lagane i robusne web stranice izrađene po mjeri. Next.js, React, Three.js. Zagreb, Hrvatska.',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@protos_eschatos',
    creator: '@protos_eschatos',
    title: 'Protos Web — Websites with Soul, Built in Zagreb',
    description:
      'Web design studio from Zagreb crafting fast, modern websites with soul — built with love and care for businesses across Croatia and Europe.',
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: '/favicon.svg',
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
        <LocaleCreatorSeo locale={locale} />
      </head>
      <body className="site-body">
        <Script id="boot-gate-init" strategy="beforeInteractive">
          {BOOT_GATE_INIT_SCRIPT}
        </Script>
        <div id="boot-ssr-veil" aria-hidden suppressHydrationWarning>
          <div className="boot-ssr-spinner" />
          <p className="boot-ssr-title">Protos Web</p>
        </div>
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Analytics />
            <AppChrome>{children}</AppChrome>
            <SpeedInsights />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
