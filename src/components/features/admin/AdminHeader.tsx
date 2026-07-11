'use client'

import { Suspense } from 'react'
import AdminLink from '@/components/features/admin/AdminLink'
import AdminActivityBadge from '@/components/features/admin/AdminActivityBadge'
import { SITE_URL } from '@/lib/config/site'
import AdminBrandMark from '@/components/features/admin/AdminBrandMark'
import AdminLogoutButton from '@/components/features/admin/AdminLogoutButton'
import { findAdminNavItem } from '@/lib/admin-nav'
import { usePathname } from '@/routing'

export default function AdminHeader() {
  const pathname = usePathname()
  const current = findAdminNavItem(pathname)

  return (
    <header className="sticky top-0 z-[3] border-b border-white/5 bg-[#100818]/95">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <AdminLink href="/admin" className="group flex min-w-0 items-center gap-3">
          <AdminBrandMark className="h-8 w-8" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">Privatno</p>
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-[var(--light)] group-hover:text-[var(--primary)] transition-colors">
                {current?.label ?? 'Admin'}
              </p>
              <Suspense fallback={null}>
                <AdminActivityBadge />
              </Suspense>
            </div>
          </div>
        </AdminLink>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[var(--light-muted)] transition-colors hover:border-white/20 hover:text-[var(--light)]"
          >
            protosweb.eu ↗
          </a>
          <AdminLogoutButton />
        </div>
      </div>
    </header>
  )
}
