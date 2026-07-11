'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

type Provider = 'deepseek' | 'gemini'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const TASK_PRESETS = [
  { id: 'blog-excerpt', label: 'Blog excerpt', task: 'Napiši kratak excerpt (2 rečenice) za blog članak.' },
  { id: 'blog-body', label: 'Blog sadržaj', task: 'Napiši Markdown sadržaj blog članka (naslovi, liste, CTA na kraju).' },
  { id: 'portfolio', label: 'Portfolio opis', task: 'Napiši opis projekta za portfolio karticu (2–3 rečenice).' },
  { id: 'translate-en', label: 'Prijevod EN', task: 'Prevedi kontekst na engleski, zadrži ton brenda Protos Web.' },
  {
    id: 'admin-help',
    label: 'Što doraditi?',
    task: 'Na temelju konteksta projekta predloži 3 konkretna sljedeća koraka za Protos-Web (kratko, bulleti).',
  },
] as const

type Props = {
  deepseekReady: boolean
  geminiReady: boolean
}

export default function AdminAiPanel({ deepseekReady, geminiReady }: Props) {
  const [provider, setProvider] = useState<Provider>('deepseek')
  const [useMemory, setUseMemory] = useState(true)
  const [context, setContext] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const providerReady = provider === 'deepseek' ? deepseekReady : geminiReady

  const send = async (taskOverride?: string) => {
    if (!providerReady) {
      setError(
        provider === 'deepseek'
          ? 'Dodaj DEEPSEEK_API_KEY na Vercel.'
          : 'Dodaj GEMINI_API_KEY na Vercel.',
      )
      return
    }

    const userContent = taskOverride ?? (context.trim() || '')
    if (!userContent && messages.length === 0) {
      setError('Unesi kontekst ili odaberi brzi zadatak.')
      return
    }

    setLoading(true)
    setError('')

    const nextMessages = taskOverride
      ? messages
      : [...messages, { role: 'user' as const, content: userContent }]

    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          taskOverride
            ? { provider, task: taskOverride, context, useMemory }
            : {
                provider,
                useMemory,
                messages: [
                  ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
                ],
              },
        ),
      })

      const data = (await res.json()) as { content?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? `Greška ${res.status}`)
        return
      }

      const reply = data.content ?? ''
      const withUser = taskOverride
        ? [...messages, { role: 'user' as const, content: `[${taskOverride}]\n${context}` }]
        : nextMessages
      setMessages([...withUser, { role: 'assistant', content: reply }])
      if (!taskOverride) setContext('')
    } catch {
      setError('Mrežna greška')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['deepseek', 'gemini'] as const).map((p) => {
            const ready = p === 'deepseek' ? deepseekReady : geminiReady
            return (
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
                {!ready ? ' · nema ključa' : ''}
              </button>
            )
          })}
          <label className="ml-auto flex items-center gap-2 text-xs text-[var(--light-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={useMemory}
              onChange={(e) => setUseMemory(e.target.checked)}
              className="rounded border-white/20"
            />
            Uključi Protos-Agent memoriju
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/40 min-h-[280px] max-h-[420px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-[var(--light-muted)]">
              DeepSeek za tekst i planove. Uključi memoriju za kontekst projekta.
            </p>
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
            <div className="flex justify-center py-4 text-[var(--primary)]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="Kontekst: naslov, bulleti, postojeći tekst, pitanje o projektu…"
          className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-sm text-[var(--light)]"
        />

        <button
          type="button"
          onClick={() => void send()}
          disabled={loading}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
        >
          Pošalji
        </button>
      </div>

      <aside className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--light)]">Brzi zadaci</h3>
        {TASK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={loading}
            onClick={() => void send(preset.task)}
            className="w-full text-left rounded-xl border border-white/10 bg-[var(--dark-card)]/50 px-4 py-3 text-sm hover:border-[var(--primary)]/40 disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
        <p className="text-xs text-[var(--light-muted)] leading-relaxed">
          Vercel env: <code className="text-cyan-300">DEEPSEEK_API_KEY</code> (aktivan), opcionalno{' '}
          <code className="text-cyan-300">GEMINI_API_KEY</code>
        </p>
      </aside>
    </div>
  )
}
