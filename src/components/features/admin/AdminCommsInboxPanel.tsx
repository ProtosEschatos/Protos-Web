import { ArrowUpRight, Inbox, Mail, Megaphone, Send, type LucideIcon } from 'lucide-react'

import type { AdminCommsChannel, InsightStatus } from '@/lib/admin-insight-types'
import AdminLink from '@/components/features/admin/AdminLink'

const iconById: Record<string, LucideIcon> = {
  zoho: Inbox,
  'web-inbox': Inbox,
  resend: Send,
  brevo: Megaphone,
}

const statusStyles: Record<InsightStatus, string> = {
  ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warn: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  off: 'border-white/10 bg-white/5 text-[var(--light-muted)]',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
}

type Props = {
  channels: AdminCommsChannel[]
  checkedAt: string
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

function formatCheckedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat('hr-HR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AdminCommsInboxPanel({ channels, checkedAt }: Props) {
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        {channels.map((channel) => {
          const Icon = iconById[channel.id] ?? Mail

          const headerInner = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {channel.badge ? (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--primary)]/30 text-[var(--primary)]">
                      {channel.badge}
                    </span>
                  ) : null}
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[channel.status]}`}
                  >
                    {channel.statusLabel}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--light-muted)] group-hover:text-[var(--primary)] transition-colors" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--light)]">{channel.label}</h3>
                <p className="text-xs text-[var(--light-muted)] mt-1 leading-relaxed">{channel.role}</p>
                <p className="text-[11px] text-[var(--light-muted)]/90 mt-2 leading-relaxed">{channel.detail}</p>
              </div>
            </>
          )

          return (
            <article
              key={channel.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 overflow-hidden"
            >
              {channel.external ? (
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 p-4 hover:bg-[var(--dark-card)]/80 transition-colors border-b border-white/5"
                >
                  {headerInner}
                </a>
              ) : (
                <AdminLink
                  href={channel.href}
                  className="group flex flex-col gap-3 p-4 hover:bg-[var(--dark-card)]/80 transition-colors border-b border-white/5"
                >
                  {headerInner}
                </AdminLink>
              )}

              {channel.notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {channel.notifications.map((note) => (
                    <AdminLink
                      key={note.id}
                      href={note.href}
                      className="flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--light)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {note.title}
                        </p>
                        <p className="text-xs text-[var(--light-muted)] truncate">{note.subtitle}</p>
                        {note.detail ? (
                          <p className="text-[11px] text-[var(--light-muted)] mt-0.5 line-clamp-1">{note.detail}</p>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-[var(--light-muted)] shrink-0">{formatWhen(note.created_at)}</span>
                    </AdminLink>
                  ))}
                </div>
              ) : channel.id === 'zoho' ? (
                <p className="px-4 py-3 text-[11px] text-[var(--light-muted)] border-t border-white/5">
                  Otvori Inbox u adminu za sve dolazne mailove.
                </p>
              ) : channel.id === 'resend' ? (
                <p className="px-4 py-3 text-[11px] text-[var(--light-muted)] border-t border-white/5">
                  Resend nema inbox — samo log slanja u Resend dashboardu.
                </p>
              ) : (
                <p className="px-4 py-3 text-[11px] text-[var(--light-muted)] border-t border-white/5">
                  Nema novih obavijesti.
                </p>
              )}
            </article>
          )
        })}
      </div>
      <p className="text-[10px] text-[var(--light-muted)] mt-3">
        Provjera: {formatCheckedAt(checkedAt)} · Mail i web upiti u /admin/inbox
      </p>
    </div>
  )
}
