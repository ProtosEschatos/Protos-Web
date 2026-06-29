import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageLoader from '@/components/ui/PageLoader'
import CustomCursor from '@/components/ui/CustomCursor'
import CookieBanner from '@/components/ui/CookieBanner'
import LenisProvider from '@/components/providers/LenisProvider'
import Analytics from '@/components/providers/Analytics'
import { locales, type Locale } from '@/i18n'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://protosweb.eu'),
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
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Protos Web' }],
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
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Analytics />
            <PageLoader />
            <CustomCursor />
            <Header />
            <main>{children}</main>
            <Footer />
            <CookieBanner />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
