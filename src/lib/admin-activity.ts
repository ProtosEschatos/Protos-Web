export type ActivityKind = 'contact' | 'subscriber'

export type AdminActivityItem = {
  id: string
  kind: ActivityKind
  title: string
  subtitle: string
  detail?: string | null
  created_at: string
  href: string
}

export function mergeActivity(
  contacts: Array<{
    id: string
    name: string
    email: string
    message: string | null
    service: string | null
    created_at: string | null
  }>,
  subscribers: Array<{
    id: string
    email: string
    language: string | null
    source: string | null
    created_at: string | null
  }>,
  limit = 20,
): AdminActivityItem[] {
  const fromContacts: AdminActivityItem[] = contacts.map((c) => ({
    id: `contact-${c.id}`,
    kind: 'contact' as const,
    title: c.name,
    subtitle: c.email,
    detail: c.service ? `${c.service}${c.message ? ` — ${c.message}` : ''}` : c.message,
    created_at: c.created_at ?? new Date(0).toISOString(),
    href: '/admin/inbox',
  }))

  const fromSubs: AdminActivityItem[] = subscribers.map((s) => ({
    id: `subscriber-${s.id}`,
    kind: 'subscriber' as const,
    title: 'Nova newsletter pretplata',
    subtitle: s.email,
    detail: [s.source, s.language].filter(Boolean).join(' · ') || null,
    created_at: s.created_at ?? new Date(0).toISOString(),
    href: '/admin/subscribers',
  }))

  return [...fromContacts, ...fromSubs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}
