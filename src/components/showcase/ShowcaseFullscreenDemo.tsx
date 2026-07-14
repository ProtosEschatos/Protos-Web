'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  url: string
  title: string
  closeLabel: string
  onClose: () => void
}

export function ShowcaseFullscreenDemo({ open, url, title, closeLabel, onClose }: Props) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[500] flex flex-col bg-[#050510]" role="dialog" aria-modal="true" aria-label={title}>
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white sm:text-base">{title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#6366f1] hover:bg-[#6366f1]"
          aria-label={closeLabel}
        >
          <X className="h-4 w-4" />
          {closeLabel}
        </button>
      </header>
      <iframe
        src={url}
        title={title}
        className="min-h-0 flex-1 w-full border-0 bg-[#0a0a1a]"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
