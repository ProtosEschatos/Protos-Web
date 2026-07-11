import { setRequestLocale } from 'next-intl/server'
import { Plus } from 'lucide-react'
import { adminListPortfolioItems } from '@/lib/admin/portfolio-queries'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminLink from '@/components/admin/AdminLink'

type Props = { params: { locale: string } }

export default async function AdminPortfolioPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const items = await adminListPortfolioItems(locale)

  return (
    <AdminPageShell title="Portfolio" description="Upravljanje projektima u Supabase bazi (portfolio_items).">
      <div className="flex justify-end mb-6">
        <AdminLink
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Novi projekt
        </AdminLink>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--dark-card)]/80 text-[var(--light-muted)] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Naziv</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Tag</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Red</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--light-muted)]">
                  Nema projekata za {locale.toUpperCase()}.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-[var(--light)]">{item.title}</td>
                  <td className="px-4 py-3 text-[var(--light-muted)] hidden sm:table-cell">{item.tag ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        item.active
                          ? 'border-emerald-500/30 text-emerald-400'
                          : 'border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {item.active ? 'Aktivno' : 'Skriveno'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--light-muted)] hidden md:table-cell">{item.sort_order ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <AdminLink href={`/admin/portfolio/${item.id}/edit`} className="text-[var(--primary)] hover:underline">
                      Uredi
                    </AdminLink>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPageShell>
  )
}
