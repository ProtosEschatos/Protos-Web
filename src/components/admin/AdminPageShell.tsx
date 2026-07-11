import AdminLink from '@/components/admin/AdminLink'
import { ChevronLeft } from 'lucide-react'

type Props = {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  actions?: React.ReactNode
}

export default function AdminPageShell({
  title,
  description,
  backHref = '/admin',
  backLabel = 'Početna',
  children,
  actions,
}: Props) {
  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <AdminLink
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--light-muted)] transition-colors hover:text-[var(--primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </AdminLink>
          {actions}
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--light)] md:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm text-[var(--light-muted)]">{description}</p> : null}
        </header>

        {children}
      </div>
    </div>
  )
}
