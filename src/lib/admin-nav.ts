export type AdminNavItem = {
  id: string
  href: string
  label: string
  exact?: boolean
  /** Javna stranica na protosweb.eu (isti redoslijed kao navbar) */
  publicHref?: string
  description?: string
}

export type AdminNavSection = {
  id: string
  label: string
  items: AdminNavItem[]
}

/** Isti redoslijed kao javni navbar u Header.tsx + admin-only sekcija. */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    id: 'overview',
    label: 'Pregled',
    items: [
      {
        id: 'dashboard',
        href: '/admin',
        label: 'Početna',
        exact: true,
        description: 'Statistike, inboxi, sigurnost i marketing',
      },
    ],
  },
  {
    id: 'pages',
    label: 'Stranice',
    items: [
      {
        id: 'about',
        href: '/admin/stranice/o-meni',
        label: 'O nama',
        publicHref: '/o-meni',
        description: 'Tim, misija i hero sekcija',
      },
      {
        id: 'process',
        href: '/admin/stranice/proces',
        label: 'Proces',
        publicHref: '/proces',
        description: 'Koraci suradnje i timeline',
      },
      {
        id: 'portfolio',
        href: '/admin/portfolio',
        label: 'Portfolio',
        publicHref: '/portfolio',
        description: 'Projekti u Supabase bazi',
      },
      {
        id: 'services',
        href: '/admin/stranice/usluge',
        label: 'Usluge',
        publicHref: '/usluge',
        description: 'Ponuda i paketi usluga',
      },
      {
        id: 'blog',
        href: '/admin/blog',
        label: 'Blog',
        publicHref: '/blog',
        description: 'Članci i objave',
      },
      {
        id: 'contact',
        href: '/admin/inbox',
        label: 'Inbox',
        publicHref: '/kontakt',
        description: 'Mail + kontakt forma',
      },
      {
        id: 'donations',
        href: '/admin/donacije',
        label: 'Donacije',
        publicHref: '/o-meni',
        description: 'Stripe uplate s O nama stranice',
      },
    ],
  },
  {
    id: 'system',
    label: 'Sustav',
    items: [
      {
        id: 'subscribers',
        href: '/admin/subscribers',
        label: 'Newsletter',
        description: 'Pretplatnici i Brevo liste',
      },
      {
        id: 'memory',
        href: '/admin/memory',
        label: 'Memorija',
        description: 'Protos-Agent znanje (read-only)',
      },
      {
        id: 'ai',
        href: '/admin/ai',
        label: 'AI asistent',
        description: 'DeepSeek / Gemini chat',
      },
      {
        id: 'tools',
        href: '/admin/tools',
        label: 'Alati',
        description: 'Vercel, DNS, platforme',
      },
    ],
  },
]

export const ADMIN_NAV_ITEMS = ADMIN_NAV_SECTIONS.flatMap((section) => section.items)

export function adminNavPath(pathname: string): string {
  return pathname.replace(/\/$/, '')
}

export function isAdminNavActive(pathname: string, href: string, exact?: boolean): boolean {
  const path = adminNavPath(pathname)
  if (exact) {
    return path === href || (path.endsWith(href) && !path.includes(`${href}/`))
  }
  return path === href || path.startsWith(`${href}/`) || path.endsWith(href)
}

export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
  const path = adminNavPath(pathname)
  return ADMIN_NAV_ITEMS.find((item) => isAdminNavActive(path, item.href, item.exact))
}
