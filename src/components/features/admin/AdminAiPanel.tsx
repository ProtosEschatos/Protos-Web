'use client'

import { useEffect, useState } from 'react'
import { Clock, Loader2 } from 'lucide-react'

type Provider = 'gpt-oss' | 'deepseek' | 'gemini'

const PROVIDER_LABELS: Record<Provider, string> = {
  'gpt-oss': 'GPT-OSS-120B',
  deepseek: 'DeepSeek',
  gemini: 'Gemini',
}

const PROVIDER_ENV: Record<Provider, string> = {
  'gpt-oss': 'GPT_OSS_API_KEY',
  deepseek: 'DEEPSEEK_API_KEY',
  gemini: 'GEMINI_API_KEY',
}

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
  gptOssReady: boolean
  deepseekReady: boolean
  geminiReady: boolean
}

export default function AdminAiPanel({ gptOssReady, deepseekReady, geminiReady }: Props) {
  const readiness: Record<Provider, boolean> = {
    'gpt-oss': gptOssReady,
    deepseek: deepseekReady,
    gemini: geminiReady,
  }
  const initialProvider: Provider =
    (['gpt-oss', 'deepseek', 'gemini'] as const).find((p) => readiness[p]) ?? 'gpt-oss'

  const [provider, setProvider] = useState<Provider>(initialProvider)
  const [useMemory, setUseMemory] = useState(true)
  const [context, setContext] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [queue, setQueue] = useState<string[]>([])

  const providerReady = readiness[provider]

  const send = async (taskOverride?: string, queuedContent?: string) => {
    if (!providerReady) {
      setError(`Dodaj ${PROVIDER_ENV[provider]} na Vercel.`)
      return
    }

    const userContent = taskOverride ?? queuedContent ?? (context.trim() || '')
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

  // Auto-send the next queued message once the current request finishes.
  useEffect(() => {
    if (loading || queue.length === 0) return
    const [next, ...rest] = queue
    setQueue(rest)
    void send(undefined, next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, queue])

  const submitText = () => {
    const text = context.trim()
    if (!text) return
    setContext('')
    if (loading) {
      setQueue((q) => [...q, text])
      return
    }
    void send(undefined, text)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['gpt-oss', 'deepseek', 'gemini'] as const).map((p) => {
            const ready = readiness[p]
            return (
              <button
                key={p}
                type="button"
                onClick={() => setProvider(p)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  provider === p
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {PROVIDER_LABELS[p]}
                {!ready ? ' · nema ključa' : ''}
              </button>
            )
          })}
          <label className="ml-auto flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={useMemory}
              onChange={(e) => setUseMemory(e.target.checked)}
              className="rounded border-slate-600"
            />
            Uključi Protos-Agent memoriju
          </label>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 min-h-[280px] max-h-[420px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">
              DeepSeek za tekst i planove. Uključi memoriju za kontekst projekta.
            </p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-indigo-500/10 text-slate-100 border border-indigo-500/25'
                }`}
              >
                {m.content}
              </div>
            ))
          )}
          {loading ? (
            <div className="flex justify-center py-4 text-indigo-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : null}
        </div>

        {queue.length > 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {queue.length === 1
                ? '1 poruka čeka u redu — šalje se automatski čim stigne odgovor.'
                : `${queue.length} poruke čekaju u redu — šalju se automatski redom.`}
            </span>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submitText()
            }
          }}
          rows={4}
          placeholder={
            loading
              ? 'Bot odgovara… nova poruka ide u red čekanja (Enter za slanje).'
              : 'Kontekst: naslov, bulleti, postojeći tekst, pitanje o projektu… (Enter za slanje, Shift+Enter za novi red)'
          }
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 caret-indigo-400 focus:border-indigo-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={submitText}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
        >
          {loading ? 'Dodaj u red čekanja' : 'Pošalji'}
        </button>
      </div>

      <aside className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Brzi zadaci</h3>
        {TASK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={loading}
            onClick={() => void send(preset.task)}
            className="w-full text-left rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-300 hover:border-indigo-500/40 disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
        <p className="text-xs text-slate-400 leading-relaxed">
          Vercel env cascade:{' '}
          <code className="text-cyan-300">GPT_OSS_API_KEY</code> →{' '}
          <code className="text-cyan-300">DEEPSEEK_API_KEY</code> →{' '}
          <code className="text-cyan-300">GEMINI_API_KEY</code>. Prvi konfigurirani se koristi;
          ostali su failover.
        </p>
      </aside>
    </div>
  )
}
