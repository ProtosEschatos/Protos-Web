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
import { ogImage, organizationJsonLd, siteUrl } from '@/lib/seo'
import { BOOT_GATE_INIT_SCRIPT, BOOT_VIDEO } from '@/lib/boot-gate'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Protos Web — We Turn Visitors Into Customers',
    template: '%s | Protos Web',
  },
  description:
    'Professional web design agency from Zagreb. Modern, fast and visually stunning websites that turn visitors into customers.',
  openGraph: {
    type: 'website',
    locale: 'hr_HR',
    siteName: 'Protos Web',
    url: siteUrl,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protos Web — We Turn Visitors Into Customers',
    description:
      'Professional web design agency from Zagreb. Modern, fast and visually stunning websites that turn visitors into customers.',
    images: [ogImage.url],
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
      </head>
      <body>
        <Script id="boot-gate-init" strategy="beforeInteractive">
          {BOOT_GATE_INIT_SCRIPT}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
