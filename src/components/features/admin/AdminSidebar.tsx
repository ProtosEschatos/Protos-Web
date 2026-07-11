'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/routing'
import { Activity, Cpu, Menu, X, Zap } from 'lucide-react'
import AdminLink from '@/components/features/admin/AdminLink'
import { ADMIN_NAV_SECTIONS, isAdminNavActive } from '@/lib/admin-nav'
import { adminNavIcon } from '@/lib/admin-nav-icons'
import { Link } from '@/routing'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const navBody = (
    <>
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.id} className="mb-4">
          <span className="admin-mono mb-2 block px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {section.id === 'overview' ? 'Nadzorni moduli' : section.label}
          </span>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = isAdminNavActive(pathname, item.href, item.exact)
              const Icon = adminNavIcon(item.id)
              return (
                <li key={item.id}>
                  <AdminLink
                    href={item.href}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      active ? 'admin-nav-active' : 'admin-nav-idle'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </AdminLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="admin-card mt-6 space-y-4 p-4">
        <span className="admin-mono block text-[10px] uppercase tracking-wider text-slate-500">
          Sistemska memorija
        </span>
        <div className="admin-mono space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" /> Stack
            </span>
            <span className="font-semibold text-slate-300">Next.js 14</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-sky-400" /> Deploy
            </span>
            <span className="font-semibold text-slate-300">Vercel</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" /> Baza
            </span>
            <span className="font-semibold text-slate-300">Supabase</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-900 pt-4">
        <p className="admin-mono mb-2 px-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          Javni navbar
        </p>
        <ul className="space-y-0.5 text-xs">
          {ADMIN_NAV_SECTIONS.find((s) => s.id === 'pages')?.items.map((item) =>
            item.publicHref ? (
              <li key={`pub-${item.id}`}>
                <Link
                  href={item.publicHref}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-500 transition-colors hover:text-indigo-400"
                >
                  <span className="h-1 w-1 rounded-full bg-indigo-500/50" />
                  {item.label}
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/30 bg-slate-950/95 text-indigo-400 shadow-lg lg:hidden"
        aria-label="Otvori admin izbornik"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Zatvori izbornik"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="dashboard-sidebar"
        className={`fixed z-40 h-[calc(100vh-5.5rem)] w-[min(18rem,88vw)] shrink-0 overflow-y-auto border-r border-slate-900 bg-slate-950/95 p-4 transition-transform duration-200 lg:sticky lg:top-[4.5rem] lg:z-0 lg:h-auto lg:w-64 lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:p-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-3 flex items-center justify-between border-b border-slate-900 pb-3 lg:hidden">
          <span className="text-sm font-semibold text-slate-200">Navigacija</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-900"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {navBody}
      </aside>
    </>
  )
}
