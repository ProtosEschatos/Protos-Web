'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import {
  ADMIN_API_KEY_CATEGORIES,
  ADMIN_API_KEY_PROVIDERS,
  findApiKeyProvider,
  type AdminApiKeyProviderMeta,
} from '@/lib/config/api-key-providers'
import {
  adminCreateApiKey,
  adminDeleteApiKey,
  adminRevealApiKey,
  adminUpdateApiKey,
} from '@/actions/admin-api-keys'
import { toast } from '@/lib/stores/toast-store'
import type {
  AdminApiKeyEnvTarget,
  AdminApiKeyListItem,
} from '@/types/admin-api-keys'

type Props = {
  initialKeys: AdminApiKeyListItem[]
  loadError: string | null
}

const ENV_LABEL: Record<AdminApiKeyEnvTarget, string> = {
  all: 'Sve',
  production: 'Production',
  preview: 'Preview',
  development: 'Dev',
}

const ENV_TONE: Record<AdminApiKeyEnvTarget, string> = {
  all: 'text-slate-300 border-slate-700',
  production: 'text-emerald-300 border-emerald-500/40',
  preview: 'text-amber-300 border-amber-500/40',
  development: 'text-indigo-300 border-indigo-500/40',
}

export default function ApiKeysManager({ initialKeys, loadError }: Props) {
  const [keys, setKeys] = useState<AdminApiKeyListItem[]>(initialKeys)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, string>>({})
  const [pendingReveal, setPendingReveal] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [pendingActive, setPendingActive] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const byCategory = new Map<string, AdminApiKeyListItem[]>()
    for (const key of keys) {
      const meta = findApiKeyProvider(key.provider)
      const cat = meta.category
      const bucket = byCategory.get(cat) ?? []
      bucket.push(key)
      byCategory.set(cat, bucket)
    }
    return Array.from(byCategory.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [keys])

  async function handleReveal(id: string) {
    if (revealed[id]) {
      setRevealed((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      return
    }
    setPendingReveal(id)
    const result = await adminRevealApiKey(id)
    setPendingReveal(null)
    if (!result.success) {
      toast.error('Ne mogu otkriti ključ', result.error)
      return
    }
    setRevealed((prev) => ({ ...prev, [id]: result.data.value }))
  }

  async function handleCopy(id: string) {
    const value = revealed[id]
    if (!value) {
      const result = await adminRevealApiKey(id)
      if (!result.success) {
        toast.error('Ne mogu kopirati', result.error)
        return
      }
      await navigator.clipboard.writeText(result.data.value)
      toast.success('Kopirano', 'Vrijednost ključa je u međuspremniku.')
      return
    }
    await navigator.clipboard.writeText(value)
    toast.success('Kopirano', 'Vrijednost ključa je u međuspremniku.')
  }

  async function handleToggleActive(key: AdminApiKeyListItem) {
    setPendingActive(key.id)
    const result = await adminUpdateApiKey(key.id, { isActive: !key.isActive })
    setPendingActive(null)
    if (!result.success) {
      toast.error('Ne mogu ažurirati', result.error)
      return
    }
    setKeys((prev) => prev.map((k) => (k.id === key.id ? { ...k, isActive: !k.isActive } : k)))
    toast.success(!key.isActive ? 'Ključ aktiviran' : 'Ključ deaktiviran', key.label)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Trajno obrisati ovaj ključ? Nema undo.')) return
    setPendingDelete(id)
    const result = await adminDeleteApiKey(id)
    setPendingDelete(null)
    if (!result.success) {
      toast.error('Ne mogu obrisati', result.error)
      return
    }
    setKeys((prev) => prev.filter((k) => k.id !== id))
    setRevealed((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    toast.success('Obrisano', 'Ključ je uklonjen iz baze.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="admin-mono text-xs text-slate-500">
          {keys.length === 0
            ? 'Još nema ključeva.'
            : `${keys.length} ${keys.length === 1 ? 'ključ' : 'ključeva'} u trezoru`}
        </p>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          Novi ključ
        </button>
      </div>

      {loadError ? (
        <div className="admin-card border-rose-500/40 p-4 text-sm text-rose-300">
          {loadError}
        </div>
      ) : null}

      {keys.length === 0 && !loadError ? (
        <div className="admin-card flex flex-col items-center gap-3 p-10 text-center">
          <KeyRound className="h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-400">
            Dodaj prvi ključ — bit će enkriptiran i dostupan serverskim funkcijama.
          </p>
        </div>
      ) : null}

      {grouped.map(([category, items]) => (
        <section key={category} className="space-y-3">
          <h3 className="admin-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
            {ADMIN_API_KEY_CATEGORIES[category as keyof typeof ADMIN_API_KEY_CATEGORIES] ?? category}
          </h3>
          <div className="space-y-2">
            {items.map((key) => {
              const meta = findApiKeyProvider(key.provider)
              const revealValue = revealed[key.id]
              const isRevealing = pendingReveal === key.id
              const isTogglingActive = pendingActive === key.id
              const isDeleting = pendingDelete === key.id
              return (
                <article
                  key={key.id}
                  className={`admin-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between ${
                    key.isActive ? '' : 'opacity-60'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="admin-mono text-[11px] uppercase tracking-wider text-indigo-300">
                        {meta.label}
                      </span>
                      <span
                        className={`admin-mono rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${ENV_TONE[key.envTarget]}`}
                      >
                        {ENV_LABEL[key.envTarget]}
                      </span>
                      {!key.isActive ? (
                        <span className="admin-mono rounded border border-slate-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                          Neaktivno
                        </span>
                      ) : null}
                    </div>
                    <h4 className="truncate text-sm font-medium text-slate-100">{key.label}</h4>
                    <p className="admin-mono truncate text-[11px] text-slate-500">
                      {revealValue ?? key.maskedHint ?? '••••••••'}
                    </p>
                    {key.notes ? (
                      <p className="text-xs text-slate-500">{key.notes}</p>
                    ) : null}
                    <p className="admin-mono text-[10px] text-slate-600">
                      Zadnja uporaba: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString('hr-HR') : '—'}
                      {meta.envHint ? <> · env hint <code className="text-slate-400">{meta.envHint}</code></> : null}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReveal(key.id)}
                      disabled={isRevealing}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-300 disabled:opacity-60"
                      title={revealValue ? 'Sakrij' : 'Otkrij'}
                    >
                      {isRevealing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : revealValue ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                      {revealValue ? 'Sakrij' : 'Otkrij'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(key.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-300"
                      title="Kopiraj"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Kopiraj
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(key)}
                      disabled={isTogglingActive}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-60"
                      title={key.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                    >
                      {isTogglingActive ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : key.isActive ? (
                        <X className="h-3.5 w-3.5" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {key.isActive ? 'Isključi' : 'Uključi'}
                    </button>

                    <a
                      href={meta.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
                      title="Dashboard providera"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(key.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-rose-400 transition-colors hover:border-rose-500/40 hover:text-rose-300 disabled:opacity-60"
                      title="Obriši"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}

      {dialogOpen ? (
        <NewKeyDialog
          onClose={() => setDialogOpen(false)}
          onCreated={(created) => {
            setKeys((prev) => [created, ...prev])
            setDialogOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}

type DialogProps = {
  onClose: () => void
  onCreated: (created: AdminApiKeyListItem) => void
}

function NewKeyDialog({ onClose, onCreated }: DialogProps) {
  const [provider, setProvider] = useState<string>('openai')
  const [customProvider, setCustomProvider] = useState('')
  const [label, setLabel] = useState('')
  const [envTarget, setEnvTarget] = useState<AdminApiKeyEnvTarget>('all')
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')
  const [pending, startTransition] = useTransition()

  const providerMeta: AdminApiKeyProviderMeta = findApiKeyProvider(provider)
  const isCustom = provider === 'custom'
  const finalProvider = isCustom ? customProvider.trim().toLowerCase() : provider

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const result = await adminCreateApiKey({
        provider: finalProvider,
        label: label.trim(),
        envTarget,
        value,
        notes: notes.trim() || null,
        isActive: true,
      })
      if (!result.success) {
        toast.error('Ne mogu spremiti ključ', result.error)
        return
      }
      onCreated({
        id: result.data.id,
        provider: finalProvider,
        label: label.trim(),
        envTarget,
        maskedHint: null,
        notes: notes.trim() || null,
        isActive: true,
        lastUsedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      toast.success('Ključ spremljen', `${providerMeta.label} · ${label.trim()}`)
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="admin-card w-full max-w-lg space-y-4 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-key-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="new-key-title" className="text-base font-bold text-slate-100">
              Novi API ključ
            </h2>
            <p className="admin-mono mt-1 text-[11px] text-slate-500">
              Vrijednost će biti odmah enkriptirana i nikad neće izaći iz servera u plain-textu bez tvoje akcije.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="rounded-md text-slate-500 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Provider</span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {ADMIN_API_KEY_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Nalijepnica</span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`Npr. ${providerMeta.label} Live`}
              required
              maxLength={80}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        </div>

        {isCustom ? (
          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
              Custom provider id (slug)
            </span>
            <input
              type="text"
              value={customProvider}
              onChange={(e) => setCustomProvider(e.target.value)}
              placeholder="npr. runway"
              pattern="[a-z0-9_\-]+"
              required
              maxLength={48}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        ) : null}

        <label className="block space-y-1">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Vrijednost ključa
          </span>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            minLength={4}
            rows={3}
            spellCheck={false}
            className="admin-mono w-full resize-y rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-emerald-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            placeholder="sk_live_..."
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Env scope</span>
            <select
              value={envTarget}
              onChange={(e) => setEnvTarget(e.target.value as AdminApiKeyEnvTarget)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">Sve</option>
              <option value="production">Production</option>
              <option value="preview">Preview</option>
              <option value="development">Development</option>
            </select>
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
              placeholder="Npr. rotate 2026-08-01"
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        </div>

        {providerMeta.envHint ? (
          <p className="admin-mono text-[11px] text-slate-500">
            Ekvivalent u Vercelu: <code className="text-slate-300">{providerMeta.envHint}</code>
          </p>
        ) : null}

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
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Spremi
          </button>
        </div>
      </form>
    </div>
  )
}
