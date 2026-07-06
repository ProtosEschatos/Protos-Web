import AdminLink from '@/components/admin/AdminLink'
import type { AdminActivityItem } from '@/lib/admin-activity'
import { Inbox, Mail } from 'lucide-react'

type Props = {
  items: AdminActivityItem[]
  emptyMessage?: string
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString('hr-HR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function AdminActivityFeed({
  items,
  emptyMessage = 'Nema nedavne aktivnosti.',
}: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-[var(--light-muted)] px-1">{emptyMessage}</p>
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/40 divide-y divide-white/5">
      {items.map((item) => {
        const Icon = item.kind === 'contact' ? Inbox : Mail
        const kindLabel = item.kind === 'contact' ? 'Kontakt forma' : 'Newsletter'

        return (
          <AdminLink
            key={item.id}
            href={item.href}
            className="flex gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
          >
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                item.kind === 'contact'
                  ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                  : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-[var(--light)] group-hover:text-[var(--primary)] transition-colors">
                  {item.title}
                </p>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-[var(--light-muted)]">
                  {kindLabel}
                </span>
              </div>
              <p className="text-sm text-[var(--light-muted)] truncate">{item.subtitle}</p>
              {item.detail ? (
                <p className="text-xs text-[var(--light-muted)] mt-1 line-clamp-2">{item.detail}</p>
              ) : null}
            </div>
            <p className="text-xs text-[var(--light-muted)] shrink-0">{formatWhen(item.created_at)}</p>
          </AdminLink>
        )
      })}
    </div>
  )
}
