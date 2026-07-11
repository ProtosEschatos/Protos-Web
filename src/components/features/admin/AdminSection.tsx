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
    <section className={`mb-8 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)]">{title}</h2>
        {actionHref && actionLabel ? (
          <AdminLink href={actionHref} className="text-xs text-[var(--light-muted)] hover:text-[var(--primary)]">
            {actionLabel}
          </AdminLink>
        ) : null}
      </div>
      {children}
    </section>
  )
}
