'use client'

import { useState } from 'react'
import {
  Check,
  Copy,
  FileEdit,
  Hash,
  Loader2,
  Send,
  Sparkles,
  Tag,
  Wand2,
} from 'lucide-react'
import {
  CONTENT_TONES,
  PUBLISHING_PLATFORMS,
  SEO_LOCALES,
  SOCIAL_PLATFORMS,
  type ArticleRewriteResponse,
  type PublishingPlatform,
  type SeoBriefResponse,
  type SocialPlatform,
} from '@/lib/schemas/seo-content'
import { toast } from '@/lib/stores/toast-store'

type Mode = 'brief' | 'rewriter'

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  youtube: 'YouTube',
  'youtube-shorts': 'YouTube Shorts',
  instagram: 'Instagram',
  'instagram-reels': 'Reels',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  'x-twitter': 'X (Twitter)',
}

const PLATFORM_LABELS: Record<PublishingPlatform, string> = {
  medium: 'Medium',
  substack: 'Substack',
  blogger: 'Blogger',
  tumblr: 'Tumblr',
  aboutme: 'About.me',
  payhip: 'Payhip',
}

const TONE_LABELS: Record<(typeof CONTENT_TONES)[number], string> = {
  profesionalan: 'Profesionalan',
  prijateljski: 'Prijateljski',
  tehnički: 'Tehnički',
  igran: 'Igran',
  inspirativan: 'Inspirativan',
  edukacijski: 'Edukacijski',
}

const LOCALE_LABELS: Record<(typeof SEO_LOCALES)[number], string> = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
  sr: 'Srpski',
}

function copy(text: string, label: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  navigator.clipboard.writeText(text).then(
    () => toast.success('Kopirano', label),
    () => toast.error('Kopiranje', 'Nije uspjelo'),
  )
}

export default function SeoContentStudio() {
  const [mode, setMode] = useState<Mode>('brief')

  return (
    <div className="space-y-4">
      <div className="admin-card inline-flex overflow-hidden rounded-md border-slate-800">
        <button
          type="button"
          onClick={() => setMode('brief')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs transition-colors ${
            mode === 'brief'
              ? 'bg-indigo-500/10 text-indigo-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Brief generator
        </button>
        <button
          type="button"
          onClick={() => setMode('rewriter')}
          className={`inline-flex items-center gap-2 border-l border-slate-800 px-4 py-2 text-xs transition-colors ${
            mode === 'rewriter'
              ? 'bg-indigo-500/10 text-indigo-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileEdit className="h-3.5 w-3.5" />
          Article rewriter
        </button>
      </div>

      {mode === 'brief' ? <BriefGenerator /> : <ArticleRewriter />}
    </div>
  )
}

/* ─────────────────── Brief generator ─────────────────── */

function BriefGenerator() {
  const [topic, setTopic] = useState('')
  const [locale, setLocale] = useState<(typeof SEO_LOCALES)[number]>('hr')
  const [tone, setTone] = useState<(typeof CONTENT_TONES)[number]>('profesionalan')
  const [audience, setAudience] = useState('')
  const [cta, setCta] = useState('')
  const [keywords, setKeywords] = useState('')
  const [socials, setSocials] = useState<SocialPlatform[]>([
    'youtube',
    'instagram',
    'instagram-reels',
    'facebook',
    'tiktok',
    'linkedin',
  ])
  const [pending, setPending] = useState(false)
  const [brief, setBrief] = useState<SeoBriefResponse | null>(null)
  const [provider, setProvider] = useState<string | null>(null)

  function toggleSocial(p: SocialPlatform) {
    setSocials((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    )
  }

  async function submit() {
    const trimmed = topic.trim()
    if (trimmed.length < 5 || socials.length === 0) {
      toast.warning('Fali', 'Tema (min 5) + barem 1 platforma')
      return
    }
    setPending(true)
    setBrief(null)
    try {
      const res = await fetch('/api/admin/ai/seo-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: trimmed,
          locale,
          tone,
          audience: audience.trim() || undefined,
          cta: cta.trim() || undefined,
          keywords: keywords
            .split(',')
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
          socialPlatforms: socials,
        }),
      })
      const data = (await res.json()) as {
        brief?: SeoBriefResponse
        provider?: string
        error?: string
      }
      if (!res.ok || !data.brief) {
        toast.error('SEO brief', data.error ?? `HTTP ${res.status}`)
        return
      }
      setBrief(data.brief)
      setProvider(data.provider ?? null)
      toast.success('Brief gotov', `${data.provider} • ${data.brief.keywords.length} keyworda`)
    } catch (err) {
      toast.error('SEO brief', (err as Error).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      {/* Input */}
      <section className="admin-card space-y-3 p-4">
        <header className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100">Generiraj SEO brief</h3>
        </header>

        <label className="block">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Tema / prompt
          </span>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder='npr. "kako naručiti izradu web stranice u Zagrebu bez skrivenih troškova"'
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
              Jezik
            </span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as typeof locale)}
              className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {SEO_LOCALES.map((l) => (
                <option key={l} value={l}>
                  {LOCALE_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Ton</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as typeof tone)}
              className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {CONTENT_TONES.map((t) => (
                <option key={t} value={t}>
                  {TONE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Publika (opcionalno)
          </span>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            maxLength={200}
            placeholder="npr. mali obrti u Hrvatskoj"
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            CTA (opcionalno)
          </span>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            maxLength={200}
            placeholder='npr. "javi se za besplatnu procjenu"'
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Preferirani keywordi (comma-separated)
          </span>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="izrada web stranica, seo zagreb, three.js portfolio"
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <div>
          <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Društvene platforme ({socials.length})
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {SOCIAL_PLATFORMS.map((p) => {
              const active = socials.includes(p)
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleSocial(p)}
                  className={`admin-mono rounded-full border px-2 py-1 text-[10px] transition-colors ${
                    active
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {active ? <Check className="mr-1 inline h-3 w-3" /> : null}
                  {SOCIAL_LABELS[p]}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={pending || topic.trim().length < 5}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Generiraj SEO paket
        </button>
      </section>

      {/* Output */}
      <section className="space-y-3">
        {!brief ? (
          <div className="admin-card flex h-full min-h-[300px] items-center justify-center p-6">
            <p className="admin-mono text-center text-[11px] text-slate-500">
              {pending ? 'Generiram…' : 'Pošalji brief da vidiš rezultat ovdje.'}
            </p>
          </div>
        ) : (
          <BriefResult brief={brief} provider={provider} />
        )}
      </section>
    </div>
  )
}

function BriefResult({ brief, provider }: { brief: SeoBriefResponse; provider: string | null }) {
  const socialEntries = Object.entries(brief.socialCaptions) as Array<
    [SocialPlatform, string]
  >

  return (
    <div className="space-y-3">
      <div className="admin-card p-4">
        <div className="flex items-center justify-between">
          <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Meta</p>
          <span className="admin-mono text-[10px] text-slate-500">{provider}</span>
        </div>
        <BriefRow label="Title" value={brief.title} multi={false} />
        <BriefRow label="Meta description" value={brief.metaDescription} multi />
        <BriefRow label="OG title" value={brief.ogTitle} multi={false} />
        <BriefRow label="OG description" value={brief.ogDescription} multi />
        <BriefRow label="Slug" value={brief.slug} multi={false} mono />
        {brief.ctaLine ? <BriefRow label="CTA" value={brief.ctaLine} multi /> : null}
      </div>

      <div className="admin-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="admin-mono flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
            <Tag className="h-3 w-3 text-indigo-400" /> Keywords ({brief.keywords.length})
          </p>
          <button
            type="button"
            onClick={() => copy(brief.keywords.join(', '), 'Keywords')}
            className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-slate-100"
            title="Kopiraj sve"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {brief.keywords.map((k) => (
            <span
              key={k}
              className="admin-mono rounded border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] text-emerald-300"
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="admin-mono flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
            <Hash className="h-3 w-3 text-indigo-400" /> Hashtags ({brief.hashtags.length})
          </p>
          <button
            type="button"
            onClick={() => copy(brief.hashtags.map((h) => `#${h}`).join(' '), 'Hashtags')}
            className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-slate-100"
            title="Kopiraj sve s #"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {brief.hashtags.map((h) => (
            <span
              key={h}
              className="admin-mono rounded border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] text-indigo-300"
            >
              #{h}
            </span>
          ))}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <p className="border-b border-slate-800 bg-slate-950/60 px-4 py-2 admin-mono text-[10px] uppercase tracking-wider text-slate-500">
          Social captions
        </p>
        <div className="divide-y divide-slate-800">
          {socialEntries.map(([platform, caption]) => (
            <div key={platform} className="space-y-2 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-100">{SOCIAL_LABELS[platform]}</p>
                <button
                  type="button"
                  onClick={() => copy(caption, SOCIAL_LABELS[platform])}
                  className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-slate-100"
                  title="Kopiraj caption"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <pre className="admin-mono max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-slate-800 bg-slate-950/50 p-2 text-[11px] text-slate-300">
{caption}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BriefRow({
  label,
  value,
  multi,
  mono,
}: {
  label: string
  value: string
  multi: boolean
  mono?: boolean
}) {
  return (
    <div className="mt-2 flex items-start gap-2">
      <div className="min-w-0 flex-1">
        <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        {multi ? (
          <p className={`text-xs text-slate-200 ${mono ? 'admin-mono' : ''}`}>{value}</p>
        ) : (
          <p className={`truncate text-xs text-slate-200 ${mono ? 'admin-mono text-emerald-300' : ''}`}>
            {value}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => copy(value, label)}
        className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-slate-100"
        title={`Kopiraj ${label.toLowerCase()}`}
      >
        <Copy className="h-3 w-3" />
      </button>
    </div>
  )
}

/* ─────────────────── Article rewriter ─────────────────── */

function ArticleRewriter() {
  const [sourceTitle, setSourceTitle] = useState('')
  const [sourceContent, setSourceContent] = useState('')
  const [sourceLocale, setSourceLocale] = useState<(typeof SEO_LOCALES)[number]>('hr')
  const [targetLocale, setTargetLocale] = useState<(typeof SEO_LOCALES)[number]>('hr')
  const [tone, setTone] = useState<(typeof CONTENT_TONES)[number]>('profesionalan')
  const [platforms, setPlatforms] = useState<PublishingPlatform[]>([
    'medium',
    'substack',
    'blogger',
    'tumblr',
  ])
  const [keepLinkTo, setKeepLinkTo] = useState('https://www.protosweb.eu/blog')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<ArticleRewriteResponse | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<PublishingPlatform | null>(null)

  function togglePlatform(p: PublishingPlatform) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    )
  }

  async function submit() {
    if (sourceTitle.trim().length < 3 || sourceContent.trim().length < 100 || platforms.length === 0) {
      toast.warning('Fali', 'Naslov (3+), sadržaj (100+ znakova), barem 1 platforma')
      return
    }
    setPending(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/ai/rewrite-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTitle: sourceTitle.trim(),
          sourceContent: sourceContent.trim(),
          sourceLocale,
          targetLocale,
          platforms,
          tone,
          keepLinkTo: keepLinkTo.trim() || undefined,
        }),
      })
      const data = (await res.json()) as {
        response?: ArticleRewriteResponse
        provider?: string
        error?: string
      }
      if (!res.ok || !data.response) {
        toast.error('Rewriter', data.error ?? `HTTP ${res.status}`)
        return
      }
      setResult(data.response)
      setProvider(data.provider ?? null)
      const first = Object.keys(data.response.variants)[0] as PublishingPlatform | undefined
      if (first) setActiveTab(first)
      toast.success('Gotovo', `${data.provider} • ${Object.keys(data.response.variants).length} varijanti`)
    } catch (err) {
      toast.error('Rewriter', (err as Error).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="admin-card space-y-3 p-4">
        <header className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100">Preformuliraj članak za platforme</h3>
        </header>

        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <label className="block">
              <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                Izvorni naslov
              </span>
              <input
                type="text"
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                maxLength={240}
                placeholder="Kako radimo web stranice u Zagrebu"
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                Izvorni sadržaj (Markdown ili plain text)
              </span>
              <textarea
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                rows={12}
                maxLength={30_000}
                placeholder="Zalijepi članak koji želiš preformulirati…"
                className="admin-mono mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                {sourceContent.length.toLocaleString()} / 30 000 znakova
              </p>
            </label>
          </div>

          <aside className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Izvor
                </span>
                <select
                  value={sourceLocale}
                  onChange={(e) => setSourceLocale(e.target.value as typeof sourceLocale)}
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
                >
                  {SEO_LOCALES.map((l) => (
                    <option key={l} value={l}>
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Cilj
                </span>
                <select
                  value={targetLocale}
                  onChange={(e) => setTargetLocale(e.target.value as typeof targetLocale)}
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
                >
                  {SEO_LOCALES.map((l) => (
                    <option key={l} value={l}>
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Ton</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as typeof tone)}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
              >
                {CONTENT_TONES.map((t) => (
                  <option key={t} value={t}>
                    {TONE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                Canonical link (opcionalno)
              </span>
              <input
                type="url"
                value={keepLinkTo}
                onChange={(e) => setKeepLinkTo(e.target.value)}
                className="admin-mono mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-[11px] text-emerald-300 focus:border-indigo-500 focus:outline-none"
              />
            </label>

            <div>
              <span className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                Platforme ({platforms.length})
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PUBLISHING_PLATFORMS.map((p) => {
                  const active = platforms.includes(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`admin-mono rounded-full border px-2 py-1 text-[10px] transition-colors ${
                        active
                          ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                          : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {active ? <Check className="mr-1 inline h-3 w-3" /> : null}
                      {PLATFORM_LABELS[p]}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={pending || sourceTitle.trim().length < 3 || sourceContent.trim().length < 100}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Preformuliraj
            </button>
          </aside>
        </div>
      </section>

      {result ? (
        <RewriterResult result={result} provider={provider} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <div className="admin-card flex min-h-[200px] items-center justify-center p-6">
          <p className="admin-mono text-[11px] text-slate-500">
            {pending ? 'Preformuliram za sve platforme (može potrajati 20-40s)…' : 'Rezultat po platformi će se pojaviti ovdje.'}
          </p>
        </div>
      )}
    </div>
  )
}

function RewriterResult({
  result,
  provider,
  activeTab,
  setActiveTab,
}: {
  result: ArticleRewriteResponse
  provider: string | null
  activeTab: PublishingPlatform | null
  setActiveTab: (t: PublishingPlatform) => void
}) {
  const entries = Object.entries(result.variants) as Array<[PublishingPlatform, ArticleRewriteResponse['variants'][PublishingPlatform]]>
  const active = activeTab && result.variants[activeTab] ? activeTab : (entries[0]?.[0] ?? null)
  const variant = active ? result.variants[active] : null

  return (
    <div className="admin-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-800 bg-slate-950/60 px-2 py-1.5">
        {entries.map(([platform]) => {
          const isActive = active === platform
          return (
            <button
              key={platform}
              type="button"
              onClick={() => setActiveTab(platform)}
              className={`admin-mono rounded px-2 py-1 text-[10px] transition-colors ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-300'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {PLATFORM_LABELS[platform]}
            </button>
          )
        })}
        <span className="admin-mono ml-auto text-[10px] text-slate-500">{provider}</span>
      </div>

      {variant ? (
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Naslov</p>
              <h4 className="text-sm font-semibold text-slate-100">{variant.title}</h4>
              {variant.subtitle ? (
                <p className="mt-0.5 text-[11px] text-slate-400">{variant.subtitle}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => copy(variant.title, 'Naslov')}
              className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-slate-100"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>

          {variant.excerpt ? (
            <div className="rounded-md border border-slate-800 bg-slate-950/40 p-2">
              <div className="flex items-center justify-between">
                <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Excerpt</p>
                <button
                  type="button"
                  onClick={() => copy(variant.excerpt!, 'Excerpt')}
                  className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-slate-100"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-300">{variant.excerpt}</p>
            </div>
          ) : null}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                Tijelo članka ({variant.body.length.toLocaleString()} zn.)
              </p>
              <button
                type="button"
                onClick={() => copy(variant.body, 'Body')}
                className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-100"
              >
                <Copy className="h-3 w-3" />
                Kopiraj Markdown
              </button>
            </div>
            <pre className="admin-mono max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-slate-800 bg-slate-950/60 p-3 text-[11px] leading-relaxed text-slate-300">
{variant.body}
            </pre>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Tags ({variant.tags.length})
                </p>
                <button
                  type="button"
                  onClick={() => copy(variant.tags.join(', '), 'Tags')}
                  className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-slate-100"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {variant.tags.map((t) => (
                  <span
                    key={t}
                    className="admin-mono rounded border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] text-indigo-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {variant.publishingHints ? (
              <div>
                <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Kada / kako objaviti
                </p>
                <p className="mt-1 rounded-md border border-slate-800 bg-slate-950/40 p-2 text-[11px] text-slate-300">
                  {variant.publishingHints}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="admin-mono p-4 text-[11px] text-slate-500">Nema varijanti.</p>
      )}
    </div>
  )
}
