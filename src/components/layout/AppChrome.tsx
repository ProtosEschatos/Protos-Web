'use client'

import { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import { usePathname } from '@/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageLoader from '@/components/ui/PageLoader'
import CustomCursor from '@/components/ui/CustomCursor'
import SiteShell from '@/components/ui/SiteShell'
import SiteBackground from '@/components/ui/SiteBackground'
import { PageTransitionProvider } from '@/components/navigation/PageTransitionProvider'
import PageTransitionOverlay from '@/components/navigation/PageTransitionOverlay'
import AdminShell from '@/components/features/admin/AdminShell'
import SiteConsentModal from '@/components/legal/SiteConsentModal'
import {
  clearBootPending,
  isBootComplete,
  isBootGateBypassPath,
  isLegalPath,
  removeBootSsrVeil,
  BOOT_SESSION_KEY,
  BOOT_COMPLETE_EVENT,
} from '@/lib/config/boot-gate'
import { hasSiteConsent, SITE_CONSENT_EVENT } from '@/lib/config/site-consent'

const LEGAL_PATH = /\/(terms|privacy|cookies)$/

function readConsentGranted(): boolean {
  return typeof window !== 'undefined' ? hasSiteConsent() : false
}

function readBootDone(): boolean {
  return typeof window !== 'undefined' ? isBootComplete() : false
}

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')
  const isAdmin = pathname.includes('/admin')
  const isAdminLogin = pathname.endsWith('/admin/login')
  const isLegal = isLegalPath(pathname) || LEGAL_PATH.test(pathname)
  const [consentGranted, setConsentGranted] = useState(readConsentGranted)
  const [bootDone, setBootDone] = useState(readBootDone)
  const [consentChecked, setConsentChecked] = useState(() => typeof window !== 'undefined')

  useLayoutEffect(() => {
    setConsentGranted(hasSiteConsent())
    setBootDone(isBootComplete())
    setConsentChecked(true)
  }, [])

  useEffect(() => {
    const syncConsent = () => setConsentGranted(hasSiteConsent())
    const syncBoot = () => setBootDone(isBootComplete())
    window.addEventListener(SITE_CONSENT_EVENT, syncConsent)
    window.addEventListener(BOOT_COMPLETE_EVENT, syncBoot)
    return () => {
      window.removeEventListener(SITE_CONSENT_EVENT, syncConsent)
      window.removeEventListener(BOOT_COMPLETE_EVENT, syncBoot)
    }
  }, [])

  useLayoutEffect(() => {
    if (isBootGateBypassPath(pathname)) {
      clearBootPending()
      removeBootSsrVeil()
    }
  }, [pathname])

  useEffect(() => {
    if (isShowcase || isAdmin || isLegal) {
      clearBootPending()
      removeBootSsrVeil()
      return
    }
    if (isBootComplete()) {
      clearBootPending()
    }
  }, [isShowcase, isAdmin, isLegal, pathname])

  const finishConsent = useCallback(() => {
    setConsentGranted(true)
    sessionStorage.setItem(BOOT_SESSION_KEY, '1')
    clearBootPending()
    window.dispatchEvent(new Event(BOOT_COMPLETE_EVENT))
  }, [])

  const siteLocked = consentChecked && !consentGranted
  const showConsentFallback = siteLocked && bootDone

  if (isLegal) {
    return (
      <PageTransitionProvider>
        <Header />
        <main className="relative z-[1] min-h-screen">{children}</main>
        <Footer />
      </PageTransitionProvider>
    )
  }

  if (isShowcase) {
    return (
      <>
        <SiteConsentModal open={siteLocked} onAccepted={finishConsent} />
        <main
          className={`relative min-h-screen overflow-hidden ${siteLocked ? 'pointer-events-none select-none' : ''}`}
        >
          {children}
        </main>
      </>
    )
  }

  if (isAdmin) {
    return (
      <AdminShell variant={isAdminLogin ? 'login' : 'dashboard'}>
        <main className="relative min-h-screen">{children}</main>
      </AdminShell>
    )
  }

  return (
    <PageTransitionProvider>
      <PageLoader />
      <SiteConsentModal open={showConsentFallback} onAccepted={finishConsent} />
      <div className={siteLocked ? 'pointer-events-none select-none' : ''}>
        <SiteBackground />
        <PageTransitionOverlay />
        <CustomCursor />
        <Header />
        <main className="relative z-[1]">
          <SiteShell>{children}</SiteShell>
        </main>
        <div className="relative z-[1]">
          <Footer />
        </div>
      </div>
    </PageTransitionProvider>
  )
}
