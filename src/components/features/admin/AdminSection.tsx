import type { ReactNode } from 'react'
import AdminLink from '@/components/features/admin/AdminLink'

type Props = {
  title: string
  actionHref?: string
  actionLabel?: string
  className?: string
  children: ReactNode
}

export default function AdminSection({ title, actionHref, actionLabel, className = '', children }: Props) {
  return (
    <section className={`space-y-4 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="admin-mono text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
        {actionHref && actionLabel ? (
          <AdminLink href={actionHref} className="text-xs text-indigo-400 hover:text-indigo-300">
            {actionLabel}
          </AdminLink>
        ) : null}
      </div>
      {children}
    </section>
  )
}
