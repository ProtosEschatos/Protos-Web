'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Box, FolderOpen, Link as LinkIcon, type LucideIcon, Package, Pizza, X } from 'lucide-react'
import AssetLibrary from '@/components/features/admin/AssetLibrary'
import AssetUploader from '@/components/features/admin/AssetUploader'
import ConfiguratorControls from '@/components/features/admin/ConfiguratorControls'
import SketchfabBrowser from '@/components/features/admin/SketchfabBrowser'
import PolyPizzaBrowser from '@/components/features/admin/PolyPizzaBrowser'
import SceneChatPanel from '@/components/features/admin/SceneChatPanel'
import ClientErrorBoundary from '@/components/ui/ClientErrorBoundary'
import { useSceneStore } from '@/lib/stores/scene-store'
import { toast } from '@/lib/stores/toast-store'

type ImportTab = 'assets' | 'poly-pizza' | 'sketchfab' | 'url'

const ConfiguratorScene = dynamic(
  () => import('@/components/features/admin/ConfiguratorScene'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 admin-mono">
        Učitavanje 3D scene…
      </div>
    ),
  },
)

const TABS: { id: ImportTab; label: string; Icon: LucideIcon }[] = [
  { id: 'assets', label: 'Moji assets', Icon: FolderOpen },
  { id: 'poly-pizza', label: 'Poly.Pizza', Icon: Pizza },
  { id: 'sketchfab', label: 'Sketchfab', Icon: Package },
  { id: 'url', label: 'URL', Icon: LinkIcon },
]

export default function ConfiguratorManager() {
  return (
    <ClientErrorBoundary label="3D Konfigurator">
      <ConfiguratorManagerInner />
    </ClientErrorBoundary>
  )
}

function ConfiguratorManagerInner() {
  const [activeTab, setActiveTab] = useState<ImportTab>('assets')
  const [urlInput, setUrlInput] = useState('')
  const [assetRefreshKey, setAssetRefreshKey] = useState(0)
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

  const isModelLoaded =
    Boolean(gltfUrl) && (primitive === 'gltf-url' || primitive === 'sketchfab' || primitive === 'poly-pizza')

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      {/* Left: canvas + chat */}
      <div className="space-y-4">
        <div className="admin-card relative overflow-hidden">
          <div className="aspect-[4/3] min-h-[380px] w-full lg:aspect-auto lg:h-[62vh]">
            <ClientErrorBoundary
              label="3D scena"
              fallback={({ error, reset }) => (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <p className="admin-mono text-[11px] text-amber-300">
                    3D scena nije mogla biti prikazana.
                  </p>
                  <p className="admin-mono max-w-md text-[10px] text-slate-500 break-words">
                    {error.message || 'WebGL/R3F greška'}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 hover:border-slate-500"
                  >
                    Pokušaj ponovo mount-ati scenu
                  </button>
                </div>
              )}
            >
              <ConfiguratorScene />
            </ClientErrorBoundary>
          </div>
          {isModelLoaded ? (
            <div className="pointer-events-auto absolute right-3 top-3 flex items-center gap-1 rounded-md border border-slate-800 bg-slate-950/85 p-1 admin-mono text-[10px] text-slate-400 backdrop-blur">
              <span className="max-w-[220px] truncate px-1">{gltfUrl!.split('/').pop()}</span>
              <button
                type="button"
                onClick={handleClearGltf}
                className="rounded p-1 text-slate-500 hover:text-slate-200"
                aria-label="Ukloni model"
                title="Ukloni model"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/85 px-2 py-1 admin-mono text-[10px] text-slate-500 backdrop-blur">
            <Box className="h-3 w-3 text-indigo-400" />
            {isModelLoaded ? 'GLTF/GLB' : `Primitive: ${primitive}`}
          </div>
        </div>

        <ClientErrorBoundary label="Scene AI chat">
          <SceneChatPanel />
        </ClientErrorBoundary>
      </div>

      {/* Right: controls + import */}
      <aside className="space-y-4">
        <div className="admin-card p-4">
          <ClientErrorBoundary label="Kontrole scene">
            <ConfiguratorControls />
          </ClientErrorBoundary>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="flex border-b border-slate-800">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs transition-colors ${
                  activeTab === id
                    ? 'border-b-2 border-indigo-500 bg-slate-950 text-indigo-300'
                    : 'border-b-2 border-transparent text-slate-500 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === 'assets' ? (
              <ClientErrorBoundary label="Assets tab">
                <div className="space-y-3">
                  <AssetUploader
                    onUploaded={() => setAssetRefreshKey((n) => n + 1)}
                    allowedCategories={['image', 'video', 'model_glb', 'model_gltf', 'texture', 'audio']}
                  />
                  <AssetLibrary refreshKey={assetRefreshKey} />
                </div>
              </ClientErrorBoundary>
            ) : null}
            {activeTab === 'poly-pizza' ? (
              <ClientErrorBoundary label="Poly.Pizza pretraga">
                <PolyPizzaBrowser />
              </ClientErrorBoundary>
            ) : null}
            {activeTab === 'sketchfab' ? (
              <ClientErrorBoundary label="Sketchfab pretraga">
                <SketchfabBrowser />
              </ClientErrorBoundary>
            ) : null}
            {activeTab === 'url' ? (
              <form onSubmit={handleLoadUrl} className="space-y-2">
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
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  )
}
