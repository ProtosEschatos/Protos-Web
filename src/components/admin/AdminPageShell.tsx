import AdminLink from '@/components/admin/AdminLink'
import { ChevronLeft } from 'lucide-react'

type Props = {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
}

export default function AdminPageShell({
  title,
  description,
  backHref = '/admin',
  backLabel = 'Kontrolna ploča',
  children,
}: Props) {
  return (
    <div className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-6">
        <AdminLink
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--light-muted)] hover:text-[var(--primary)] mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </AdminLink>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--light)]">{title}</h1>
          {description ? <p className="text-[var(--light-muted)] mt-2">{description}</p> : null}
        </div>
        {children}
      </div>
    </div>
  )
}
