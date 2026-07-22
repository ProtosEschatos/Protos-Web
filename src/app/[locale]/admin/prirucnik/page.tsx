import { setRequestLocale } from 'next-intl/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Cloud,
  Database,
  FileCode2,
  KeyRound,
  Layers,
  Network,
  ScrollText,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminLink from '@/components/features/admin/AdminLink'
import { adminListApiKeys } from '@/actions/admin-api-keys'

type Props = { params: Promise<{ locale: string }> }

type ServiceCard = {
  name: string
  role: string
  /** Provider slug in the vault (if any) — used to show connection status. */
  provider?: string
  /** Fallback env var to check when no vault entry exists. */
  envVar?: string
  link: string
  notes?: string
}

const SERVICE_GROUPS: Array<{ label: string; icon: React.ComponentType<{ className?: string }>; items: ServiceCard[] }> = [
  {
    label: 'Infrastruktura',
    icon: Cloud,
    items: [
      {
        name: 'Vercel',
        role: 'Hosting Next.js aplikacije, edge middleware, env vars',
        provider: 'vercel',
        link: 'https://vercel.com/dashboard',
        notes: 'Sensitive flag na secrets = true → CLI ne može pullati vrijednost.',
      },
      {
        name: 'Cloudflare',
        role: 'DNS, CDN pred Vercelom, WAF, DDoS',
        provider: 'cloudflare',
        link: 'https://dash.cloudflare.com',
        notes: 'Bez www ↔ apex redirect-a u next.config (Vercel ga radi).',
      },
      {
        name: 'GitHub',
        role: 'Repo, Actions CI/CD, Dependabot',
        provider: 'github',
        link: 'https://github.com/ProtosEschatos/Protos-Web',
      },
    ],
  },
  {
    label: 'Baza & pohrana',
    icon: Database,
    items: [
      {
        name: 'Supabase Postgres',
        role: 'Sve tablice + Row Level Security + Edge Functions',
        envVar: 'NEXT_PUBLIC_SUPABASE_URL',
        link: 'https://supabase.com/dashboard',
      },
      {
        name: 'Supabase Storage',
        role: '3 bucketa: showcase, site-assets, admin-uploads',
        envVar: 'SUPABASE_SERVICE_ROLE_KEY',
        link: 'https://supabase.com/dashboard',
        notes: 'admin-uploads je privatan; javno se servira signed URL-om.',
      },
      {
        name: 'Supabase Edge Functions',
        role: 'donation-checkout, stripe-webhook',
        envVar: 'SUPABASE_ACCESS_TOKEN',
        link: 'https://supabase.com/dashboard/project/_/functions',
      },
    ],
  },
  {
    label: 'Plaćanje',
    icon: KeyRound,
    items: [
      {
        name: 'Stripe',
        role: 'Checkout Session za donacije, webhook → donations tablica',
        provider: 'stripe',
        link: 'https://dashboard.stripe.com',
        notes: 'payment_method_types se ne postavlja — automatski se biraju iz dashboarda (SEPA, Link, kartice).',
      },
    ],
  },
  {
    label: 'Komunikacija',
    icon: Network,
    items: [
      {
        name: 'Zoho Mail (IMAP)',
        role: 'protosweb.eu inbox',
        provider: 'zoho',
        link: 'https://mail.zoho.eu',
        notes: 'IMAP kredencijali idu u Vercel env (ne u vault).',
      },
      {
        name: 'Brevo',
        role: 'Newsletter subscribers + transactional',
        provider: 'brevo',
        link: 'https://app.brevo.com',
      },
      {
        name: 'Resend',
        role: 'Alt. transactional (rezerva)',
        provider: 'resend',
        link: 'https://resend.com',
      },
    ],
  },
  {
    label: 'AI cascade',
    icon: Sparkles,
    items: [
      {
        name: 'GPT-OSS-120B (Groq / OpenRouter)',
        role: 'Primarni AI za content studio, scene assistant',
        provider: 'gpt-oss',
        link: 'https://groq.com',
      },
      {
        name: 'DeepSeek',
        role: 'Fallback #1',
        provider: 'deepseek',
        link: 'https://platform.deepseek.com',
      },
      {
        name: 'Google Gemini',
        role: 'Fallback #2',
        provider: 'gemini',
        link: 'https://aistudio.google.com',
      },
    ],
  },
  {
    label: '3D asset pipeline',
    icon: Boxes,
    items: [
      {
        name: 'Sketchfab',
        role: 'Search + download GLB modela',
        provider: 'sketchfab',
        link: 'https://sketchfab.com',
      },
      {
        name: 'Poly.Pizza',
        role: 'Besplatna kolekcija low-poly modela',
        provider: 'polypizza',
        link: 'https://poly.pizza',
      },
      {
        name: 'Meshy',
        role: 'AI generirani 3D modeli (opcionalno)',
        provider: 'meshy',
        link: 'https://meshy.ai',
      },
    ],
  },
  {
    label: 'Social publishing (/admin/publish)',
    icon: Network,
    items: [
      { name: 'Bluesky', role: 'AT Proto — app password', provider: 'bluesky', link: 'https://bsky.app' },
      { name: 'Mastodon', role: 'Access token po instance-u', provider: 'mastodon', link: 'https://joinmastodon.org' },
      { name: 'Threads', role: 'Meta Graph API', provider: 'threads', link: 'https://developers.facebook.com' },
      { name: 'Facebook Page', role: 'Meta Graph — Page access token', provider: 'facebook', link: 'https://developers.facebook.com' },
      { name: 'Instagram', role: 'Meta Graph — IG Business', provider: 'instagram', link: 'https://developers.facebook.com' },
      { name: 'Ghost', role: 'Admin API — HS256 JWT (id:secret)', provider: 'ghost', link: 'https://ghost.org' },
      { name: 'Hashnode', role: 'GraphQL — Personal Access Token', provider: 'hashnode', link: 'https://hashnode.com' },
      { name: 'Dev.to', role: 'REST — api-key header', provider: 'devto', link: 'https://dev.to' },
    ],
  },
  {
    label: 'Analitika & SEO',
    icon: ShieldCheck,
    items: [
      {
        name: 'Google Analytics 4',
        role: 'Web analytics',
        envVar: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
        link: 'https://analytics.google.com',
      },
      {
        name: 'Plausible',
        role: 'Privacy-friendly analytics (opt.)',
        envVar: 'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
        link: 'https://plausible.io',
      },
      {
        name: 'Google Search Console',
        role: 'Indexing status + verifikacija',
        envVar: 'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION',
        link: 'https://search.google.com/search-console',
      },
    ],
  },
]

const RULES: Array<{ title: string; body: string; severity?: 'critical' | 'warn' }> = [
  {
    severity: 'critical',
    title: 'Nikad ne commitati secrets u repo.',
    body:
      'Runtime ključevi idu u /admin/kljucevi (AES-256-GCM vault) ili u Vercel env. .env.local je git-ignored — ne mijenjaj .gitignore.',
  },
  {
    severity: 'critical',
    title: 'ADMIN_KEYS_ENCRYPTION_KEY je master ključ vault-a.',
    body:
      'Ako se izgubi, sve enkriptirane vrijednosti u admin_api_keys i automation_webhooks postaju smeće. Backup ga zasebno (password manager) i pin-aj u Vercel Production + Preview + Development.',
  },
  {
    severity: 'critical',
    title: 'Uvijek requireAdmin() u novim server actions.',
    body:
      'Prvi red svake `use server` funkcije: `await requireAdmin()`. Bez toga ruta radi za anon usera i ključevi cure.',
  },
  {
    severity: 'critical',
    title: 'Zod na svakom entry pointu.',
    body:
      'Server actions i API route hendleri validiraju input Zod schemom prije bilo kakvog fetch/DB poziva. Nema `as any` cast-anja.',
  },
  {
    severity: 'critical',
    title: '`import "server-only"` na svakom fajlu koji dodiruje tokene.',
    body:
      'Ako ti build kaže „cannot be imported from a Client Component" — ne miči `server-only`, prebaci pure-data u paralelni fajl bez `server-only` (vidi `lib/publishers/meta-catalog.ts`).',
  },
  {
    severity: 'critical',
    title: 'Nikad JSON.stringify direktno u <script type="application/ld+json">.',
    body:
      'Uvijek preko `serializeJsonLd()` iz `@/lib/seo/json-ld`. Bez toga blog title s `</script>` = XSS.',
  },
  {
    severity: 'warn',
    title: 'Supabase migracije: prvo MCP apply_migration, pa isti timestamp u repo.',
    body:
      'MCP dodijeli timestamp (npr. 20260720171515). Fajl u supabase/migrations/ mora imati identičan timestamp jer inače CI Supabase DB Push pukne s "Remote migration versions not found in local".',
  },
  {
    severity: 'warn',
    title: 'AdminLink umjesto <a> za internal admin route.',
    body:
      'ESLint pravilo `no-html-link-for-pages` će te razapeti. AdminLink hendla locale prefix i prefetch.',
  },
  {
    severity: 'warn',
    title: 'Sve UI stringove kroz next-intl.',
    body:
      'Nema hardcodanih HR / EN stringova u komponentama. HR je baseline; ostale locale se popunjavaju backfillom (0 missing / 0 extra provjera u check-env).',
  },
  {
    severity: 'warn',
    title: 'CSP: nikad `unsafe-eval` u produkciji.',
    body:
      'U next.config.js `isDev ? "unsafe-eval" : null`. Ako neki library traži eval → biraj drugi library, ne ruši CSP.',
  },
  {
    severity: 'warn',
    title: 'Nakon izmjene → ReadLints → npm run build.',
    body:
      'Ne pushaj u main dok build lokalno ne prođe. Type-check i eslint su također strict (max-warnings 0).',
  },
  {
    severity: 'warn',
    title: 'Nakon svakog write-a: audit event.',
    body:
      'Nova server action → `recordAudit({ event, source, payload })` na kraju try bloka. Ono što nije zabilježeno, nije se dogodilo. Pregled: `/admin/audit`.',
  },
]

const FOLDER_TREE = `Protos-Web/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (public routes)/     # o-nama, blog, portfolio, kontakt, …
│   │   │   └── admin/
│   │   │       ├── ai/              # AI asistent (cascade chat)
│   │   │       ├── assets/          # Upload → admin_assets
│   │   │       ├── audit/           # audit_events pregled
│   │   │       ├── automations/     # Outbound webhooks
│   │   │       ├── blog/            # CRUD članaka
│   │   │       ├── donacije/        # Stripe donacije
│   │   │       ├── inbox/           # Zoho IMAP
│   │   │       ├── kljucevi/        # Enkriptirani API vault
│   │   │       ├── konfigurator/    # 3D scena + Sketchfab/Poly.Pizza
│   │   │       ├── memory/          # Protos-Agent read-only
│   │   │       ├── portfolio/       # CRUD projekata
│   │   │       ├── prirucnik/       # OVA stranica
│   │   │       ├── publish/         # 1-click social/blog publish
│   │   │       ├── seo/             # SEO, GA4, Content Studio
│   │   │       ├── stranice/        # O nama / Proces / Usluge
│   │   │       ├── subscribers/     # Newsletter
│   │   │       └── tools/           # Vercel/DNS
│   │   ├── api/
│   │   │   ├── admin/               # AI, login, session, notifications
│   │   │   ├── contact/
│   │   │   ├── cron/sync-inbox/
│   │   │   ├── donate/
│   │   │   ├── og/
│   │   │   └── subscribe/
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── actions/                     # 'use server' funkcije
│   ├── components/
│   │   ├── features/                # Domenski specifično (admin, home, …)
│   │   ├── layout/                  # Header, Footer, Shells
│   │   ├── seo/                     # JsonLd, LocaleCreatorSeo
│   │   ├── three/                   # R3F scene, backgrounds
│   │   └── ui/                      # Primitivi bez business logike
│   ├── lib/
│   │   ├── ai/                      # providers.ts (cascade), seo-content
│   │   ├── assets/                  # Public consumer za admin_assets
│   │   ├── audit/                   # recordAudit()
│   │   ├── auth/                    # HMAC session, requireAdmin
│   │   ├── config/                  # seo.ts, site.ts, api-key-providers
│   │   ├── publishers/              # bluesky/mastodon/…/meta-catalog
│   │   ├── queries/                 # DB SELECT helperi
│   │   ├── schemas/                 # Zod schemi
│   │   ├── security/                # AES-256-GCM crypto
│   │   ├── seo/                     # json-ld safe serializer
│   │   ├── showcase/                # 3D showcase pipeline
│   │   └── storage/                 # Supabase Storage helperi
│   ├── messages/                    # hr / en / de / it / es / sr
│   ├── i18n.ts, routing.ts, proxy.ts
│   └── styles/                      # globals.css, admin-console.css
├── supabase/
│   ├── migrations/                  # SQL — svaka s remote timestampom
│   └── functions/                   # donation-checkout, stripe-webhook
├── scripts/                         # Node CLI (uploads, translation, …)
├── docs/                            # security.md, admin-console.md, …
├── public/                          # images/, llms.txt, favicons
├── .github/workflows/               # CI, Security, Supabase, DNS check
├── next.config.js                   # CSP + redirects
├── package.json                     # overrides na postcss
└── tsconfig.json
`

export default async function AdminHandbookPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [pkg, keysResult] = await Promise.all([
    readPackageJson(),
    adminListApiKeys(),
  ])
  const installedProviders = new Set<string>()
  if (keysResult.success) {
    for (const key of keysResult.data) {
      if (key.isActive) installedProviders.add(key.provider)
    }
  }

  const stack = buildStackRows(pkg)

  return (
    <AdminPageShell
      title="Priručnik"
      description="Stack, servisi, folder struktura i pravila. Jedno mjesto istine za sve što ne smije puknuti."
    >
      <TocNav />

      <Section id="stack" icon={Layers} title="1. Stack — što gradimo s čime">
        <p className="admin-mono max-w-3xl text-xs text-slate-400">
          Verzije se čitaju iz{' '}
          <code className="rounded bg-slate-900/70 px-1.5 py-0.5">package.json</code> pri
          renderu — kad bumpaš deps, ova tablica je uvijek točna.
        </p>
        <div className="admin-card mt-4 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Sloj</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">Verzija</th>
                <th className="px-4 py-3">Uloga</th>
              </tr>
            </thead>
            <tbody>
              {stack.map((row) => (
                <tr key={row.name} className="border-t border-slate-800/60">
                  <td className="px-4 py-3 text-xs text-slate-500">{row.layer}</td>
                  <td className="admin-mono px-4 py-3 text-xs text-indigo-300">{row.name}</td>
                  <td className="admin-mono px-4 py-3 text-xs text-slate-300">{row.version}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="servisi" icon={Cloud} title="2. Vanjski servisi">
        <p className="admin-mono max-w-3xl text-xs text-slate-400">
          Zelena kvačica = ključ postoji i aktivan je u{' '}
          <AdminLink href="/admin/kljucevi" className="underline">
            /admin/kljucevi
          </AdminLink>{' '}
          vaultu. Bez toga admin akcije za taj servis neće raditi.
        </p>
        <div className="mt-4 space-y-4">
          {SERVICE_GROUPS.map((group) => (
            <ServiceGroup key={group.label} group={group} installed={installedProviders} />
          ))}
        </div>
      </Section>

      <Section id="folderi" icon={FileCode2} title="3. Folder struktura">
        <p className="admin-mono max-w-3xl text-xs text-slate-400">
          Bilo koji novi folder mora poštovati postojeći grupiranje. Ako imaš dilemu — pogledaj
          susjed. Nema privatnih rutepatterna (npr. „my-stuff/”) ni kratica.
        </p>
        <pre className="admin-mono admin-card mt-4 overflow-x-auto p-5 text-[11px] leading-relaxed text-slate-300">
{FOLDER_TREE}
        </pre>
      </Section>

      <Section id="pravila" icon={ScrollText} title="4. Pravila (non-negotiable)">
        <p className="admin-mono max-w-3xl text-xs text-slate-400">
          Ovih 12 pravila štite nas od svake greške koju smo već napravili. Svaki novi kod prolazi
          kroz njih. Kritična su crvena, hard-warn su žuta.
        </p>
        <div className="mt-4 space-y-3">
          {RULES.map((rule, idx) => (
            <RuleCard key={idx} index={idx + 1} rule={rule} />
          ))}
        </div>
      </Section>

      <Section id="komande" icon={FileCode2} title="5. Komande koje trebaš znati napamet">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CommandCard label="Type-check" cmd="npm run type-check" />
          <CommandCard label="Lint (0 warnings)" cmd="npm run lint" />
          <CommandCard label="Prod build lokalno" cmd="npm run build" />
          <CommandCard label="Env sanity" cmd="npm run check-env" />
          <CommandCard label="Generiraj master ključ" cmd={`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`} />
          <CommandCard label="Vercel env pull" cmd="vercel env pull .env.local" />
          <CommandCard label="Push showcase assets" cmd="npm run sync:showcase-assets" />
          <CommandCard label="Upload visual references" cmd="npm run upload:visual-references" />
        </div>
      </Section>

      <Section id="repos" icon={ShieldCheck} title="6. Repozitoriji koji drže sustav">
        <div className="admin-card space-y-3 p-5 text-sm text-slate-300">
          <RepoLine
            name="Protos-Web"
            url="https://github.com/ProtosEschatos/Protos-Web"
            role="Ovaj Next.js site (protosweb.eu) + admin panel"
          />
          <RepoLine
            name="Protos-Agent"
            url="https://github.com/ProtosEschatos/Protos-Agent"
            role="Memorija AI agenta — session logs, learnings, project docs, YAML front-matter validator"
          />
        </div>
      </Section>
    </AdminPageShell>
  )
}

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24 space-y-3">
      <h2 className="inline-flex items-center gap-2 text-base font-bold tracking-tight text-slate-100">
        <Icon className="h-4 w-4 text-indigo-400" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function TocNav() {
  const entries: Array<{ href: string; label: string }> = [
    { href: '#stack', label: 'Stack' },
    { href: '#servisi', label: 'Servisi' },
    { href: '#folderi', label: 'Folder struktura' },
    { href: '#pravila', label: 'Pravila' },
    { href: '#komande', label: 'Komande' },
    { href: '#repos', label: 'Repos' },
  ]
  return (
    <nav className="admin-card sticky top-2 z-10 flex flex-wrap gap-2 p-2 text-xs">
      {entries.map((e) => (
        <a
          key={e.href}
          href={e.href}
          className="admin-btn admin-btn-ghost text-[11px]"
        >
          {e.label}
        </a>
      ))}
    </nav>
  )
}

function ServiceGroup({
  group,
  installed,
}: {
  group: (typeof SERVICE_GROUPS)[number]
  installed: Set<string>
}) {
  const Icon = group.icon
  return (
    <div className="admin-card p-5">
      <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
        <Icon className="h-4 w-4 text-slate-500" />
        {group.label}
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {group.items.map((svc) => {
          const connected = svc.provider ? installed.has(svc.provider) : undefined
          return (
            <div
              key={svc.name}
              className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <a
                  href={svc.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-100 hover:text-indigo-300"
                >
                  {svc.name}
                </a>
                {connected === true && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> spojeno
                  </span>
                )}
                {connected === false && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                    <XCircle className="h-3 w-3" /> fali ključ
                  </span>
                )}
                {svc.envVar && connected === undefined && (
                  <span className="admin-mono rounded-full bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400">
                    env: {svc.envVar}
                  </span>
                )}
              </div>
              <p className="mt-1 text-slate-400">{svc.role}</p>
              {svc.notes && (
                <p className="admin-mono mt-1 text-[10px] text-slate-500">{svc.notes}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RuleCard({
  index,
  rule,
}: {
  index: number
  rule: (typeof RULES)[number]
}) {
  const critical = rule.severity === 'critical'
  return (
    <div
      className={`rounded-xl border p-4 ${
        critical
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-amber-500/25 bg-amber-500/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 rounded-md p-1.5 ${
            critical ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100">
            <span className="admin-mono mr-2 text-xs text-slate-500">#{index}</span>
            {rule.title}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{rule.body}</p>
        </div>
      </div>
    </div>
  )
}

function CommandCard({ label, cmd }: { label: string; cmd: string }) {
  return (
    <div className="admin-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <pre className="admin-mono mt-1 overflow-x-auto rounded-md border border-slate-800/60 bg-slate-950/70 p-2 text-[11px] text-emerald-300">
        {cmd}
      </pre>
    </div>
  )
}

function RepoLine({ name, url, role }: { name: string; url: string; role: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800/50 pb-2 last:border-b-0 last:pb-0">
      <div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="admin-mono text-sm font-semibold text-indigo-300 hover:underline"
        >
          {name}
        </a>
        <p className="mt-1 text-xs text-slate-400">{role}</p>
      </div>
      <span className="admin-mono text-[10px] text-slate-500">{url.replace(/^https?:\/\//, '')}</span>
    </div>
  )
}

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  engines?: Record<string, string>
}

async function readPackageJson(): Promise<PackageJson> {
  try {
    const raw = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    return JSON.parse(raw) as PackageJson
  } catch {
    return {}
  }
}

function buildStackRows(pkg: PackageJson): Array<{
  layer: string
  name: string
  version: string
  role: string
}> {
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
  const node = pkg.engines?.node ?? '22.x'

  return [
    { layer: 'Runtime', name: 'node', version: node, role: 'Serverless (Vercel) i lokalni dev' },
    { layer: 'Framework', name: 'next', version: deps.next ?? '—', role: 'App Router, RSC, Server Actions' },
    { layer: 'UI', name: 'react', version: deps.react ?? '—', role: 'UI runtime' },
    { layer: 'Typing', name: 'typescript', version: deps.typescript ?? '—', role: 'Strict mode' },
    { layer: 'Styling', name: 'tailwindcss', version: deps.tailwindcss ?? '—', role: 'Utility CSS' },
    { layer: 'Styling', name: 'postcss', version: deps.postcss ?? '—', role: 'CSS pipeline (override na 8.5.10)' },
    { layer: 'i18n', name: 'next-intl', version: deps['next-intl'] ?? '—', role: 'HR / EN / DE / IT / ES / SR' },
    { layer: 'Validation', name: 'zod', version: deps.zod ?? '—', role: 'Sve akcije + API rute' },
    { layer: 'State', name: 'zustand', version: deps.zustand ?? '—', role: 'Toaster + scene store' },
    { layer: 'Motion', name: 'framer-motion', version: deps['framer-motion'] ?? '—', role: 'Prijelazi + hero animacije' },
    { layer: '3D', name: '@react-three/fiber', version: deps['@react-three/fiber'] ?? '—', role: 'R3F canvas + hooks' },
    { layer: '3D', name: '@react-three/drei', version: deps['@react-three/drei'] ?? '—', role: 'Helperi (Environment, OrbitControls, useGLTF)' },
    { layer: '3D', name: 'three', version: deps.three ?? '—', role: 'WebGL' },
    { layer: 'Data', name: '@supabase/supabase-js', version: deps['@supabase/supabase-js'] ?? '—', role: 'Postgres, Storage, Edge Functions' },
    { layer: 'Icons', name: 'lucide-react', version: deps['lucide-react'] ?? '—', role: 'SVG ikone' },
    { layer: 'Mail', name: 'imapflow', version: deps.imapflow ?? '—', role: 'Zoho IMAP fetch (admin inbox)' },
    { layer: 'Perf', name: '@vercel/speed-insights', version: deps['@vercel/speed-insights'] ?? '—', role: 'Core Web Vitals' },
  ]
}
