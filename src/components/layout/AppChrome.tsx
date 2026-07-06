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
import AdminShell from '@/components/admin/AdminShell'
import { clearBootPending, isBootComplete, removeBootSsrVeil } from '@/lib/boot-gate'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')
  const isAdmin = pathname.includes('/admin')
  const isAdminLogin = pathname.endsWith('/admin/login')

  useEffect(() => {
    if (isShowcase || isAdmin) {
      clearBootPending()
      removeBootSsrVeil()
      return
    }
    if (isBootComplete()) {
      clearBootPending()
    }
  }, [isShowcase, isAdmin])

  if (isShowcase) {
    return <main className="relative min-h-0 overflow-hidden">{children}</main>
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
