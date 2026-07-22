'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * Client-side error boundary for panels that live inside a Server Component
 * shell (e.g. AdminPageShell). Next.js `error.tsx` only catches errors that
 * bubble up to a route segment; anything that throws synchronously during a
 * client component's render tree needs a boundary like this one to avoid
 * unmounting the whole tree into a blank screen.
 *
 * Used to keep `/admin/konfigurator` and `/admin/assets` interactive even
 * when R3F, HDRI, WebGL, or a Supabase-backed panel throws.
 */
type Props = {
  children: ReactNode
  /** Short label shown in the fallback ("3D scena", "Biblioteka assets", …). */
  label?: string
  /**
   * Optional fully custom fallback. When omitted, a minimal admin-styled
   * error card is rendered with a reset button.
   */
  fallback?: (args: { error: Error; reset: () => void }) => ReactNode
  /** Optional callback for logging into an external system. */
  onError?: (error: Error, info: ErrorInfo) => void
}

type State = { error: Error | null }

export default class ClientErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof console !== 'undefined') {
      console.error('[ClientErrorBoundary]', this.props.label ?? '', error, info)
    }
    this.props.onError?.(error, info)
  }

  private reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) {
      return this.props.fallback({ error, reset: this.reset })
    }

    const label = this.props.label ?? 'Ovaj panel'

    return (
      <div
        className="admin-card space-y-3 p-4"
        data-testid={`client-error-boundary-${label}`}
        data-error-message={error.message || 'unknown'}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-slate-100">
              {label} je pao s greškom
            </h3>
            <p className="admin-mono text-[11px] text-slate-400 break-words">
              {error.message || 'Nepoznata greška u client tree-u.'}
            </p>
            <p className="text-[11px] text-slate-500">
              Ostatak admin panela i dalje radi. Osvježi ovaj panel da pokušaš ponovo.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={this.reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 hover:border-slate-500"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Pokušaj ponovo
          </button>
        </div>
      </div>
    )
  }
}
