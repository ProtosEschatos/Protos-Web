type Stat = {
  value: string | number
  label: string
  tone?: 'default' | 'ok' | 'warn'
}

type Props = {
  stats: Stat[]
}

const toneClass: Record<NonNullable<Stat['tone']>, string> = {
  default: 'text-[var(--light)]',
  ok: 'text-emerald-400',
  warn: 'text-amber-400',
}

export default function AdminStatGrid({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-white/10 bg-[var(--dark-card)]/50 px-4 py-3"
        >
          <p className={`text-2xl font-bold ${toneClass[stat.tone ?? 'default']}`}>{stat.value}</p>
          <p className="text-xs text-[var(--light-muted)]">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
