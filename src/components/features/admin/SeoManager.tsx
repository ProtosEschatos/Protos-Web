'use client'

import { useState } from 'react'
import {
  BarChart3,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react'
import type {
  LiveSitemapStats,
  SeoEnvStatus,
  SeoOverview,
  SocialPublishingConnection,
} from '@/lib/queries/admin/seo-overview'
import { toast } from '@/lib/stores/toast-store'
import SeoContentStudio from '@/components/features/admin/SeoContentStudio'
import AdminLink from '@/components/features/admin/AdminLink'

type Tab = 'pregled' | 'analitika' | 'metadata' | 'sitemap' | 'verifikacija' | 'ai-content'

const TABS: { id: Tab; label: string; Icon: typeof BarChart3 }[] = [
  { id: 'pregled', label: 'Pregled', Icon: Gauge },
  { id: 'analitika', label: 'Analitika', Icon: BarChart3 },
  { id: 'metadata', label: 'Metadata & tagovi', Icon: Tag },
  { id: 'sitemap', label: 'Sitemap & robots', Icon: FileText },
  { id: 'verifikacija', label: 'Verifikacija', Icon: ShieldCheck },
  { id: 'ai-content', label: 'AI content studio', Icon: Sparkles },
]

type Props = {
  overview: SeoOverview
  liveSitemap: LiveSitemapStats
  robotsSnippet: string
}

export default function SeoManager({ overview, liveSitemap, robotsSnippet }: Props) {
  const [tab, setTab] = useState<Tab>('pregled')

  const total = [
    ...overview.env.analytics,
    ...overview.env.verification,
    ...overview.env.monitoring,
  ]
  const configured = total.filter((e) => e.configured).length

  return (
    <div className="space-y-6">
      <div className="admin-card overflow-x-auto">
        <div className="flex min-w-max border-b border-slate-800">
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-xs transition-colors ${
                  active
                    ? 'border-b-2 border-indigo-500 bg-slate-950 text-indigo-300'
                    : 'border-b-2 border-transparent text-slate-500 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {tab === 'pregled' ? (
        <OverviewTab overview={overview} configured={configured} total={total.length} liveSitemap={liveSitemap} />
      ) : null}
      {tab === 'analitika' ? <AnalyticsTab overview={overview} /> : null}
      {tab === 'metadata' ? <MetadataTab overview={overview} /> : null}
      {tab === 'sitemap' ? <SitemapTab overview={overview} live={liveSitemap} robotsSnippet={robotsSnippet} /> : null}
      {tab === 'verifikacija' ? <VerificationTab overview={overview} /> : null}
      {tab === 'ai-content' ? <SeoContentStudio /> : null}
    </div>
  )
}

function ConnectionCard({ conn }: { conn: SocialPublishingConnection }) {
  const hasAny = conn.vaultActive > 0 || conn.envConfigured
  return (
    <div className="admin-card flex items-start justify-between gap-3 p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-slate-100">{conn.label}</p>
          <StatusPill configured={hasAny} />
        </div>
        {conn.envHint ? (
          <p className="admin-mono mt-1 truncate text-[10px] text-slate-500" title={conn.envHint}>
            {conn.envHint}
          </p>
        ) : null}
        <p className="admin-mono mt-1 text-[10px] text-slate-500">
          Vault: {conn.vaultActive}/{conn.vaultCount} aktivnih
          {conn.envConfigured ? ' · env postavljen' : ''}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <AdminLink
          href={`/admin/kljucevi?provider=${conn.provider}`}
          className="admin-mono rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300"
        >
          {hasAny ? 'Uredi' : 'Dodaj'}
        </AdminLink>
        <a
          href={conn.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-300"
          title="Docs / dashboard"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

function StatusPill({ configured }: { configured: boolean }) {
  return configured ? (
    <span className="admin-mono inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
      <Check className="h-3 w-3" /> ok
    </span>
  ) : (
    <span className="admin-mono inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
      <X className="h-3 w-3" /> nedostaje
    </span>
  )
}

function copyToClipboard(text: string, label: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success('Kopirano', label))
    .catch(() => toast.error('Kopiranje', 'Nije uspjelo'))
}

function EnvRow({ env }: { env: SeoEnvStatus }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-slate-800 bg-slate-950/40 p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <StatusPill configured={env.configured} />
          <p className="text-xs font-medium text-slate-100">{env.label}</p>
          {env.fromEnv ? (
            <span className="admin-mono text-[10px] text-slate-500">via env</span>
          ) : env.configured ? (
            <span className="admin-mono text-[10px] text-slate-500">default</span>
          ) : null}
        </div>
        <p className="admin-mono mt-1 truncate text-[10px] text-slate-500" title={env.key}>
          {env.key}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">{env.hint}</p>
        {env.value ? (
          <p className="admin-mono mt-2 truncate text-[11px] text-emerald-300" title={env.value}>
            {env.value}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {env.value ? (
          <button
            type="button"
            onClick={() => copyToClipboard(env.value!, env.label)}
            className="rounded-md border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:border-slate-600 hover:text-slate-200"
            title="Kopiraj vrijednost"
          >
            <Copy className="h-3 w-3" />
          </button>
        ) : null}
        {env.docsUrl ? (
          <a
            href={env.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:border-slate-600 hover:text-indigo-300"
            title="Dokumentacija / dashboard"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>
    </div>
  )
}

function OverviewTab({
  overview,
  configured,
  total,
  liveSitemap,
}: {
  overview: SeoOverview
  configured: number
  total: number
  liveSitemap: LiveSitemapStats
}) {
  const stats = [
    { label: 'Konfigurirano', value: `${configured}/${total}`, tone: configured === total ? 'ok' : 'warn' },
    { label: 'Lokali', value: overview.locales.length, tone: 'default' },
    { label: 'URL-ova u sitemapu', value: liveSitemap.ok ? liveSitemap.urlCount : '—', tone: liveSitemap.ok ? 'ok' : 'warn' },
    { label: 'Ključnih stranica', value: overview.keyPages.length, tone: 'default' },
  ] as const

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="admin-card px-4 py-3">
            <p
              className={`admin-mono text-2xl font-bold ${
                s.tone === 'ok' ? 'text-emerald-400' : s.tone === 'warn' ? 'text-amber-400' : 'text-slate-100'
              }`}
            >
              {s.value}
            </p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="admin-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
          Analitika
        </h2>
        <div className="grid gap-2 lg:grid-cols-2">
          {overview.env.analytics.map((env) => (
            <EnvRow key={env.key} env={env} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="admin-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
          Verifikacija
        </h2>
        <div className="grid gap-2 lg:grid-cols-2">
          {overview.env.verification.map((env) => (
            <EnvRow key={env.key} env={env} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="admin-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
          Praćenje & DNS
        </h2>
        <div className="grid gap-2 lg:grid-cols-3">
          {overview.env.monitoring.map((env) => (
            <EnvRow key={env.key} env={env} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="admin-mono flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            Društvene mreže
          </h2>
          <AdminLink
            href="/admin/kljucevi"
            className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
          >
            <KeyRound className="h-3 w-3" />
            Otvori vault
          </AdminLink>
        </div>
        <p className="text-[11px] text-slate-500">
          Poveži YouTube, Instagram, Facebook, TikTok i sl. Ključevi žive u{' '}
          <span className="text-emerald-400">API ključevi</span> (AES-256-GCM) — koriste ih AI content studio i
          budući cross-posteri.
        </p>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {overview.connections.social.map((conn) => (
            <ConnectionCard key={conn.provider} conn={conn} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="admin-mono flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Newspaper className="h-3.5 w-3.5 text-indigo-400" />
          Publikacijske platforme
        </h2>
        <p className="text-[11px] text-slate-500">
          Medium, Substack, Blogger, Tumblr, About.me, Payhip — pripremljeni provideri za article rewriter u{' '}
          <span className="text-indigo-300">AI content studio</span> tabu.
        </p>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {overview.connections.publishing.map((conn) => (
            <ConnectionCard key={conn.provider} conn={conn} />
          ))}
        </div>
      </section>
    </div>
  )
}

function AnalyticsTab({ overview }: { overview: SeoOverview }) {
  return (
    <div className="space-y-4">
      <p className="admin-mono text-[11px] text-slate-500">
        Otvori dashboard-e u novom tabu. Sve otvara u novoj kartici, bez prekidanja rada u adminu.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {overview.dashboards.map((d) => (
          <a
            key={d.id}
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-card group flex items-start justify-between gap-3 p-4 transition-colors hover:border-indigo-500/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-100">{d.label}</p>
                {d.configured ? null : (
                  <span className="admin-mono rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                    ključ fali
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400">{d.description}</p>
              <p className="admin-mono mt-1.5 truncate text-[10px] text-slate-600" title={d.href}>
                {d.href}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-indigo-300" />
          </a>
        ))}
      </div>
    </div>
  )
}

function MetadataTab({ overview }: { overview: SeoOverview }) {
  const { metaPreview, ogImageUrl, keyPages, siteUrl } = overview
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="admin-card overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-950/60 px-4 py-2">
            <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
              Google SERP preview (naslovnica hr)
            </p>
          </div>
          <div className="space-y-1 px-4 py-3">
            <p className="admin-mono text-[10px] text-emerald-400">{siteUrl}</p>
            <p className="text-base text-indigo-300">{metaPreview.title}</p>
            <p className="text-xs text-slate-400">{metaPreview.description}</p>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-950/60 px-4 py-2">
            <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
              OpenGraph / Twitter card
            </p>
          </div>
          <div className="space-y-3 px-4 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ogImageUrl}
              alt="OG preview"
              className="w-full rounded-md border border-slate-800"
              width={metaPreview.ogWidth}
              height={metaPreview.ogHeight}
            />
            <div className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 admin-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-3 w-3 text-indigo-400" />
                {metaPreview.ogWidth}×{metaPreview.ogHeight} · image/png
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(ogImageUrl, 'OG image URL')}
                className="rounded border border-slate-700 bg-slate-900 p-1 hover:border-slate-600 hover:text-slate-200"
                title="Kopiraj OG URL"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="admin-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Layers className="h-4 w-4 text-indigo-400" />
          Ključne stranice
        </h3>
        <p className="text-[11px] text-slate-500">
          Svaka renderira vlastite hreflang, canonical, OG i JSON-LD (Organization, Person, WebSite, ContactPoint...).
        </p>
        <ul className="mt-3 space-y-1.5">
          {keyPages.map((p) => (
            <li key={p.path} className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-100">{p.label}</p>
                <a
                  href={`${siteUrl}${p.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-300"
                  title="Otvori"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="admin-mono mt-0.5 text-[10px] text-slate-500">{p.path}</p>
              <p className="mt-1 text-[10px] text-slate-500">{p.description}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

function SitemapTab({
  overview,
  live,
  robotsSnippet,
}: {
  overview: SeoOverview
  live: LiveSitemapStats
  robotsSnippet: string
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="admin-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Search className="h-4 w-4 text-indigo-400" />
            Sitemap
          </h3>
          <StatusPill configured={live.ok} />
        </div>
        <p className="admin-mono truncate text-[11px] text-emerald-300" title={overview.sitemapUrl}>
          {overview.sitemapUrl}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-slate-800 bg-slate-950/40 p-2">
            <p className="admin-mono text-2xl font-bold text-slate-100">{live.ok ? live.urlCount : '—'}</p>
            <p className="text-[10px] text-slate-500">URL-ova (live)</p>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/40 p-2">
            <p className="admin-mono text-2xl font-bold text-slate-100">{overview.locales.length}</p>
            <p className="text-[10px] text-slate-500">Jezika</p>
          </div>
        </div>
        {live.error ? (
          <p className="admin-mono mt-3 text-[10px] text-rose-400">{live.error}</p>
        ) : null}
        <div className="mt-3 flex gap-2">
          <a
            href={overview.sitemapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-600 hover:text-slate-100"
          >
            <ExternalLink className="h-3 w-3" />
            Otvori XML
          </a>
          <a
            href={`https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aprotosweb.eu`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/20"
          >
            <ExternalLink className="h-3 w-3" />
            Prijavi u GSC
          </a>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <FileText className="h-4 w-4 text-indigo-400" />
            robots.txt
          </h3>
          <button
            type="button"
            onClick={() => copyToClipboard(robotsSnippet, 'robots.txt')}
            className="rounded border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:border-slate-600 hover:text-slate-200"
            title="Kopiraj"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
        <p className="admin-mono truncate text-[11px] text-emerald-300">{overview.robotsUrl}</p>
        <pre className="admin-mono mt-3 max-h-60 overflow-auto rounded-md border border-slate-800 bg-slate-950/70 p-3 text-[10px] text-slate-400">
{robotsSnippet}
        </pre>
        <a
          href={overview.robotsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-600 hover:text-slate-100"
        >
          <ExternalLink className="h-3 w-3" />
          Otvori live
        </a>
      </div>
    </div>
  )
}

function VerificationTab({ overview }: { overview: SeoOverview }) {
  return (
    <div className="space-y-4">
      <div className="admin-card p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Globe2 className="h-4 w-4 text-indigo-400" />
          Kako je site verificiran
        </h3>
        <ul className="mt-3 space-y-2 text-xs text-slate-400">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>
              <strong className="text-slate-100">HTML meta:</strong> renderira se u{' '}
              <code className="admin-mono text-emerald-300">&lt;head&gt;</code> na svakoj stranici
              (Next Metadata API).
            </span>
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>
              <strong className="text-slate-100">DNS TXT:</strong> paralelno postavljen na
              Cloudflare (`_google-site-verification`) — potrebno za{' '}
              <em>domain property</em> ownership.
            </span>
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>
              <strong className="text-slate-100">Sitemap:</strong> automatski submitan preko{' '}
              <code className="admin-mono text-emerald-300">robots.txt</code>{' '}
              (`Sitemap: {overview.sitemapUrl}`).
            </span>
          </li>
        </ul>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-950/60 px-4 py-2">
          <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">
            Google-site-verification kod
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <code className="admin-mono truncate text-xs text-emerald-300">
            {overview.env.verification[0]?.value ?? '—'}
          </code>
          {overview.env.verification[0]?.value ? (
            <button
              type="button"
              onClick={() => copyToClipboard(overview.env.verification[0]!.value!, 'Verification code')}
              className="rounded-md border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              title="Kopiraj"
            >
              <Copy className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="admin-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-100">Preporučene provjere</h3>
        <ul className="space-y-2 text-xs">
          {[
            {
              href: `https://search.google.com/test/rich-results?url=${encodeURIComponent(overview.siteUrl)}`,
              label: 'Rich Results Test (naslovnica)',
            },
            {
              href: `https://cards-dev.twitter.com/validator?url=${encodeURIComponent(overview.siteUrl)}`,
              label: 'X (Twitter) Card Validator',
            },
            {
              href: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(overview.siteUrl)}`,
              label: 'Facebook Sharing Debugger',
            },
            {
              href: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(overview.siteUrl)}`,
              label: 'LinkedIn Post Inspector',
            },
          ].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300"
              >
                <ExternalLink className="h-3 w-3" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
