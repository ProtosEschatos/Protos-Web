import AdminLink from '@/components/features/admin/AdminLink'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'

type Props = {
  href: string
  label: string
  description?: string
  icon: LucideIcon
  external?: boolean
  pending?: boolean
  badge?: string
}

export default function AdminHubCard({
  href,
  label,
  description,
  icon: Icon,
  external,
  pending,
  badge,
}: Props) {
  const className =
    'admin-card group flex flex-col gap-3 p-5 transition-all hover:border-indigo-500/30 hover:bg-slate-900/80'

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-indigo-400">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-slate-200">{label}</h3>
          {pending ? (
            <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-400">
              nema ključa
            </span>
          ) : null}
          {badge ? (
            <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-indigo-400 admin-mono">
              {badge}
            </span>
          ) : null}
        </div>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }

  return (
    <AdminLink href={href} className={className}>
      {inner}
    </AdminLink>
  )
}
