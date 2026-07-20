'use client'

import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import { Loader2, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  ADMIN_ASSET_CATEGORIES,
  adminCreateAssetUpload,
  adminFinalizeAssetUpload,
  type AdminAssetCategory,
  type AdminAsset,
} from '@/actions/admin-assets'
import { toast } from '@/lib/stores/toast-store'

/** Cheap MIME sniff → category default. User can still override in the form. */
function guessCategory(mime: string, filename: string): AdminAssetCategory {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  const ext = filename.toLowerCase().split('.').pop() ?? ''
  if (ext === 'glb') return 'model_glb'
  if (ext === 'gltf') return 'model_gltf'
  if (['ktx', 'ktx2', 'basis', 'hdr', 'exr'].includes(ext)) return 'texture'
  if (['pdf', 'md', 'txt', 'doc', 'docx'].includes(ext)) return 'document'
  return 'other'
}

/**
 * Read image dimensions in the browser so we can persist width/height on
 * the metadata row (used later by <Image> intrinsic sizing).
 */
function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(null)
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

/**
 * Read video duration + dimensions (best-effort; ignored if user's browser
 * refuses to load the metadata for the format).
 */
function readVideoMetadata(
  file: File,
): Promise<{ width: number; height: number; durationSeconds: number } | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('video/')) return resolve(null)
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        durationSeconds: video.duration,
      })
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    video.src = url
  })
}

type PendingUpload = {
  id: string
  file: File
  category: AdminAssetCategory
  progress: number
  status: 'idle' | 'uploading' | 'finalizing' | 'done' | 'error'
  error?: string
}

export type AssetUploaderProps = {
  onUploaded?: (asset: AdminAsset) => void
  /** Optional tags applied to every finalized upload (e.g. ["hero-slider"]). */
  defaultTags?: string[]
  /** Restrict what categories can be uploaded (default: all). */
  allowedCategories?: readonly AdminAssetCategory[]
}

export default function AssetUploader({
  onUploaded,
  defaultTags = [],
  allowedCategories = ADMIN_ASSET_CATEGORIES,
}: AssetUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = useState<PendingUpload[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [tagsInput, setTagsInput] = useState<string>(defaultTags.join(', '))
  const [publish, setPublish] = useState(false)

  function acceptFiles(files: FileList | File[]) {
    const arr = Array.from(files)
    const additions: PendingUpload[] = arr.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      category: guessCategory(f.type, f.name),
      progress: 0,
      status: 'idle',
    }))
    const filtered = additions.filter((a) => allowedCategories.includes(a.category))
    if (filtered.length < additions.length) {
      toast.error(
        'Neke datoteke odbijene',
        `Kategorije dozvoljene ovdje: ${allowedCategories.join(', ')}`,
      )
    }
    if (filtered.length === 0) return
    setUploads((prev) => [...prev, ...filtered])
    // Kick off uploads sequentially (Supabase Storage handles parallel fine,
    // but sequential keeps the UI progress readable and avoids CDN throttling).
    void runQueue([...filtered])
  }

  async function runQueue(queue: PendingUpload[]) {
    for (const item of queue) {
      await uploadOne(item.id)
    }
  }

  function updateUpload(id: string, patch: Partial<PendingUpload>) {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }

  async function uploadOne(id: string) {
    const item = uploads.find((u) => u.id === id) ?? null
    // The state may have been updated by React between call sites; re-read
    // through a functional update to avoid a stale closure.
    let current: PendingUpload | null = item
    setUploads((prev) => {
      current = prev.find((u) => u.id === id) ?? null
      return prev
    })
    if (!current) return

    updateUpload(id, { status: 'uploading', progress: 5 })

    // Step 1 — mint signed upload URL.
    const created = await adminCreateAssetUpload({
      filename: current.file.name,
      mimeType: current.file.type || 'application/octet-stream',
      sizeBytes: current.file.size,
      category: current.category,
    })
    if (!created.success) {
      updateUpload(id, { status: 'error', error: created.error })
      toast.error('Upload odbijen', created.error)
      return
    }

    // Step 2 — direct PUT to Supabase Storage.
    let putOk = false
    try {
      const res = await fetch(created.data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': current.file.type || 'application/octet-stream' },
        body: current.file,
      })
      putOk = res.ok
      if (!putOk) {
        const text = await res.text().catch(() => '')
        updateUpload(id, { status: 'error', error: `${res.status}: ${text.slice(0, 140)}` })
        toast.error('Storage upload', `HTTP ${res.status}`)
        return
      }
    } catch (err) {
      updateUpload(id, { status: 'error', error: (err as Error).message })
      toast.error('Storage upload', (err as Error).message)
      return
    }

    updateUpload(id, { status: 'finalizing', progress: 85 })

    // Step 3 — enrich with browser-side metadata then finalize row.
    const imgDims = await readImageDimensions(current.file)
    const vidMeta = await readVideoMetadata(current.file)
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const finalized = await adminFinalizeAssetUpload({
      storagePath: created.data.storagePath,
      category: current.category,
      mimeType: current.file.type || 'application/octet-stream',
      sizeBytes: current.file.size,
      originalFilename: current.file.name,
      label: null,
      tags,
      width: imgDims?.width ?? vidMeta?.width ?? null,
      height: imgDims?.height ?? vidMeta?.height ?? null,
      durationSeconds: vidMeta?.durationSeconds ?? null,
      isPublished: publish,
    })
    if (!finalized.success) {
      updateUpload(id, { status: 'error', error: finalized.error })
      toast.error('Baza', finalized.error)
      return
    }

    updateUpload(id, { status: 'done', progress: 100 })
    toast.success('Uploadano', current.file.name)
    onUploaded?.(finalized.data)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) acceptFiles(e.dataTransfer.files)
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) acceptFiles(e.target.files)
    e.target.value = ''
  }

  return (
    <div className="admin-card space-y-3 p-4">
      <div>
        <h3 className="admin-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Asset upload
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Slike, videa, 3D modeli (.glb/.gltf), teksture i audio idu direktno u Supabase
          Storage (privatni bucket <code className="admin-mono">admin-uploads</code>).
          Metadata je indeksirana za korištenje na javnim stranicama i u 3D sceni.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex-1 text-[11px] text-slate-400">
          Tagovi (comma separated)
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="npr. hero-slider, portfolio, background"
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-[11px] text-slate-400 sm:mt-4">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-indigo-500"
          />
          Odmah objavi (dostupno javno)
        </label>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
        }`}
      >
        <Upload className="h-6 w-6 text-slate-500" />
        <p className="mt-2 text-xs text-slate-300">
          Povuci datoteke ovdje ili klikni za odabir
        </p>
        <p className="admin-mono mt-1 text-[10px] text-slate-500">
          images ≤15MB · videos ≤150MB · glb/gltf ≤50MB · audio ≤30MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={onInputChange}
          className="hidden"
        />
      </div>

      {uploads.length > 0 ? (
        <ul className="space-y-1.5">
          {uploads.map((u) => (
            <li
              key={u.id}
              className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-950/60 px-2 py-1.5 text-[11px]"
            >
              {u.status === 'done' ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              ) : u.status === 'error' ? (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
              ) : u.status === 'uploading' || u.status === 'finalizing' ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-indigo-400" />
              ) : (
                <Upload className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              )}
              <span className="admin-mono flex-1 truncate text-slate-300" title={u.file.name}>
                {u.file.name}
              </span>
              <span className="admin-mono text-slate-500">{u.category}</span>
              {u.status === 'error' ? (
                <span className="admin-mono truncate text-rose-400" title={u.error}>
                  {u.error?.slice(0, 40)}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setUploads((prev) => prev.filter((x) => x.id !== u.id))}
                className="p-0.5 text-slate-500 hover:text-slate-200"
                title="Ukloni iz liste"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
