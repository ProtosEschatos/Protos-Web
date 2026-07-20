'use client'

import { useState, useTransition } from 'react'
import { Download, ExternalLink, Loader2, Search } from 'lucide-react'
import AdminLink from '@/components/features/admin/AdminLink'
import {
  adminGetSketchfabDownload,
  adminSearchSketchfab,
} from '@/actions/admin-configurator'
import { toast } from '@/lib/stores/toast-store'
import { useSceneStore } from '@/lib/stores/scene-store'

type SearchState = {
  results: Array<{
    uid: string
    name: string
    viewerUrl: string
    thumbnailUrl: string | null
    author: string | null
    isDownloadable: boolean
    license: string | null
  }>
  configured: boolean
  loaded: boolean
}

export default function SketchfabBrowser() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<SearchState>({ results: [], configured: true, loaded: false })
  const [downloading, setDownloading] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const loadGltf = useSceneStore((s) => s.loadGltf)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length < 2) return
    startTransition(async () => {
      const result = await adminSearchSketchfab(query.trim(), { downloadableOnly: true })
      if (!result.success) {
        toast.error('Sketchfab', result.error)
        setState({ results: [], configured: false, loaded: true })
        return
      }
      setState({
        results: result.data.models,
        configured: result.data.configured,
        loaded: true,
      })
      if (result.data.models.length === 0) {
        toast.info('Sketchfab', 'Nema rezultata za taj upit.')
      }
    })
  }

  async function handleLoad(uid: string, name: string) {
    setDownloading(uid)
    const result = await adminGetSketchfabDownload(uid)
    setDownloading(null)
    if (!result.success) {
      toast.error('Ne mogu preuzeti model', result.error)
      return
    }
    loadGltf(result.data.url)
    toast.success('Model učitan', name)
  }

  return (
    <div className="admin-card space-y-4 p-4">
      <div>
        <h3 className="admin-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Sketchfab pretraga
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Traži downloadable 3D modele i učitaj ih izravno u scenu.
          Zahtijeva Sketchfab token u{' '}
          <AdminLink href="/admin/kljucevi" className="text-indigo-400 hover:underline">
            API ključevima
          </AdminLink>
          .
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="npr. helmet, cyberpunk chair, low-poly tree"
            minLength={2}
            maxLength={80}
            className="w-full rounded-md border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          Traži
        </button>
      </form>

      {!state.configured && state.loaded ? (
        <p className="text-[11px] text-amber-300">
          Sketchfab token nije postavljen. Dodaj ga u{' '}
          <AdminLink href="/admin/kljucevi" className="underline">
            API ključevima
          </AdminLink>{' '}
          pod providerom <code className="admin-mono">sketchfab</code>.
        </p>
      ) : null}

      {state.loaded && state.configured && state.results.length === 0 && !pending ? (
        <p className="text-[11px] text-slate-500">Nema rezultata.</p>
      ) : null}

      {state.results.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {state.results.map((model) => {
            const isDownloading = downloading === model.uid
            return (
              <article
                key={model.uid}
                className="group relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60"
              >
                {model.thumbnailUrl ? (
                  <img
                    src={model.thumbnailUrl}
                    alt={model.name}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-slate-900" />
                )}
                <div className="space-y-1 p-2">
                  <h4 className="truncate text-xs font-medium text-slate-100" title={model.name}>
                    {model.name}
                  </h4>
                  <p className="admin-mono truncate text-[10px] text-slate-500">
                    {model.author ?? 'unknown'} · {model.license ?? '—'}
                  </p>
                  <div className="flex items-center gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => handleLoad(model.uid, model.name)}
                      disabled={isDownloading || !model.isDownloadable}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3" />
                      )}
                      Učitaj
                    </button>
                    <a
                      href={model.viewerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      title="Sketchfab viewer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
