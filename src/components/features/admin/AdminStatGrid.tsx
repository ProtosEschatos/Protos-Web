type Stat = {
  value: string | number
  label: string
  tone?: 'default' | 'ok' | 'warn'
}

type Props = {
  stats: Stat[]
}

const toneClass: Record<NonNullable<Stat['tone']>, string> = {
  default: 'text-slate-100',
  ok: 'text-emerald-400',
  warn: 'text-amber-400',
}

export default function AdminStatGrid({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="admin-card px-4 py-3">
          <p className={`text-2xl font-bold admin-mono ${toneClass[stat.tone ?? 'default']}`}>{stat.value}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
