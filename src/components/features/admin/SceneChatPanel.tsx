'use client'

import { useRef, useState } from 'react'
import { Loader2, Send, Sparkles, User } from 'lucide-react'
import { useSceneStore, type SceneEnvironment } from '@/lib/stores/scene-store'
import { toast } from '@/lib/stores/toast-store'

type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; commands: number; provider?: string }
  | { role: 'system'; text: string }

type ResolvedCommand =
  | { type: 'set_primitive'; primitive: 'box' | 'sphere' | 'torus' }
  | { type: 'set_color'; color: string }
  | {
      type: 'set_material'
      metalness?: number
      roughness?: number
      emissive?: string
      emissiveIntensity?: number
      wireframe?: boolean
    }
  | { type: 'set_environment'; environment?: string; environmentIntensity?: number }
  | { type: 'set_lighting'; ambient?: number; directional?: number }
  | { type: 'set_background'; color: string }
  | { type: 'set_auto_rotate'; enabled: boolean }
  | {
      type: 'import_model_resolved'
      source: 'sketchfab' | 'poly-pizza' | 'url'
      url: string
      name: string
    }
  | { type: 'reset_scene' }

const SUGGESTIONS = [
  'kocka, crvena, emissive on',
  'torus, gold, sunset HDRI',
  'import pizza s Poly.Pizza',
  'chair from sketchfab',
  'wireframe mode',
  'reset scene',
]

export default function SceneChatPanel() {
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const scene = useSceneStore()

  function applyCommand(cmd: ResolvedCommand) {
    switch (cmd.type) {
      case 'set_primitive':
        scene.setPartial({ primitive: cmd.primitive, gltfUrl: null })
        return
      case 'set_color':
        scene.setPartial({ color: cmd.color })
        return
      case 'set_material':
        scene.setPartial({
          ...(cmd.metalness !== undefined ? { metalness: cmd.metalness } : {}),
          ...(cmd.roughness !== undefined ? { roughness: cmd.roughness } : {}),
          ...(cmd.emissive !== undefined ? { emissive: cmd.emissive } : {}),
          ...(cmd.emissiveIntensity !== undefined ? { emissiveIntensity: cmd.emissiveIntensity } : {}),
          ...(cmd.wireframe !== undefined ? { wireframe: cmd.wireframe } : {}),
        })
        return
      case 'set_environment':
        scene.setPartial({
          ...(cmd.environment ? { environment: cmd.environment as SceneEnvironment } : {}),
          ...(cmd.environmentIntensity !== undefined ? { environmentIntensity: cmd.environmentIntensity } : {}),
        })
        return
      case 'set_lighting':
        scene.setPartial({
          ...(cmd.ambient !== undefined ? { ambientIntensity: cmd.ambient } : {}),
          ...(cmd.directional !== undefined ? { directionalIntensity: cmd.directional } : {}),
        })
        return
      case 'set_background':
        scene.setPartial({ background: cmd.color })
        return
      case 'set_auto_rotate':
        scene.setPartial({ autoRotate: cmd.enabled })
        return
      case 'import_model_resolved':
        scene.setPartial({
          primitive: cmd.source === 'poly-pizza' ? 'poly-pizza' : cmd.source === 'sketchfab' ? 'sketchfab' : 'gltf-url',
        })
        scene.loadGltf(cmd.url)
        return
      case 'reset_scene':
        scene.reset()
        return
    }
  }

  async function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setBusy(true)
    setMessages((m) => [...m, { role: 'user', text: trimmed }])
    setPrompt('')

    try {
      const res = await fetch('/api/admin/ai/scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          currentState: {
            primitive: scene.primitive,
            color: scene.color,
            environment: scene.environment,
            gltfLoaded: Boolean(scene.gltfUrl),
          },
        }),
      })

      const data = (await res.json()) as {
        commands?: ResolvedCommand[]
        narration?: string | null
        provider?: string
        error?: string
        importErrors?: string[]
      }

      if (!res.ok) {
        toast.error('AI', data.error ?? `HTTP ${res.status}`)
        setMessages((m) => [
          ...m,
          { role: 'system', text: data.error ?? `Greška ${res.status}` },
        ])
        return
      }

      const commands = data.commands ?? []
      for (const cmd of commands) applyCommand(cmd)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: data.narration ?? `Primijenjeno ${commands.length} komandi.`,
          commands: commands.length,
          provider: data.provider,
        },
      ])
      if (data.importErrors?.length) {
        toast.warning('Import problem', data.importErrors.join('; '))
      }
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
      })
    } catch (err) {
      toast.error('AI', (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="admin-card p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          Scene AI asistent
        </h3>
        <span className="admin-mono text-[10px] text-slate-500">
          DeepSeek / Gemini
        </span>
      </header>

      {messages.length === 0 ? (
        <div className="mb-3 space-y-2 rounded-md border border-slate-800 bg-slate-950/40 p-3">
          <p className="text-[11px] text-slate-500">
            Piši prirodnim jezikom što želiš. Nekoliko primjera:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                disabled={busy}
                className="admin-mono rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-400 hover:border-indigo-500/40 hover:text-indigo-300 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="mb-3 max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-800 bg-slate-950/40 p-3"
        >
          {messages.map((msg, idx) => {
            if (msg.role === 'user') {
              return (
                <div key={idx} className="flex items-start gap-2">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <p className="text-xs text-slate-200">{msg.text}</p>
                </div>
              )
            }
            if (msg.role === 'assistant') {
              return (
                <div key={idx} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-300">{msg.text}</p>
                    <p className="admin-mono mt-0.5 text-[10px] text-slate-600">
                      {msg.commands} komanda · {msg.provider}
                    </p>
                  </div>
                </div>
              )
            }
            return (
              <p key={idx} className="admin-mono text-[10px] text-rose-400">
                {msg.text}
              </p>
            )
          })}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(prompt)
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='npr. "napravi crvenu kocku, sunset HDRI"'
          maxLength={500}
          disabled={busy}
          className="flex-1 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || prompt.trim().length < 2}
          className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Pošalji
        </button>
      </form>
    </section>
  )
}
