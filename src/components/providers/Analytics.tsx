'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getCookiePreferences, COOKIE_CONSENT_EVENT } from '@/lib/cookie-consent'

export default function Analytics() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const sync = () => {
      setAllowed(getCookiePreferences()?.analytics === true)
    }
    sync()
    window.addEventListener(COOKIE_CONSENT_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  if (!allowed || (!plausibleDomain && !gaId)) {
    return null
  }

  return (
    <>
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}
    </>
  )
}
