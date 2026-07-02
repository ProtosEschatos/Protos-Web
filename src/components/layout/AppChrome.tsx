'use client'

import { useEffect } from 'react'
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
import { clearBootPending, removeBootSsrVeil } from '@/lib/boot-gate'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')

  useEffect(() => {
    if (!isShowcase) return
    clearBootPending()
    removeBootSsrVeil()
  }, [isShowcase])

  if (isShowcase) {
    return <main className="relative min-h-0 overflow-hidden">{children}</main>
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
