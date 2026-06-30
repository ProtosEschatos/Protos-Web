'use client'

import { usePathname } from '@/routing'
import SiteBackground from '@/components/ui/SiteBackground'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')

  if (isShowcase) {
    return <>{children}</>
  }

  return (
    <>
      <SiteBackground />
      <div className="relative z-[1] cosmic-site">{children}</div>
    </>
  )
}
