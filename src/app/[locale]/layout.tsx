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
import { locales, CYRILLIC_LOCALES, type Locale } from '@/i18n'
import { ogImage, siteUrl } from '@/lib/config/seo'
import { siteFaviconUrl } from '@/lib/assets/storage-cdn'
import { LEGAL_OWNER, LEGAL_COLLABORATOR, SITE_URL, GOOGLE_SITE_VERIFICATION } from '@/lib/config/site'
import LocaleCreatorSeo from '@/components/seo/LocaleCreatorSeo'
import { BOOT_GATE_INIT_SCRIPT } from '@/lib/config/boot-gate'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  themeColor: '#0a0a1a',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Protos Web — Web stranice s dušom | Zagreb',
    template: '%s | Protos Web',
  },
  description:
    'Protos Web — web studio iz Zagreba. Izrada web stranica, UI/UX, SEO, e-trgovina i 3D WebGL showcase. Dario Imsirović i Martina Markulin. Hrvatska, Balkan i EU.',
  keywords: [
    'protos',
    'protos web',
    'protosweb',
    'Protos Web Mark23',
    'protos_eschatos',
    'izrada web stranica',
    'web developer zagreb',
    'web dizajn zagreb',
    'Dario Imsirović',
    'Dario Imsirovic',
    'Martina Markulin',
    'Bodulica Shop',
    'Auto Moto Zagreb',
    'Golden Pawn',
    'LuminaDent',
    'System Boost',
    'goLance',
    'Next.js developer',
    'React developer hrvatska',
    'Three.js',
    'WebGL',
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
    title: 'Protos Web — Web stranice s dušom | Zagreb',
    description:
      'Brze, lagane i robusne web stranice po mjeri. Next.js, React, Three.js. Portfolio: Bodulica, Auto Moto, Golden Pawn, LuminaDent. Zagreb, Hrvatska.',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@protos_eschatos',
    creator: '@protos_eschatos',
    title: 'Protos Web — Web stranice s dušom | Zagreb',
    description:
      'Web studio iz Zagreba — custom websites, UI/UX, SEO i 3D portfolio. Dario Imsirović & Martina Markulin.',
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
    icon: siteFaviconUrl,
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  const htmlLang = CYRILLIC_LOCALES.includes(locale as Locale) ? `${locale}-Cyrl` : locale

  return (
    <html lang={htmlLang} className={inter.className}>
      <head>
        <LocaleCreatorSeo locale={locale} />
      </head>
      <body className="site-body">
        <Script id="boot-gate-init" strategy="beforeInteractive">
          {BOOT_GATE_INIT_SCRIPT}
        </Script>
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <div id="boot-ssr-veil" aria-hidden suppressHydrationWarning>
          <div className="boot-ssr-spinner" />
          <p className="boot-ssr-title">Protos Web</p>
        </div>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
