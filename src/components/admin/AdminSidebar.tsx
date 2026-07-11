'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/routing'
import { useLocale } from 'next-intl'
import { Menu, X } from 'lucide-react'
import AdminLink from '@/components/admin/AdminLink'
import { ADMIN_NAV_SECTIONS, isAdminNavActive } from '@/lib/admin-nav'
import { adminNavIcon } from '@/lib/admin-nav-icons'
import { adminHref } from '@/lib/admin-path'
import { Link } from '@/routing'

export default function AdminSidebar() {
  const pathname = usePathname()
  const locale = useLocale()
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
    <div className="flex h-full flex-col">
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.id} className="mb-5 last:mb-0">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--primary)]/80">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isAdminNavActive(pathname, item.href, item.exact)
              const Icon = adminNavIcon(item.id)
              return (
                <li key={item.id}>
                  <AdminLink
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      active
                        ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/25 shadow-[0_0_20px_rgba(255,136,0,0.08)]'
                        : 'text-[var(--light-muted)] hover:text-[var(--light)] hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[var(--primary)]' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </AdminLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="mt-auto pt-4 border-t border-white/5">
        <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-[var(--light-muted)] mb-2">
          Javni navbar
        </p>
        <ul className="space-y-0.5 text-xs">
          {ADMIN_NAV_SECTIONS.find((s) => s.id === 'pages')?.items.map((item) =>
            item.publicHref ? (
              <li key={`pub-${item.id}`}>
                <Link
                  href={item.publicHref}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  <span className="h-1 w-1 rounded-full bg-[var(--primary)]/50" />
                  {item.label}
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[#100818]/90 text-[var(--primary)] shadow-lg backdrop-blur-md"
        aria-label="Otvori admin izbornik"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          aria-label="Zatvori izbornik"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-[min(18rem,88vw)] shrink-0 border-r border-white/5 bg-[#0d0614]/85 backdrop-blur-xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold text-[var(--light)]">Navigacija</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-[var(--light-muted)] hover:bg-white/5"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-full overflow-y-auto p-4 pb-24">{navBody}</div>
      </aside>

      {/* Hidden route map for crawlers/debug — not in public HTML nav */}
      <nav aria-hidden className="sr-only">
        {ADMIN_NAV_SECTIONS.flatMap((s) => s.items).map((item) => (
          <a key={item.id} href={adminHref(item.href, locale)}>
            {item.label}
          </a>
        ))}
      </nav>
    </>
  )
}
