'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import {
  FileText,
  Film,
  Image as ImageIcon,
  Loader2,
  Music,
  Package,
  RefreshCw,
  Sparkles,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  adminDeleteAsset,
  adminGetAssetSignedUrl,
  adminListAssets,
  adminUpdateAsset,
} from '@/actions/admin-assets'
import {
  ADMIN_ASSET_CATEGORIES,
  type AdminAsset,
  type AdminAssetCategory,
} from '@/lib/admin-assets-types'
import { toast } from '@/lib/stores/toast-store'
import { useSceneStore } from '@/lib/stores/scene-store'

const CATEGORY_ICONS: Record<AdminAssetCategory, typeof ImageIcon> = {
  image: ImageIcon,
  texture: Sparkles,
  video: Film,
  audio: Music,
  model_glb: Package,
  model_gltf: Package,
  document: FileText,
  other: FileText,
}

function formatBytes(bytes: number | null): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export type AssetLibraryProps = {
  /**
   * Optional external "refresh me" counter. When it changes, the library
   * re-fetches. The parent bumps this after every successful upload so
   * uploader → library stays in sync without a full page reload.
   */
  refreshKey?: number
  /**
   * Emitted when the user clicks the "use in scene" button on a GLB/GLTF
   * asset — the ConfiguratorManager wires this to scene-store.loadGltf().
   */
  onSelectForScene?: (asset: AdminAsset, signedUrl: string) => void
}

export default function AssetLibrary({ refreshKey = 0, onSelectForScene }: AssetLibraryProps) {
  const [assets, setAssets] = useState<AdminAsset[]>([])
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState<AdminAssetCategory | 'all'>('all')
  const [tagFilter, setTagFilter] = useState('')
  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const loadGltf = useSceneStore((s) => s.loadGltf)

  const refresh = useCallback(() => {
    startTransition(async () => {
      const result = await adminListAssets({
        category: category === 'all' ? undefined : category,
        tag: tagFilter.trim() || undefined,
        limit: 60,
        offset: 0,
      })
      if (!result.success) {
        toast.error('Popis assets', result.error)
        return
      }
      setAssets(result.data.assets)
      setTotal(result.data.total)

      // Prefetch signed URLs for image/video thumbs so the grid isn't empty
      // while each cell mints its own URL. Fires in parallel, batched by
      // Supabase's own rate limits.
      const thumbCandidates = result.data.assets.filter(
        (a) => a.category === 'image' || a.category === 'video',
      )
      const entries = await Promise.all(
        thumbCandidates.map(async (a) => {
          const r = await adminGetAssetSignedUrl(a.id, 3600)
          return r.success ? ([a.id, r.data.url] as const) : null
        }),
      )
      const map: Record<string, string> = {}
      for (const e of entries) if (e) map[e[0]] = e[1]
      setThumbUrls(map)
    })
  }, [category, tagFilter])

  useEffect(() => {
    refresh()
  }, [refresh, refreshKey])

  async function handleUseInScene(asset: AdminAsset) {
    setBusyId(asset.id)
    const res = await adminGetAssetSignedUrl(asset.id, 3600)
    setBusyId(null)
    if (!res.success) {
      toast.error('Signed URL', res.error)
      return
    }
    if (asset.category === 'model_glb' || asset.category === 'model_gltf') {
      loadGltf(res.data.url)
      onSelectForScene?.(asset, res.data.url)
      toast.success('Model učitan', asset.originalFilename ?? asset.storagePath)
    } else {
      await navigator.clipboard.writeText(res.data.url).catch(() => undefined)
      toast.info('URL kopiran', 'Zalijepi u chat asistenta, komponentu ili scenu.')
    }
  }

  async function handleDelete(asset: AdminAsset) {
    if (!window.confirm(`Obriši ${asset.originalFilename ?? asset.storagePath}?`)) return
    setBusyId(asset.id)
    const res = await adminDeleteAsset(asset.id)
    setBusyId(null)
    if (!res.success) {
      toast.error('Brisanje', res.error)
      return
    }
    toast.success('Obrisano', asset.originalFilename ?? asset.storagePath)
    setAssets((prev) => prev.filter((a) => a.id !== asset.id))
    setTotal((n) => n - 1)
  }

  async function handleTogglePublish(asset: AdminAsset) {
    setBusyId(asset.id)
    const res = await adminUpdateAsset({ id: asset.id, isPublished: !asset.isPublished })
    setBusyId(null)
    if (!res.success) {
      toast.error('Objava', res.error)
      return
    }
    setAssets((prev) => prev.map((a) => (a.id === asset.id ? res.data : a)))
  }

  return (
    <div className="admin-card space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="admin-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Biblioteka assets
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            {total} zapis(a) u Supabase Storage / bucket <code className="admin-mono">admin-uploads</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-300 hover:border-slate-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Osvježi
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as AdminAssetCategory | 'all')}
          className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-200"
        >
          <option value="all">Sve kategorije</option>
          {ADMIN_ASSET_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="filter po tagu (jedan)"
          className="min-w-0 flex-1 rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-200 placeholder:text-slate-600"
        />
      </div>

      {assets.length === 0 && !pending ? (
        <p className="text-[11px] text-slate-500">Nema uploadanih assets za te filtre.</p>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {assets.map((asset) => {
          const Icon = CATEGORY_ICONS[asset.category] ?? FileText
          const thumb = thumbUrls[asset.id]
          const isBusy = busyId === asset.id
          const isModel = asset.category === 'model_glb' || asset.category === 'model_gltf'
          return (
            <article
              key={asset.id}
              className="group relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60"
            >
              <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-slate-900">
                {asset.category === 'image' && thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external signed URL; no need for Image optimization
                  <img
                    src={thumb}
                    alt={asset.label ?? asset.originalFilename ?? ''}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : asset.category === 'video' && thumb ? (
                  <video src={thumb} className="h-full w-full object-cover" muted playsInline />
                ) : (
                  <Icon className="h-8 w-8 text-slate-600" />
                )}
                {asset.isPublished ? (
                  <span
                    className="absolute right-1 top-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300"
                    title="Vidljivo na javnoj stranici"
                  >
                    LIVE
                  </span>
                ) : null}
              </div>
              <div className="space-y-1 p-2">
                <h4
                  className="truncate text-[11px] font-medium text-slate-100"
                  title={asset.originalFilename ?? asset.storagePath}
                >
                  {asset.originalFilename ?? asset.storagePath.split('/').pop()}
                </h4>
                <p className="admin-mono truncate text-[9px] text-slate-500">
                  {asset.category} · {formatBytes(asset.sizeBytes)}
                  {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ''}
                </p>
                {asset.tags.length > 0 ? (
                  <p className="admin-mono truncate text-[9px] text-indigo-300/80" title={asset.tags.join(', ')}>
                    #{asset.tags.join(' #')}
                  </p>
                ) : null}
                <div className="flex items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => handleUseInScene(asset)}
                    disabled={isBusy}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40"
                    title={isModel ? 'Učitaj u scenu' : 'Kopiraj signed URL'}
                  >
                    {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    {isModel ? 'U scenu' : 'Kopiraj URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(asset)}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:border-slate-600 hover:text-slate-200 disabled:opacity-40"
                    title={asset.isPublished ? 'Ukloni s javnog dijela' : 'Objavi javno'}
                  >
                    {asset.isPublished ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(asset)}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center rounded border border-rose-500/30 bg-rose-500/10 p-1 text-rose-300 hover:bg-rose-500/20 disabled:opacity-40"
                    title="Obriši trajno"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
