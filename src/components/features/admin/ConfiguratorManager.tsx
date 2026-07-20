'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Link as LinkIcon, X } from 'lucide-react'
import ConfiguratorControls from '@/components/features/admin/ConfiguratorControls'
import SketchfabBrowser from '@/components/features/admin/SketchfabBrowser'
import { useSceneStore } from '@/lib/stores/scene-store'
import { toast } from '@/lib/stores/toast-store'

const ConfiguratorScene = dynamic(
  () => import('@/components/features/admin/ConfiguratorScene'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-xs text-slate-500 admin-mono">
        Učitavanje 3D scene…
      </div>
    ),
  },
)

export default function ConfiguratorManager() {
  const [urlInput, setUrlInput] = useState('')
  const primitive = useSceneStore((s) => s.primitive)
  const gltfUrl = useSceneStore((s) => s.gltfUrl)
  const loadGltf = useSceneStore((s) => s.loadGltf)
  const setPartial = useSceneStore((s) => s.setPartial)

  function handleLoadUrl(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = urlInput.trim()
    if (!trimmed) return
    if (!/^https?:\/\//i.test(trimmed) || !/\.(glb|gltf)(\?.*)?$/i.test(trimmed)) {
      toast.error('Neispravan URL', 'Očekuje se .glb ili .gltf URL')
      return
    }
    loadGltf(trimmed)
    toast.success('Model učitan', trimmed.split('/').pop() ?? trimmed)
  }

  function handleClearGltf() {
    setPartial({ primitive: 'sphere', gltfUrl: null })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="admin-card relative overflow-hidden">
        <div className="aspect-[4/3] w-full lg:aspect-auto lg:h-[70vh]">
          <ConfiguratorScene />
        </div>
        {gltfUrl && (primitive === 'gltf-url' || primitive === 'sketchfab') ? (
          <div className="pointer-events-auto absolute right-3 top-3 flex items-center gap-1 rounded-md border border-slate-800 bg-slate-950/85 p-1 admin-mono text-[10px] text-slate-400 backdrop-blur">
            <span className="max-w-[220px] truncate px-1">{gltfUrl.split('/').pop()}</span>
            <button
              type="button"
              onClick={handleClearGltf}
              className="rounded p-1 text-slate-500 hover:text-slate-200"
              aria-label="Ukloni GLTF model"
              title="Ukloni GLTF model"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : null}
      </div>

      <aside className="space-y-4">
        <div className="admin-card p-4">
          <ConfiguratorControls />
        </div>

        <form onSubmit={handleLoadUrl} className="admin-card space-y-2 p-4">
          <label className="admin-mono flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <LinkIcon className="h-3 w-3 text-indigo-400" />
            Učitaj .glb / .gltf s URL-a
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/model.glb"
              className="admin-mono flex-1 rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-[11px] text-emerald-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/20"
            >
              Učitaj
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            Bilo koji javno dostupan .glb / .gltf URL (CORS mora dopuštati čitanje).
          </p>
        </form>

        <SketchfabBrowser />
      </aside>
    </div>
  )
}
