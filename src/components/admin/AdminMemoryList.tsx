import AdminLink from '@/components/admin/AdminLink'
import type { MemoryDocRef } from '@/lib/admin-memory-types'
import { Calendar, Tag } from 'lucide-react'

function memoryHref(path: string): string {
  const relative = path.replace(/^memory\//, '').replace(/\.md$/, '')
  return `/admin/memory/${relative}`
}

type Props = {
  title: string
  items: MemoryDocRef[]
  emptyLabel?: string
}

export default function AdminMemoryList({ title, items, emptyLabel = 'Nema zapisa.' }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-semibold text-[var(--light)]">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-[var(--light-muted)]">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {items.map((item) => (
            <li key={item.path}>
              <AdminLink
                href={memoryHref(item.path)}
                className="flex flex-col gap-2 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
              >
                <span className="text-sm font-medium text-[var(--light)] group-hover:text-[var(--primary)] transition-colors">
                  {item.title}
                </span>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--light-muted)]">
                  {item.date ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  ) : null}
                  {item.topics?.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {topic}
                    </span>
                  ))}
                </div>
              </AdminLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function memoryDocHref(path: string): string {
  return memoryHref(path)
}
