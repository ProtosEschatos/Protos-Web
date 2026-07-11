'use client'

import { useState } from 'react'
import ProtosLoader from '@/components/ui/ProtosLoader'

type Provider = 'deepseek' | 'gemini'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const TASK_PRESETS = [
  { id: 'blog-excerpt', label: 'Blog excerpt', task: 'Napiši kratak excerpt (2 rečenice) za blog članak.' },
  { id: 'blog-body', label: 'Blog sadržaj', task: 'Napiši Markdown sadržaj blog članka (naslovi, liste, CTA na kraju).' },
  { id: 'portfolio', label: 'Portfolio opis', task: 'Napiši opis projekta za portfolio karticu (2-3 rečenice).' },
  { id: 'translate-en', label: 'Prijevod EN', task: 'Prevedi kontekst na engleski, zadrži ton brenda Protos Web.' },
] as const

type AdminAiPanelProps = {
  onInsert?: (text: string) => void
}

export default function AdminAiPanel({ onInsert }: AdminAiPanelProps) {
  const [provider, setProvider] = useState<Provider>('deepseek')
  const [context, setContext] = useState('')
  const [task, setTask] = useState<string>(TASK_PRESETS[0].task)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const send = async () => {
    if (!context.trim() && messages.length === 0) {
      setError('Unesi kontekst ili nastavi razgovor.')
      return
    }
    setLoading(true)
    setError('')

    const userContent = context.trim() || task
    const nextMessages = [...messages, { role: 'user' as const, content: userContent }]

    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          messages: [
            {
              role: 'system',
              content:
                'Ti si pomoćnik za Protos Web studio. Odgovaraj kratko i korisno. Vraćaj samo traženi output.',
            },
            ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      })

      const data = (await res.json()) as { content?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? `Greška ${res.status}`)
        return
      }

      const reply = data.content ?? ''
      setMessages([...nextMessages, { role: 'assistant', content: reply }])
      setContext('')
    } catch {
      setError('Mrežna greška')
    } finally {
      setLoading(false)
    }
  }

  const runPreset = async (presetTask: string) => {
    setTask(presetTask)
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, task: presetTask, context }),
      })
      const data = (await res.json()) as { content?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? `Greška ${res.status}`)
        return
      }
      const reply = data.content ?? ''
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `[${presetTask}]\n${context}` },
        { role: 'assistant', content: reply },
      ])
    } catch {
      setError('Mrežna greška')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['deepseek', 'gemini'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                provider === p
                  ? 'border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]'
                  : 'border-white/10 text-[var(--light-muted)] hover:border-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/40 min-h-[280px] max-h-[420px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-[var(--light-muted)]">Odaberi preset ili pošalji poruku s kontekstom.</p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-white/5 text-[var(--light-muted)]'
                    : 'bg-[var(--primary)]/10 text-[var(--light)] border border-[var(--primary)]/20'
                }`}
              >
                {m.content}
              </div>
            ))
          )}
          {loading ? (
            <div className="flex justify-center py-4">
              <ProtosLoader variant="ring" size={28} color="purple" />
            </div>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="Kontekst: naslov, bulleti, postojeći tekst…"
          className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-sm font-mono"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-50"
          >
            Pošalji
          </button>
          {messages.length > 0 && onInsert ? (
            <button
              type="button"
              onClick={() => onInsert(messages[messages.length - 1]?.content ?? '')}
              className="px-5 py-2 rounded-full border border-white/15 text-sm text-[var(--light)] hover:border-[var(--primary)]"
            >
              Umetni zadnji odgovor u formu
            </button>
          ) : null}
        </div>
      </div>

      <aside className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--light)]">Brzi zadaci</h3>
        {TASK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={loading}
            onClick={() => void runPreset(preset.task)}
            className="w-full text-left rounded-xl border border-white/10 bg-[var(--dark-card)]/50 px-4 py-3 text-sm hover:border-[var(--primary)]/40 disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
        <p className="text-xs text-[var(--light-muted)] leading-relaxed">
          Ključeve postavi na Vercel: <code className="text-cyan-300">DEEPSEEK_API_KEY</code>,{' '}
          <code className="text-cyan-300">GEMINI_API_KEY</code>
        </p>
      </aside>
    </div>
  )
}
