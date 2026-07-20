import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import { listAuditEvents } from '@/lib/queries/admin/audit'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ event?: string; source?: string }>
}

export default async function AdminAuditPage(props: Props) {
  const { locale } = await props.params
  const { event, source } = await props.searchParams
  setRequestLocale(locale)

  const { rows, total } = await listAuditEvents({ event, source, limit: 200 })

  return (
    <AdminPageShell
      title="Audit log"
      description={`Sve write akcije koje su publish/vault/webhook actions zabilježile. Ukupno u DB: ${total}.`}
    >
      <form className="admin-card flex flex-wrap items-end gap-3 p-4" method="get">
        <label className="flex flex-col text-xs text-slate-400">
          Event contains
          <input
            name="event"
            defaultValue={event ?? ''}
            placeholder="publish.bluesky"
            className="admin-input mt-1 min-w-[220px]"
          />
        </label>
        <label className="flex flex-col text-xs text-slate-400">
          Source contains
          <input
            name="source"
            defaultValue={source ?? ''}
            placeholder="admin-publish"
            className="admin-input mt-1 min-w-[200px]"
          />
        </label>
        <button type="submit" className="admin-btn admin-btn-primary">
          Filter
        </button>
        <Link href={`/${locale}/admin/audit`} className="admin-btn admin-btn-ghost">
          Reset
        </Link>
      </form>

      {rows.length === 0 ? (
        <div className="admin-card p-10 text-center text-sm text-slate-500">
          Nema unosa za te filtere. Kad počneš objavljivati, ovdje će se
          upisivati svaki poziv (uspješan i neuspješan).
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Kada</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Payload</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-800/60 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                    {new Date(row.createdAt).toLocaleString('hr-HR', {
                      timeZone: 'Europe/Zagreb',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`admin-mono inline-flex rounded-full px-2 py-0.5 text-[11px] ${
                        row.event.endsWith('.error')
                          ? 'bg-red-500/10 text-red-300'
                          : row.event.endsWith('.ok')
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-indigo-500/10 text-indigo-300'
                      }`}
                    >
                      {row.event}
                    </span>
                  </td>
                  <td className="admin-mono px-4 py-3 text-xs text-slate-400">{row.source}</td>
                  <td className="px-4 py-3">
                    <pre className="admin-mono max-w-lg overflow-x-auto text-[11px] text-slate-500">
{JSON.stringify(row.payload, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageShell>
  )
}
