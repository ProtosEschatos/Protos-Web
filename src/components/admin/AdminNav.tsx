'use client'

import { usePathname } from '@/routing'
import AdminLink from '@/components/admin/AdminLink'
import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  Inbox,
  LayoutGrid,
  LayoutDashboard,
  Mail,
  Wrench,
} from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Pregled', icon: LayoutDashboard, exact: true },
  { href: '/admin/inbox', label: 'Kontakt', icon: Inbox },
  { href: '/admin/subscribers', label: 'Newsletter', icon: Mail },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/portfolio', label: 'Portfolio', icon: LayoutGrid },
  { href: '/admin/tools', label: 'Alati', icon: Wrench },
]

function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  const path = pathname.replace(/\/$/, '')
  if (exact) {
    return path === href || path.endsWith(href) && !path.includes(`${href}/`)
  }
  return path.includes(href)
}

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/5 bg-[#0d0614]/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href, item.exact)
            const Icon = item.icon
            return (
              <AdminLink
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/25'
                    : 'text-[var(--light-muted)] hover:text-[var(--light)] hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </AdminLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
