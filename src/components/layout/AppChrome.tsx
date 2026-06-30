'use client'

import { usePathname } from '@/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageLoader from '@/components/ui/PageLoader'
import CustomCursor from '@/components/ui/CustomCursor'
import CookieBanner from '@/components/ui/CookieBanner'
import SiteShell from '@/components/ui/SiteShell'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')

  if (isShowcase) {
    return <main className="relative">{children}</main>
  }

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <Header />
      <main>
        <SiteShell>{children}</SiteShell>
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
