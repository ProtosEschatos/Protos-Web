'use client'

import { Suspense, useTransition } from 'react'
import { Monitor, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminLink from '@/components/features/admin/AdminLink'
import AdminActivityBadge from '@/components/features/admin/AdminActivityBadge'
import AdminClock from '@/components/features/admin/AdminClock'
import AdminLogoutButton from '@/components/features/admin/AdminLogoutButton'
import { findAdminNavItem } from '@/lib/admin-nav'
import { usePathname } from '@/navigation'
import { SITE_URL } from '@/lib/config/site'
import { toast } from '@/lib/stores/toast-store'

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const current = findAdminNavItem(pathname)
  const [pending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(() => {
      router.refresh()
      toast.success('Sinkronizirano', current?.label ? `Osvježeno: ${current.label}` : undefined, 2500)
    })
  }

  return (
    <header
      id="admin-header"
      className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 bg-slate-900/60 px-6 py-4 shadow-md backdrop-blur-md"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/10 p-2 text-indigo-400">
          <Monitor className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="flex flex-wrap items-center gap-2 text-base font-bold tracking-tight text-slate-100">
            Protosweb
            <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400 admin-mono">
              Console v3.0
            </span>
          </h1>
          <p className="mt-0.5 truncate text-[10px] text-slate-500 admin-mono">
            {current?.label ?? 'Admin'} · Creative Studio Suite
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs admin-mono">
        <AdminClock />

        <Suspense fallback={null}>
          <AdminActivityBadge />
        </Suspense>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={pending}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-400 transition-all hover:text-slate-200 disabled:opacity-60"
          title="Osvježi podatke"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${pending ? 'animate-spin text-indigo-400' : ''}`} />
          <span className="hidden sm:inline">Sinkroniziraj</span>
        </button>

        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg border border-slate-800 px-3 py-1.5 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 sm:inline-flex"
        >
          protosweb.eu ↗
        </a>

        <AdminLogoutButton />
      </div>
    </header>
  )
}
