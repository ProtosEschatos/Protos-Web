import AdminLink from '@/components/admin/AdminLink'
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
    'group flex flex-col gap-3 rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-5 hover:border-[var(--primary)]/35 hover:bg-[var(--dark-card)]/80 transition-all duration-300'

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
          <Icon className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-[var(--light-muted)] group-hover:text-[var(--primary)] transition-colors" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-[var(--light)]">{label}</h3>
          {pending ? (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400">
              link uskoro
            </span>
          ) : null}
          {badge ? (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--primary)]/30 text-[var(--primary)]">
              {badge}
            </span>
          ) : null}
        </div>
        {description ? <p className="text-sm text-[var(--light-muted)] mt-1">{description}</p> : null}
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
