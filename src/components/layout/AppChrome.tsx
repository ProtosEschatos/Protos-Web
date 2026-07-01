'use client'

import { usePathname } from '@/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageLoader from '@/components/ui/PageLoader'
import CustomCursor from '@/components/ui/CustomCursor'
import CookieBanner from '@/components/ui/CookieBanner'
import SiteShell from '@/components/ui/SiteShell'
import { PageTransitionProvider } from '@/components/navigation/PageTransitionProvider'
import PageTransitionOverlay from '@/components/navigation/PageTransitionOverlay'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')

  if (isShowcase) {
    return <main className="relative min-h-0 overflow-hidden">{children}</main>
  }

  return (
    <PageTransitionProvider>
      <PageLoader />
      <PageTransitionOverlay />
      <CustomCursor />
      <Header />
      <main className="relative">
        <SiteShell>{children}</SiteShell>
      </main>
      <Footer />
      <CookieBanner />
    </PageTransitionProvider>
  )
}
