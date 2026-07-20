'use client'

import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import type { ComponentType } from 'react'
import { useToastStore, type ToastType } from '@/lib/stores/toast-store'

const ICON: Record<ToastType, ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
}

const ICON_COLOR: Record<ToastType, string> = {
  info: 'text-indigo-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-rose-400',
}

const BORDER_COLOR: Record<ToastType, string> = {
  info: 'border-indigo-500/30',
  success: 'border-emerald-500/30',
  warning: 'border-amber-500/30',
  error: 'border-rose-500/30',
}

export default function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      role="region"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end sm:px-0"
    >
      {toasts.map((toast) => {
        const Icon = ICON[toast.type]
        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-slate-950/95 p-4 shadow-2xl backdrop-blur ${BORDER_COLOR[toast.type]}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${ICON_COLOR[toast.type]}`} />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-slate-100">{toast.title}</h4>
              {toast.description ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Zatvori obavijest"
              className="shrink-0 text-slate-500 transition-colors hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
