'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import AdminLink from '@/components/features/admin/AdminLink'

/**
 * Route-segment error boundary for every admin page. Prevents the blank
 * screen when a Server Component / RSC render or a client tree above the
 * page throws — user always sees a real UI with a "Pokušaj ponovo" button.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (typeof console !== 'undefined') {
      console.error('[admin/error]', error)
    }
  }, [error])

  return (
    <div className="mx-auto max-w-2xl space-y-4 py-10">
      <div className="admin-card space-y-3 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="text-base font-semibold text-slate-100">
              Admin ruta je pala s greškom
            </h1>
            <p className="admin-mono text-[11px] text-slate-400 break-words">
              {error.message || 'Nepoznata greška.'}
              {error.digest ? (
                <span className="ml-1 text-slate-500">· digest {error.digest}</span>
              ) : null}
            </p>
            <p className="text-[11px] text-slate-500">
              Ostatak panela je i dalje dostupan. Osvježi rutu ili se vrati na
              početnu.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-800 pt-3">
          <AdminLink
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-600 hover:text-slate-100"
          >
            <Home className="h-3.5 w-3.5" />
            Admin početna
          </AdminLink>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Pokušaj ponovo
          </button>
        </div>
      </div>
    </div>
  )
}
