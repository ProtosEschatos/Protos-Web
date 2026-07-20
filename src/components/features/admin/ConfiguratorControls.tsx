'use client'

import { Box, Circle, RotateCcw, Sparkles, Torus } from 'lucide-react'
import { useSceneStore, type ScenePrimitive, type SceneEnvironment } from '@/lib/stores/scene-store'

const PRIMITIVES: { id: Exclude<ScenePrimitive, 'sketchfab' | 'gltf-url'>; label: string; Icon: typeof Box }[] = [
  { id: 'sphere', label: 'Sfera', Icon: Circle },
  { id: 'box', label: 'Kocka', Icon: Box },
  { id: 'torus', label: 'Torus', Icon: Torus },
]

const ENVIRONMENTS: SceneEnvironment[] = [
  'studio',
  'sunset',
  'dawn',
  'night',
  'warehouse',
  'forest',
  'apartment',
  'city',
  'park',
  'lobby',
]

export default function ConfiguratorControls() {
  const scene = useSceneStore()

  return (
    <div className="space-y-6">
      <Group title="Mesh">
        <div className="grid grid-cols-3 gap-2">
          {PRIMITIVES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => scene.setPartial({ primitive: id, gltfUrl: null })}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition-colors ${
                scene.primitive === id
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <label className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={scene.wireframe}
            onChange={(e) => scene.setPartial({ wireframe: e.target.checked })}
            className="h-4 w-4 rounded border-slate-700 bg-slate-950"
          />
          Wireframe prikaz
        </label>
      </Group>

      <Group title="Materijal">
        <Row label="Boja">
          <input
            type="color"
            value={scene.color}
            onChange={(e) => scene.setPartial({ color: e.target.value })}
            className="h-8 w-16 cursor-pointer rounded border border-slate-800 bg-transparent"
          />
        </Row>
        <Slider
          label="Metallic"
          value={scene.metalness}
          onChange={(v) => scene.setPartial({ metalness: v })}
          min={0}
          max={1}
          step={0.01}
        />
        <Slider
          label="Roughness"
          value={scene.roughness}
          onChange={(v) => scene.setPartial({ roughness: v })}
          min={0}
          max={1}
          step={0.01}
        />
        <Row label="Emissive">
          <input
            type="color"
            value={scene.emissive}
            onChange={(e) => scene.setPartial({ emissive: e.target.value })}
            className="h-8 w-16 cursor-pointer rounded border border-slate-800 bg-transparent"
          />
        </Row>
        <Slider
          label="Emissive intenzitet"
          value={scene.emissiveIntensity}
          onChange={(v) => scene.setPartial({ emissiveIntensity: v })}
          min={0}
          max={4}
          step={0.05}
        />
      </Group>

      <Group title="Svjetlo & okoliš">
        <Row label="HDRI">
          <select
            value={scene.environment}
            onChange={(e) => scene.setPartial({ environment: e.target.value as SceneEnvironment })}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>
        </Row>
        <Slider
          label="HDRI intenzitet"
          value={scene.environmentIntensity}
          onChange={(v) => scene.setPartial({ environmentIntensity: v })}
          min={0}
          max={3}
          step={0.05}
        />
        <Slider
          label="Ambient"
          value={scene.ambientIntensity}
          onChange={(v) => scene.setPartial({ ambientIntensity: v })}
          min={0}
          max={2}
          step={0.05}
        />
        <Slider
          label="Direktno svjetlo"
          value={scene.directionalIntensity}
          onChange={(v) => scene.setPartial({ directionalIntensity: v })}
          min={0}
          max={3}
          step={0.05}
        />
        <Row label="Pozadina">
          <input
            type="color"
            value={scene.background}
            onChange={(e) => scene.setPartial({ background: e.target.value })}
            className="h-8 w-16 cursor-pointer rounded border border-slate-800 bg-transparent"
          />
        </Row>
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={scene.autoRotate}
            onChange={(e) => scene.setPartial({ autoRotate: e.target.checked })}
            className="h-4 w-4 rounded border-slate-700 bg-slate-950"
          />
          Auto-rotate
        </label>
      </Group>

      <button
        type="button"
        onClick={() => scene.reset()}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset scene
      </button>
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="admin-mono flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <Sparkles className="h-3 w-3 text-indigo-400" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-slate-400">{label}</span>
      {children}
    </div>
  )
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="admin-mono text-[10px] text-slate-500">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </div>
  )
}
