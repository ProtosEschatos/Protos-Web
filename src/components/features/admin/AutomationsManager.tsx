'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  Check,
  ChevronDown,
  Loader2,
  Play,
  Plus,
  Trash2,
  Webhook,
  X,
  Zap,
} from 'lucide-react'
import {
  adminCreateAutomation,
  adminDeleteAutomation,
  adminFireAutomation,
  adminUpdateAutomation,
} from '@/actions/admin-automations'
import { toast } from '@/lib/stores/toast-store'
import type {
  AutomationAuthType,
  AutomationEvent,
  AutomationHttpMethod,
  AutomationWebhookListItem,
} from '@/types/admin-automations'

type Props = {
  initial: AutomationWebhookListItem[]
  loadError: string | null
}

const EVENT_LABEL: Record<AutomationEvent, string> = {
  manual: 'Ručno (samo iz admina)',
  'contact.received': 'Novi kontakt',
  'subscriber.new': 'Novi pretplatnik',
  'donation.completed': 'Uspješna donacija',
  'portfolio.published': 'Objavljen portfolio',
  'blog.published': 'Objavljen članak',
}

const METHODS: AutomationHttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const AUTH_TYPES: AutomationAuthType[] = ['none', 'bearer', 'basic', 'custom']

export default function AutomationsManager({ initial, loadError }: Props) {
  const [items, setItems] = useState(initial)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [firing, setFiring] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<AutomationEvent, AutomationWebhookListItem[]>()
    for (const item of items) {
      const list = map.get(item.event) ?? []
      list.push(item)
      map.set(item.event, list)
    }
    return Array.from(map.entries())
  }, [items])

  async function handleFire(id: string) {
    setFiring(id)
    const result = await adminFireAutomation(id)
    setFiring(null)
    if (!result.success) {
      toast.error('Ne mogu okinuti webhook', result.error)
      return
    }
    const { ok, status, durationMs, error } = result.data
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              fireCount: it.fireCount + 1,
              lastFiredAt: new Date().toISOString(),
              lastStatusCode: status,
              lastResponse: result.data.bodyPreview,
            }
          : it,
      ),
    )
    if (ok) {
      toast.success(`Webhook OK · ${status}`, `${durationMs} ms`)
    } else {
      toast.error(
        `Webhook nije uspio${status ? ' · ' + status : ''}`,
        error ?? 'Non-2xx odgovor',
      )
    }
  }

  async function handleToggle(item: AutomationWebhookListItem) {
    setToggling(item.id)
    const result = await adminUpdateAutomation(item.id, { isEnabled: !item.isEnabled })
    setToggling(null)
    if (!result.success) {
      toast.error('Ne mogu ažurirati', result.error)
      return
    }
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, isEnabled: !it.isEnabled } : it)))
    toast.success(!item.isEnabled ? 'Uključeno' : 'Isključeno', item.name)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Obrisati webhook? Nema undo.')) return
    setDeleting(id)
    const result = await adminDeleteAutomation(id)
    setDeleting(null)
    if (!result.success) {
      toast.error('Ne mogu obrisati', result.error)
      return
    }
    setItems((prev) => prev.filter((it) => it.id !== id))
    toast.success('Obrisano')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="admin-mono text-xs text-slate-500">
          {items.length === 0
            ? 'Još nema webhookova.'
            : `${items.length} ${items.length === 1 ? 'webhook' : 'webhookova'} registrirano`}
        </p>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          Novi webhook
        </button>
      </div>

      {loadError ? (
        <div className="admin-card border-rose-500/40 p-4 text-sm text-rose-300">{loadError}</div>
      ) : null}

      {items.length === 0 && !loadError ? (
        <div className="admin-card flex flex-col items-center gap-3 p-10 text-center">
          <Webhook className="h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-400">
            Dodaj prvi webhook — spoji se na Zapier, Slack, n8n ili bilo koji HTTP endpoint.
          </p>
        </div>
      ) : null}

      {grouped.map(([event, list]) => (
        <section key={event} className="space-y-3">
          <h3 className="admin-mono flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            {EVENT_LABEL[event]}
          </h3>
          <div className="space-y-2">
            {list.map((item) => {
              const isFiring = firing === item.id
              const isDeleting = deleting === item.id
              const isToggling = toggling === item.id
              const isExpanded = expandedId === item.id
              return (
                <article
                  key={item.id}
                  className={`admin-card space-y-3 p-4 ${item.isEnabled ? '' : 'opacity-60'}`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="admin-mono rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-indigo-300">
                          {item.method}
                        </span>
                        {item.authType !== 'none' ? (
                          <span className="admin-mono rounded border border-slate-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                            auth: {item.authType}
                          </span>
                        ) : null}
                        {!item.isEnabled ? (
                          <span className="admin-mono rounded border border-slate-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                            Isključeno
                          </span>
                        ) : null}
                      </div>
                      <h4 className="truncate text-sm font-medium text-slate-100">{item.name}</h4>
                      <p className="admin-mono break-all text-[11px] text-slate-400">{item.url}</p>
                      {item.notes ? <p className="text-xs text-slate-500">{item.notes}</p> : null}
                      <p className="admin-mono text-[10px] text-slate-600">
                        {item.fireCount}× okinuto · zadnji put{' '}
                        {item.lastFiredAt
                          ? new Date(item.lastFiredAt).toLocaleString('hr-HR')
                          : '—'}
                        {item.lastStatusCode ? (
                          <span
                            className={
                              item.lastStatusCode >= 200 && item.lastStatusCode < 300
                                ? ' text-emerald-400'
                                : ' text-rose-400'
                            }
                          >
                            {' '}
                            · {item.lastStatusCode}
                          </span>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleFire(item.id)}
                        disabled={isFiring || !item.isEnabled}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                      >
                        {isFiring ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                        Okini
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggle(item)}
                        disabled={isToggling}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-600 disabled:opacity-60"
                      >
                        {isToggling ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : item.isEnabled ? (
                          <X className="h-3.5 w-3.5" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        {item.isEnabled ? 'Isključi' : 'Uključi'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-600"
                      >
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-rose-400 hover:border-rose-500/40 disabled:opacity-60"
                      >
                        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-400">
                      <div>
                        <span className="admin-mono text-[10px] uppercase text-slate-500">
                          Custom headers
                        </span>
                        <pre className="admin-mono mt-1 overflow-x-auto text-xs text-slate-300">
{JSON.stringify(item.headersJson, null, 2)}
                        </pre>
                      </div>
                      {item.bodyTemplate ? (
                        <div>
                          <span className="admin-mono text-[10px] uppercase text-slate-500">
                            Body template
                          </span>
                          <pre className="admin-mono mt-1 overflow-x-auto text-xs text-slate-300">
{JSON.stringify(item.bodyTemplate, null, 2)}
                          </pre>
                        </div>
                      ) : null}
                      {item.lastResponse ? (
                        <div>
                          <span className="admin-mono text-[10px] uppercase text-slate-500">
                            Zadnji odgovor (preview)
                          </span>
                          <pre className="admin-mono mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-all text-xs text-slate-300">
{item.lastResponse}
                          </pre>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>
      ))}

      {dialogOpen ? (
        <NewWebhookDialog
          onClose={() => setDialogOpen(false)}
          onCreated={(created) => {
            setItems((prev) => [created, ...prev])
            setDialogOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}

type DialogProps = {
  onClose: () => void
  onCreated: (item: AutomationWebhookListItem) => void
}

function NewWebhookDialog({ onClose, onCreated }: DialogProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState<AutomationHttpMethod>('POST')
  const [event, setEvent] = useState<AutomationEvent>('manual')
  const [authType, setAuthType] = useState<AutomationAuthType>('none')
  const [authHeaderName, setAuthHeaderName] = useState('')
  const [authSecret, setAuthSecret] = useState('')
  const [notes, setNotes] = useState('')
  const [bodyTemplateText, setBodyTemplateText] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let bodyTemplate: unknown | null = null
    if (bodyTemplateText.trim()) {
      try {
        bodyTemplate = JSON.parse(bodyTemplateText)
      } catch {
        toast.error('Body template mora biti valjan JSON')
        return
      }
    }

    startTransition(async () => {
      const result = await adminCreateAutomation({
        name: name.trim(),
        url: url.trim(),
        method,
        event,
        authType,
        authHeaderName: authType === 'custom' ? authHeaderName.trim() : null,
        authSecret: authType !== 'none' ? authSecret : null,
        headersJson: {},
        bodyTemplate,
        notes: notes.trim() || null,
        isEnabled: true,
      })
      if (!result.success) {
        toast.error('Ne mogu spremiti webhook', result.error)
        return
      }
      onCreated({
        id: result.data.id,
        name: name.trim(),
        url: url.trim(),
        method,
        event,
        authType,
        authHeaderName: authType === 'custom' ? authHeaderName.trim() : null,
        hasAuthSecret: authType !== 'none' && Boolean(authSecret),
        headersJson: {},
        bodyTemplate,
        notes: notes.trim() || null,
        isEnabled: true,
        lastFiredAt: null,
        lastStatusCode: null,
        lastResponse: null,
        fireCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      toast.success('Webhook spremljen', name.trim())
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="admin-card w-full max-w-xl space-y-4 p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100">Novi webhook</h2>
            <p className="admin-mono mt-1 text-[11px] text-slate-500">
              HTTPS URL na Zapier / n8n / Make / Slack / vlastiti endpoint.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Zatvori" className="text-slate-500 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Ime</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Trigger event</span>
            <select
              value={event}
              onChange={(e) => setEvent(e.target.value as AutomationEvent)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {Object.entries(EVENT_LABEL).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">URL</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://hooks.zapier.com/…"
            className="admin-mono w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-emerald-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Metoda</span>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as AutomationHttpMethod)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Auth</span>
            <select
              value={authType}
              onChange={(e) => setAuthType(e.target.value as AutomationAuthType)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {AUTH_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        {authType === 'custom' ? (
          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
              Header ime (npr. X-API-Key)
            </span>
            <input
              type="text"
              value={authHeaderName}
              onChange={(e) => setAuthHeaderName(e.target.value)}
              required
              maxLength={80}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        ) : null}

        {authType !== 'none' ? (
          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
              Auth vrijednost {authType === 'basic' ? '(user:pass)' : ''}
            </span>
            <input
              type="password"
              value={authSecret}
              onChange={(e) => setAuthSecret(e.target.value)}
              minLength={4}
              maxLength={4096}
              className="admin-mono w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-emerald-200 focus:border-indigo-500 focus:outline-none"
            />
            <span className="admin-mono block text-[10px] text-slate-600">
              Enkriptirano AES-256-GCM prije spremanja u bazu.
            </span>
          </label>
        ) : null}

        <label className="block space-y-1">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Body template JSON (opcionalno)
          </span>
          <textarea
            value={bodyTemplateText}
            onChange={(e) => setBodyTemplateText(e.target.value)}
            rows={4}
            spellCheck={false}
            placeholder='{"text": "Novi kontakt na protosweb.eu"}'
            className="admin-mono w-full resize-y rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="block space-y-1">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Bilješka (opcionalno)
          </span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            Odustani
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30 disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Webhook className="h-4 w-4" />}
            Spremi
          </button>
        </div>
      </form>
    </div>
  )
}
