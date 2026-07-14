'use client'

import { useState, useTransition } from 'react'
import { Loader2, Mail, RefreshCw } from 'lucide-react'
import { adminGetMailMessage, adminListMailbox, adminRefreshMailbox } from '@/actions/admin-mail'
import { mailboxSetupHint, type MailboxId, type MailboxProvider } from '@/lib/mail/mailboxes'
import type { MailListItem } from '@/lib/mail/imap-client'

type Props = {
  mailboxId: MailboxId
  title: string
  initialMessages: MailListItem[]
  initialError?: string
  initialSource?: 'live' | 'cache'
  initialSyncedAt?: string
  configured: boolean
  mailbox: string
  provider: MailboxProvider
}

function formatWhen(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('hr-HR')
  } catch {
    return ''
  }
}

export default function AdminMailboxPanel({
  mailboxId,
  title,
  initialMessages,
  initialError,
  initialSource = 'live',
  initialSyncedAt,
  configured,
  mailbox,
  provider,
}: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [error, setError] = useState(initialError)
  const [source, setSource] = useState<'live' | 'cache'>(initialSource)
  const [syncedAt, setSyncedAt] = useState(initialSyncedAt)
  const [selectedUid, setSelectedUid] = useState<number | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [bodyError, setBodyError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function refresh() {
    startTransition(async () => {
      const res = await adminRefreshMailbox(mailboxId, 40)
      setMessages(res.messages)
      setError(res.error)
      setSource(res.source)
      setSyncedAt(res.syncedAt)
      setSelectedUid(null)
      setBody(null)
    })
  }

  function openMessage(uid: number) {
    setSelectedUid(uid)
    setBody(null)
    setBodyError(null)
    startTransition(async () => {
      const res = await adminGetMailMessage(mailboxId, uid)
      if (res.error) {
        setBodyError(res.error)
        return
      }
      setBody(res.message?.text ?? null)
    })
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
        <p className="font-semibold mb-2">
          {title} — IMAP nije spojen
        </p>
        <p className="text-amber-100/90 leading-relaxed">
          {mailboxSetupHint(mailboxId)}
          {provider === 'gmail' ? (
            <>
              {' '}
              Za <strong>{mailbox}</strong> kreiraj App Password u Google Account → Security.
            </>
          ) : null}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--light-muted)]">
          <span className="text-[var(--light)] font-medium">{title}</span>
          {' · '}
          <span className="text-[var(--light)]">{mailbox}</span>
          {source === 'cache' && syncedAt ? (
            <span className="text-amber-200/90"> — cache od {formatWhen(syncedAt)}</span>
          ) : (
            <span> — live IMAP</span>
          )}
        </p>
        <button
          type="button"
          onClick={refresh}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-[var(--light-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Osvježi
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-400 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">{error}</p>
      ) : null}

      <div className="rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
        {messages.length === 0 ? (
          <p className="px-4 py-8 text-center text-[var(--light-muted)]">Nema mailova u inboxu.</p>
        ) : (
          messages.map((m) => (
            <button
              key={m.uid}
              type="button"
              onClick={() => openMessage(m.uid)}
              className={`w-full text-left px-4 py-4 hover:bg-white/[0.03] transition-colors ${
                selectedUid === m.uid ? 'bg-white/[0.04]' : ''
              }`}
            >
              <div className="flex flex-wrap justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {!m.seen ? (
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                  ) : (
                    <Mail className="h-3.5 w-3.5 text-[var(--light-muted)] shrink-0" />
                  )}
                  <p className="font-medium text-[var(--light)] truncate">{m.subject}</p>
                </div>
                <span className="text-[10px] text-[var(--light-muted)] shrink-0">{formatWhen(m.date)}</span>
              </div>
              <p className="text-xs text-[var(--light-muted)] truncate">{m.from}</p>
            </button>
          ))
        )}
      </div>

      {selectedUid != null ? (
        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--light-muted)] mb-3">Sadržaj poruke</p>
          {pending && !body ? (
            <div className="flex items-center gap-2 text-sm text-[var(--light-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" /> Učitavam…
            </div>
          ) : bodyError ? (
            <p className="text-sm text-red-400">{bodyError}</p>
          ) : (
            <pre className="text-sm text-[var(--light-muted)] whitespace-pre-wrap font-sans leading-relaxed max-h-[420px] overflow-y-auto">
              {body ?? '—'}
            </pre>
          )}
        </div>
      ) : null}
    </div>
  )
}
