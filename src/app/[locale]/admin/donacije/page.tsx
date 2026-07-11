import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import {
  adminGetDonationSummary,
  adminListDonations,
  causeLabel,
  formatEuro,
  statusBadge,
} from '@/lib/queries/admin/donations'

type Props = { params: { locale: string } }

export default async function AdminDonationsPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const [donations, summary] = await Promise.all([
    adminListDonations(100),
    adminGetDonationSummary(),
  ])

  return (
    <AdminPageShell
      title="Donacije"
      description="Stripe uplate s /o-meni — iznosi 1–1000 EUR."
    >
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--light-muted)]">Uspješno</p>
          <p className="text-2xl font-bold text-[var(--primary)] mt-1">
            {formatEuro(summary.totals.completed)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--light-muted)]">Na čekanju</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {formatEuro(summary.totals.pending)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--light-muted)]">Ukupno uplaćeno</p>
          <p className="text-2xl font-bold text-[var(--light)] mt-1">
            {formatEuro(summary.totals.allTime)}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-[var(--light)] mb-4">Sve donacije</h2>
      <div className="rounded-2xl border border-white/10 divide-y divide-white/5 overflow-x-auto">
        {donations.length === 0 ? (
          <p className="px-4 py-8 text-center text-[var(--light-muted)]">Još nema donacija.</p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-[var(--light-muted)] border-b border-white/5">
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Iznos</th>
                <th className="px-4 py-3">Cilj</th>
                <th className="px-4 py-3">Donator</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-[var(--light-muted)] whitespace-nowrap">
                    {d.created_at ? new Date(d.created_at).toLocaleString('hr-HR') : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--light)]">
                    {formatEuro(d.amount)}
                  </td>
                  <td className="px-4 py-3 text-[var(--light-muted)]">{causeLabel(d.cause)}</td>
                  <td className="px-4 py-3">
                    <p className="text-[var(--light)]">{d.name || '—'}</p>
                    <p className="text-xs text-[var(--primary)]">{d.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        d.status === 'completed'
                          ? 'bg-green-500/15 text-green-400'
                          : d.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-white/10 text-[var(--light-muted)]'
                      }`}
                    >
                      {statusBadge(d.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminPageShell>
  )
}
