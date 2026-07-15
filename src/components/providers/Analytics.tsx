'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { getCookiePreferences, COOKIE_CONSENT_EVENT, applyGoogleConsentMode } from '@/lib/config/cookie-consent'
import { GA4_MEASUREMENT_ID } from '@/lib/config/site'

export default function Analytics() {
  const [allowed, setAllowed] = useState(false)
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    const sync = () => {
      const prefs = getCookiePreferences()
      const analyticsOn = prefs?.analytics === true
      setAllowed(analyticsOn)
      applyGoogleConsentMode(analyticsOn)
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
  const gaId = GA4_MEASUREMENT_ID

  // GA gtag does not auto-track SPA route changes. The initial page_view is sent
  // by gtag('config'), so we skip the first observed path and only fire on real
  // client-side navigations. (Plausible's default script handles this on its own.)
  useEffect(() => {
    if (!allowed || !gaId || typeof window === 'undefined') return
    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = pathname
      return
    }
    if (lastTrackedPath.current === pathname) return
    lastTrackedPath.current = pathname
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return
    const locale = pathname.split('/').filter(Boolean)[0] || 'hr'
    const knownLocales = new Set(['hr', 'en', 'de', 'it', 'es', 'sr'])
    const language = knownLocales.has(locale) ? locale : 'hr'
    gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      language,
      content_group: language,
    })
  }, [pathname, allowed, gaId])

  // When consent flips on mid-session, gtag may already exist — re-apply grant
  // before SPA navigations so the first config isn't stuck in denied state.
  useEffect(() => {
    if (!allowed) {
      lastTrackedPath.current = null
      return
    }
    applyGoogleConsentMode(true)
  }, [allowed])

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
              gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              gtag('config', '${gaId}', {
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                send_page_view: true,
                cookie_flags: 'SameSite=None;Secure'
              });
            `}
          </Script>
        </>
      ) : null}
    </>
  )
}
