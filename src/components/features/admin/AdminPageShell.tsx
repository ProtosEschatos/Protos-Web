import AdminLink from '@/components/features/admin/AdminLink'
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminLink
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-indigo-400"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </AdminLink>
        {actions}
      </div>

      <header>
        <h1 className="text-lg font-bold tracking-tight text-slate-100">{title}</h1>
        {description ? (
          <p className="admin-mono mt-1 max-w-2xl text-xs text-slate-400">{description}</p>
        ) : null}
      </header>

      {children}
    </div>
  )
}
