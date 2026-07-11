'use client'

import { useEffect, useState, useLayoutEffect } from 'react'
import { usePathname } from '@/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageLoader from '@/components/ui/PageLoader'
import CustomCursor from '@/components/ui/CustomCursor'
import CookieBanner from '@/components/ui/CookieBanner'
import SiteShell from '@/components/ui/SiteShell'
import SiteBackground from '@/components/ui/SiteBackground'
import { PageTransitionProvider } from '@/components/navigation/PageTransitionProvider'
import PageTransitionOverlay from '@/components/navigation/PageTransitionOverlay'
import SiteConsentModal from '@/components/legal/SiteConsentModal'
import { clearBootPending, isBootComplete, removeBootSsrVeil, BOOT_SESSION_KEY, BOOT_COMPLETE_EVENT } from '@/lib/boot-gate'
import { hasSiteConsent } from '@/lib/site-consent'

const LEGAL_PATH = /\/(terms|privacy|cookies)$/

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')
  const isAdmin = pathname.includes('/admin')
  const isLegal = LEGAL_PATH.test(pathname)
  const [showcaseBlocked, setShowcaseBlocked] = useState(true)

  useLayoutEffect(() => {
    setShowcaseBlocked(!hasSiteConsent())
  }, [])

  useEffect(() => {
    if (isShowcase || isAdmin || isLegal) {
      clearBootPending()
      removeBootSsrVeil()
      return
    }
    if (isBootComplete()) {
      clearBootPending()
    }
  }, [isShowcase, isAdmin, isLegal])

  const finishShowcaseConsent = () => {
    sessionStorage.setItem(BOOT_SESSION_KEY, '1')
    clearBootPending()
    window.dispatchEvent(new Event(BOOT_COMPLETE_EVENT))
    setShowcaseBlocked(false)
  }

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
        <SiteConsentModal open={showcaseBlocked} onAccepted={finishShowcaseConsent} />
        <main className={`relative min-h-0 overflow-hidden ${showcaseBlocked ? 'pointer-events-none select-none' : ''}`}>
          {children}
        </main>
      </>
    )
  }

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <PageTransitionProvider>
      <PageLoader />
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
      <CookieBanner />
    </PageTransitionProvider>
  )
}
