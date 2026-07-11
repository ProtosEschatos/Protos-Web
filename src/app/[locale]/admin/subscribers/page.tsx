import { setRequestLocale } from 'next-intl/server'
import { adminListSubscribers } from '@/actions/admin-notifications'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminLink from '@/components/features/admin/AdminLink'
import { ADMIN_COMMS_SERVICES } from '@/lib/config/admin-links'
import { Mail } from 'lucide-react'

type Props = { params: { locale: string } }

export default async function AdminSubscribersPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const subscribers = await adminListSubscribers(100)

  return (
    <AdminPageShell
      title="Newsletter pretplatnici"
      description={ADMIN_COMMS_SERVICES.brevo.role}
    >
      <p className="text-sm text-[var(--light-muted)] mb-6">
        Brevo liste:{' '}
        <a
          href={ADMIN_COMMS_SERVICES.brevo.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--primary)] hover:underline"
        >
          otvori Brevo kontakte
        </a>
        {' · '}
        <AdminLink href="/admin" className="text-[var(--primary)] hover:underline">
          ← natrag na pregled
        </AdminLink>
      </p>

      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-[var(--primary)]" />
        <h2 className="text-lg font-semibold text-[var(--light)]">
          Pretplatnici u bazi ({subscribers.length})
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 divide-y divide-white/5">
        {subscribers.length === 0 ? (
          <p className="px-4 py-8 text-center text-[var(--light-muted)]">Još nema pretplatnika.</p>
        ) : (
          subscribers.map((s) => (
            <article key={s.id} className="px-4 py-4 flex flex-wrap justify-between gap-3">
              <div>
                <a href={`mailto:${s.email}`} className="font-medium text-[var(--primary)] hover:underline">
                  {s.email}
                </a>
                <p className="text-xs text-[var(--light-muted)] mt-1">
                  {[s.source, s.language].filter(Boolean).join(' · ') || 'web footer'}
                </p>
              </div>
              <p className="text-xs text-[var(--light-muted)]">
                {s.created_at ? new Date(s.created_at).toLocaleString('hr-HR') : ''}
              </p>
            </article>
          ))
        )}
      </div>
    </AdminPageShell>
  )
}
