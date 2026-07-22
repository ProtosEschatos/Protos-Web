'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ShieldX, RotateCw, Trash2 } from 'lucide-react'
import {
  adminRevokeSession,
  adminRevokeAllOtherSessions,
} from '@/actions/admin-sessions'

type Session = {
  id: string
  ip: string | null
  userAgent: string | null
  createdAt: string
  lastSeenAt: string
  expiresAt: string
  revoked: boolean
  isCurrent: boolean
}

type Props = { sessions: Session[] }

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleString('hr-HR', { timeZone: 'Europe/Zagreb' })
}

function truncateUA(ua: string | null): string {
  if (!ua) return '—'
  // Strip most parenthetical bloat, keep the tail (browser name/version).
  const trimmed = ua.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim()
  return trimmed.length > 90 ? `${trimmed.slice(0, 87)}…` : trimmed
}

export default function AdminSessionsClient({ sessions }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const active = sessions.filter((s) => !s.revoked)
  const revokedCount = sessions.length - active.length

  function handleRevoke(id: string) {
    setError(null)
    setInfo(null)
    startTransition(async () => {
      const r = await adminRevokeSession(id)
      if (r.success) {
        setInfo('Sesija opozvana.')
        router.refresh()
      } else {
        setError(r.error)
      }
    })
  }

  function handleRevokeOthers() {
    setError(null)
    setInfo(null)
    if (!confirm('Opozvati SVE ostale sesije osim trenutne?')) return
    startTransition(async () => {
      const r = await adminRevokeAllOtherSessions()
      if (r.success) {
        setInfo(`Opozvano: ${r.data.revoked} sesija.`)
        router.refresh()
      } else {
        setError(r.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="admin-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="text-xs text-slate-400">
          Aktivnih: <span className="text-slate-100">{active.length}</span> · Opozvanih (zadnjih 50):{' '}
          <span className="text-slate-100">{revokedCount}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.refresh()}
            disabled={pending}
            className="admin-btn admin-btn-ghost inline-flex items-center gap-1.5"
          >
            <RotateCw className="h-4 w-4" />
            Osvježi
          </button>
          <button
            type="button"
            onClick={handleRevokeOthers}
            disabled={pending || active.length <= 1}
            className="admin-btn admin-btn-primary inline-flex items-center gap-1.5"
          >
            <ShieldX className="h-4 w-4" />
            Opozovi sve ostale
          </button>
        </div>
      </div>

      {error ? (
        <div className="admin-card border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {info ? (
        <div className="admin-card border-emerald-500/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">
          {info}
        </div>
      ) : null}

      {sessions.length === 0 ? (
        <div className="admin-card p-10 text-center text-sm text-slate-500">
          Nema aktivnih sesija (jedino ovakav prazan popis vidiš ako Supabase
          service_role env nije dostupan — provjeri konfiguraciju).
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Browser</th>
                <th className="px-4 py-3">Prijava</th>
                <th className="px-4 py-3">Zadnji hit</th>
                <th className="px-4 py-3">Ističe</th>
                <th className="px-4 py-3 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-slate-800/60 align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {s.revoked ? (
                      <span className="admin-mono inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300">
                        <ShieldX className="h-3 w-3" />
                        opozvana
                      </span>
                    ) : s.isCurrent ? (
                      <span className="admin-mono inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                        <ShieldCheck className="h-3 w-3" />
                        aktivna (ova)
                      </span>
                    ) : (
                      <span className="admin-mono inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-300">
                        aktivna
                      </span>
                    )}
                  </td>
                  <td className="admin-mono whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                    {s.ip ?? '—'}
                  </td>
                  <td className="admin-mono px-4 py-3 text-xs text-slate-500">
                    {truncateUA(s.userAgent)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                    {formatDateShort(s.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                    {formatDateShort(s.lastSeenAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                    {formatDateShort(s.expiresAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.revoked || s.isCurrent ? (
                      <span className="text-xs text-slate-600">—</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRevoke(s.id)}
                        disabled={pending}
                        className="admin-btn admin-btn-ghost inline-flex items-center gap-1 text-xs text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Opozovi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
