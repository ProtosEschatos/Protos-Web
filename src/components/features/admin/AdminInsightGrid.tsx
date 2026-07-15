import {
  ArrowUpRight,
  BarChart3,
  Bug,
  Cloud,
  Database,
  FileSearch,
  Gauge,
  Github,
  Globe,
  Lock,
  Mail,
  Map,
  Radar,
  Search,
  Server,
  Shield,
  type LucideIcon,
} from 'lucide-react'

import type { AdminInsight, InsightStatus } from '@/lib/admin-insight-types'
import AdminLink from '@/components/features/admin/AdminLink'

const iconById: Record<string, LucideIcon> = {
  ga4: BarChart3,
  gsc: Search,
  sitemap: Map,
  robots: FileSearch,
  speed: Gauge,
  seo: Radar,
  plausible: BarChart3,
  'admin-auth': Shield,
  cms: Database,
  'email-dns': Mail,
  'dns-all': Globe,
  https: Lock,
  sentry: Bug,
  github: Github,
  cloudflare: Cloud,
  vercel: Server,
}

const statusStyles: Record<InsightStatus, string> = {
  ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warn: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  off: 'border-white/10 bg-white/5 text-[var(--light-muted)]',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
}

type Props = {
  insights: AdminInsight[]
  checkedAt: string
  footnote?: string | false
}

function formatCheckedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat('hr-HR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AdminInsightGrid({ insights, checkedAt, footnote }: Props) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => {
          const Icon = iconById[insight.id] ?? Radar
          const className =
            'admin-card group flex h-full flex-col gap-3 p-4 transition-all hover:border-indigo-500/30'

          const inner = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-indigo-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[insight.status]}`}
                  >
                    {insight.statusLabel}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-indigo-400" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{insight.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{insight.detail}</p>
              </div>
            </>
          )

          if (insight.external) {
            return (
              <a
                key={insight.id}
                href={insight.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            )
          }

          return (
            <AdminLink key={insight.id} href={insight.href} className={className}>
              {inner}
            </AdminLink>
          )
        })}
      </div>
      {footnote !== false ? (
        <p className="admin-mono mt-3 text-[10px] text-slate-500">
          {footnote ??
            `Live provjera: ${formatCheckedAt(checkedAt)} · GA brojke su u Google Analyticsu (nakon pristanka korisnika)`}
        </p>
      ) : null}
    </div>
  )
}
