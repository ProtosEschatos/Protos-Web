'use client'

import SiteBackground from '@/components/ui/SiteBackground'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteBackground />
      <div className="relative z-[1] cosmic-site">{children}</div>
    </>
  )
}
