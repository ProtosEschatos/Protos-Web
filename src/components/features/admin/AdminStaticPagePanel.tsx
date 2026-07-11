import AdminLink from '@/components/features/admin/AdminLink'
import { ExternalLink, Eye } from 'lucide-react'
import { Link } from '@/routing'

type Props = {
  title: string
  description: string
  publicHref: string
  sourceHint: string
  sourcePaths: { label: string; path: string }[]
}

export default function AdminStaticPagePanel({
  title,
  description,
  publicHref,
  sourceHint,
  sourcePaths,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--light)]">{title}</h2>
            <p className="text-sm text-[var(--light-muted)] mt-2 max-w-xl">{description}</p>
            <p className="text-xs text-[var(--light-muted)] mt-3">{sourceHint}</p>
          </div>
          <Link
            href={publicHref}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Pogledaj live
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="border-b border-white/5 bg-[var(--dark-card)]/60 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--light-muted)]">Izvor sadržaja</p>
        </div>
        <ul className="divide-y divide-white/5">
          {sourcePaths.map((entry) => (
            <li key={entry.path} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm text-[var(--light)]">{entry.label}</span>
              <code className="text-xs text-cyan-300/90 bg-black/20 px-2 py-1 rounded">{entry.path}</code>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={publicHref}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[var(--dark-card)]/40 p-4 hover:border-[var(--primary)]/30 transition-colors group"
        >
          <div>
            <p className="font-medium text-[var(--light)]">Javna stranica</p>
            <p className="text-xs text-[var(--light-muted)] mt-1">{publicHref}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-[var(--light-muted)] group-hover:text-[var(--primary)]" />
        </Link>
        <AdminLink
          href="/admin/tools"
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[var(--dark-card)]/40 p-4 hover:border-[var(--primary)]/30 transition-colors group"
        >
          <div>
            <p className="font-medium text-[var(--light)]">Deploy & hosting</p>
            <p className="text-xs text-[var(--light-muted)] mt-1">Vercel, DNS, GitHub</p>
          </div>
          <ExternalLink className="h-4 w-4 text-[var(--light-muted)] group-hover:text-[var(--primary)]" />
        </AdminLink>
      </div>
    </div>
  )
}
