'use client'

import { useMemo, useState, useTransition } from 'react'
import { adminPublishArticle, adminPublishShort } from '@/actions/admin-publish'
import { PUBLISHERS } from '@/lib/publishers/meta-catalog'
import type { PublishPlatform } from '@/lib/publishers/types'
import type { PublishLogRow } from '@/lib/queries/admin/publish-log'
import AdminLink from '@/components/features/admin/AdminLink'
import { CheckCircle2, ExternalLink, Send, XCircle } from 'lucide-react'

type Props = {
  installedProviders: Set<string>
  recentLog: PublishLogRow[]
}

type ShortState = {
  platform: Extract<PublishPlatform, 'bluesky' | 'mastodon' | 'threads' | 'facebook' | 'instagram'>
  text: string
  linkUrl: string
  imageUrl: string
  options: Record<string, string>
}

type ArticleState = {
  platform: Extract<PublishPlatform, 'ghost' | 'hashnode' | 'devto'>
  title: string
  markdown: string
  excerpt: string
  canonicalUrl: string
  coverImageUrl: string
  tags: string
  published: boolean
  options: Record<string, string>
}

const SHORT_PLATFORMS = ['bluesky', 'mastodon', 'threads', 'facebook', 'instagram'] as const
const ARTICLE_PLATFORMS = ['ghost', 'hashnode', 'devto'] as const

export default function PublishManager({ installedProviders, recentLog }: Props) {
  const [tab, setTab] = useState<'short' | 'article' | 'log'>('short')

  return (
    <div className="space-y-6">
      <nav className="admin-card flex flex-wrap gap-2 p-2 text-sm">
        <TabBtn active={tab === 'short'} onClick={() => setTab('short')}>
          Social post
        </TabBtn>
        <TabBtn active={tab === 'article'} onClick={() => setTab('article')}>
          Long article
        </TabBtn>
        <TabBtn active={tab === 'log'} onClick={() => setTab('log')}>
          Log ({recentLog.length})
        </TabBtn>
      </nav>

      {tab === 'short' && <ShortForm installedProviders={installedProviders} />}
      {tab === 'article' && <ArticleForm installedProviders={installedProviders} />}
      {tab === 'log' && <LogView rows={recentLog} />}
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`admin-btn ${
        active ? 'admin-btn-primary' : 'admin-btn-ghost'
      } text-xs`}
    >
      {children}
    </button>
  )
}

function ShortForm({ installedProviders }: { installedProviders: Set<string> }) {
  const [state, setState] = useState<ShortState>({
    platform: 'bluesky',
    text: '',
    linkUrl: '',
    imageUrl: '',
    options: {},
  })
  const [status, setStatus] = useState<null | { ok: boolean; msg: string; url?: string }>(null)
  const [isPending, startTransition] = useTransition()

  const meta = PUBLISHERS[state.platform]
  const providerInstalled = meta.requiredProviders.every((p) => installedProviders.has(p))
  const remaining = 300 - state.text.length

  function submit() {
    if (!state.text.trim()) {
      setStatus({ ok: false, msg: 'Fali tekst.' })
      return
    }
    startTransition(async () => {
      setStatus(null)
      const result = await adminPublishShort({
        platform: state.platform,
        text: state.text,
        linkUrl: state.linkUrl || undefined,
        imageUrl: state.imageUrl || undefined,
        options: state.options,
      })
      if (result.ok) {
        setStatus({ ok: true, msg: 'Objavljeno.', url: result.remoteUrl })
        setState((s) => ({ ...s, text: '', linkUrl: '', imageUrl: '' }))
      } else {
        setStatus({ ok: false, msg: result.error })
      }
    })
  }

  return (
    <div className="admin-card space-y-4 p-5">
      <PlatformPicker
        value={state.platform}
        options={SHORT_PLATFORMS}
        installed={installedProviders}
        onChange={(p) => setState((s) => ({ ...s, platform: p, options: {} }))}
      />

      {!providerInstalled && (
        <ProviderMissingBanner providers={meta.requiredProviders} />
      )}

      <div>
        <label className="text-xs text-slate-400">Tekst posta</label>
        <textarea
          rows={5}
          value={state.text}
          onChange={(e) => setState((s) => ({ ...s, text: e.target.value }))}
          className="admin-input mt-1 w-full"
          placeholder="Kratki post, do 300 znakova (Bluesky) / 500 (Threads) / bez limita (Mastodon)…"
        />
        <div
          className={`mt-1 text-right text-[11px] ${
            remaining < 0 ? 'text-red-400' : 'text-slate-500'
          }`}
        >
          {remaining} / 300 (Bluesky hard limit)
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextInput
          label="Link URL (opt.)"
          value={state.linkUrl}
          onChange={(v) => setState((s) => ({ ...s, linkUrl: v }))}
          placeholder="https://protosweb.eu/blog/…"
        />
        <TextInput
          label="Image URL (opt.)"
          value={state.imageUrl}
          onChange={(v) => setState((s) => ({ ...s, imageUrl: v }))}
          placeholder="https://…/og-image.png"
        />
      </div>

      {meta.optionFields.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {meta.optionFields.map((f) => (
            <TextInput
              key={f.key}
              label={`${f.label}${f.required ? ' *' : ''}`}
              value={state.options[f.key] ?? ''}
              onChange={(v) =>
                setState((s) => ({
                  ...s,
                  options: { ...s.options, [f.key]: v },
                }))
              }
              placeholder={f.placeholder}
            />
          ))}
        </div>
      )}

      <StatusBanner status={status} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={isPending || !providerInstalled}
          className="admin-btn admin-btn-primary inline-flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isPending ? 'Objavljujem…' : `Objavi na ${meta.label}`}
        </button>
      </div>
    </div>
  )
}

function ArticleForm({ installedProviders }: { installedProviders: Set<string> }) {
  const [state, setState] = useState<ArticleState>({
    platform: 'devto',
    title: '',
    markdown: '',
    excerpt: '',
    canonicalUrl: '',
    coverImageUrl: '',
    tags: '',
    published: true,
    options: {},
  })
  const [status, setStatus] = useState<null | { ok: boolean; msg: string; url?: string }>(null)
  const [isPending, startTransition] = useTransition()

  const meta = PUBLISHERS[state.platform]
  const providerInstalled = meta.requiredProviders.every((p) => installedProviders.has(p))

  function submit() {
    if (state.title.trim().length < 3 || state.markdown.trim().length < 20) {
      setStatus({ ok: false, msg: 'Fali naslov ili tekst je prekratak.' })
      return
    }
    startTransition(async () => {
      setStatus(null)
      const tags = state.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5)
      const result = await adminPublishArticle({
        platform: state.platform,
        title: state.title,
        markdown: state.markdown,
        excerpt: state.excerpt || undefined,
        canonicalUrl: state.canonicalUrl || undefined,
        coverImageUrl: state.coverImageUrl || undefined,
        tags,
        published: state.published,
        options: state.options,
      })
      if (result.ok) {
        setStatus({ ok: true, msg: 'Objavljeno.', url: result.remoteUrl })
      } else {
        setStatus({ ok: false, msg: result.error })
      }
    })
  }

  return (
    <div className="admin-card space-y-4 p-5">
      <PlatformPicker
        value={state.platform}
        options={ARTICLE_PLATFORMS}
        installed={installedProviders}
        onChange={(p) => setState((s) => ({ ...s, platform: p, options: {} }))}
      />

      {!providerInstalled && <ProviderMissingBanner providers={meta.requiredProviders} />}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextInput
          label="Naslov *"
          value={state.title}
          onChange={(v) => setState((s) => ({ ...s, title: v }))}
        />
        <TextInput
          label="Tagovi (comma-separated)"
          value={state.tags}
          onChange={(v) => setState((s) => ({ ...s, tags: v }))}
          placeholder="nextjs, react, tailwind"
        />
      </div>

      <TextInput
        label="Excerpt / SEO description"
        value={state.excerpt}
        onChange={(v) => setState((s) => ({ ...s, excerpt: v }))}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextInput
          label="Canonical URL (originalni post)"
          value={state.canonicalUrl}
          onChange={(v) => setState((s) => ({ ...s, canonicalUrl: v }))}
          placeholder="https://protosweb.eu/blog/…"
        />
        <TextInput
          label="Cover image URL"
          value={state.coverImageUrl}
          onChange={(v) => setState((s) => ({ ...s, coverImageUrl: v }))}
        />
      </div>

      <div>
        <label className="text-xs text-slate-400">Markdown</label>
        <textarea
          rows={12}
          value={state.markdown}
          onChange={(e) => setState((s) => ({ ...s, markdown: e.target.value }))}
          className="admin-input admin-mono mt-1 w-full text-xs"
          placeholder={'# Naslov\n\nUvodni paragraf…\n\n## Podnaslov\n\n- bullet\n- bullet'}
        />
      </div>

      {meta.optionFields.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {meta.optionFields.map((f) => (
            <TextInput
              key={f.key}
              label={`${f.label}${f.required ? ' *' : ''}`}
              value={state.options[f.key] ?? ''}
              onChange={(v) =>
                setState((s) => ({
                  ...s,
                  options: { ...s.options, [f.key]: v },
                }))
              }
              placeholder={f.placeholder}
            />
          ))}
        </div>
      )}

      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={state.published}
          onChange={(e) => setState((s) => ({ ...s, published: e.target.checked }))}
        />
        Odmah objavi (ako nije označeno, snima se kao draft)
      </label>

      <StatusBanner status={status} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={isPending || !providerInstalled}
          className="admin-btn admin-btn-primary inline-flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isPending ? 'Objavljujem…' : `Objavi na ${meta.label}`}
        </button>
      </div>
    </div>
  )
}

function PlatformPicker<T extends PublishPlatform>({
  value,
  options,
  installed,
  onChange,
}: {
  value: T
  options: readonly T[]
  installed: Set<string>
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((platform) => {
        const meta = PUBLISHERS[platform]
        const ready = meta.requiredProviders.every((p) => installed.has(p))
        return (
          <button
            key={platform}
            type="button"
            onClick={() => onChange(platform)}
            className={`admin-btn text-xs ${
              value === platform
                ? 'admin-btn-primary'
                : ready
                  ? 'admin-btn-ghost'
                  : 'admin-btn-ghost opacity-60'
            }`}
            title={ready ? '' : `Fali ključ: ${meta.requiredProviders.join(', ')}`}
          >
            {meta.label} {ready ? '' : '·'}
          </button>
        )
      })}
    </div>
  )
}

function ProviderMissingBanner({ providers }: { providers: string[] }) {
  return (
    <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-300">
      Fali aktivan ključ za: <code className="admin-mono">{providers.join(', ')}</code>. Otvori{' '}
      <AdminLink className="underline" href="/admin/kljucevi">
        /admin/kljucevi
      </AdminLink>{' '}
      i dodaj ga.
    </div>
  )
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col text-xs text-slate-400">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="admin-input mt-1"
      />
    </label>
  )
}

function StatusBanner({
  status,
}: {
  status: null | { ok: boolean; msg: string; url?: string }
}) {
  if (!status) return null
  return status.ok ? (
    <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-300">
      <CheckCircle2 className="h-4 w-4" />
      <span>{status.msg}</span>
      {status.url && (
        <a
          href={status.url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1 underline"
        >
          Otvori <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  ) : (
    <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300">
      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="admin-mono">{status.msg}</span>
    </div>
  )
}

function LogView({ rows }: { rows: PublishLogRow[] }) {
  const grouped = useMemo(() => rows.slice(0, 30), [rows])
  if (grouped.length === 0) {
    return (
      <div className="admin-card p-10 text-center text-sm text-slate-500">
        Nema objavljenih postova još. Prva objava se ovdje pojavi odmah.
      </div>
    )
  }
  return (
    <div className="admin-card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Kada</th>
            <th className="px-4 py-3">Platforma</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Sadržaj</th>
            <th className="px-4 py-3">Link</th>
          </tr>
        </thead>
        <tbody>
          {grouped.map((row) => (
            <tr key={row.id} className="border-t border-slate-800/60 align-top">
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                {new Date(row.createdAt).toLocaleString('hr-HR', {
                  timeZone: 'Europe/Zagreb',
                })}
              </td>
              <td className="px-4 py-3 text-xs text-slate-300">
                {PUBLISHERS[row.platform as PublishPlatform]?.label ?? row.platform}
                <div className="text-[10px] uppercase text-slate-500">{row.kind}</div>
              </td>
              <td className="px-4 py-3">
                {row.status === 'ok' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">
                <div className="font-medium text-slate-200">{row.title ?? '—'}</div>
                {row.bodyPreview && (
                  <div className="mt-1 line-clamp-2 max-w-md text-slate-500">
                    {row.bodyPreview}
                  </div>
                )}
                {row.errorMessage && (
                  <div className="admin-mono mt-1 max-w-md text-[11px] text-red-300">
                    {row.errorMessage}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-xs">
                {row.remoteUrl ? (
                  <a
                    className="inline-flex items-center gap-1 text-indigo-300 hover:underline"
                    href={row.remoteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Otvori <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
