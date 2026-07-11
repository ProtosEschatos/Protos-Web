# Protos Web — Next.js 14 Agency Website

## Project Overview
- **Name**: Protos Web
- **Goal**: Complete agency website migrated from vanilla HTML/CSS/JS to Next.js 14 App Router
- **Stack**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, Lenis, next-intl
- **Languages**: Croatian (hr, default), English (en), German (de), Italian (it), Spanish (es)

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type-check (runs in CI)
npm run type-check

# Lint
npm run lint

# Showcase asset scripts (manual or via GitHub workflow)
npm run upload:showcase-assets
npm run cleanup:showcase-assets
```

## Project Structure

```
src/
├── actions/                 # Server actions (blog, contact, portfolio, admin-*)
├── app/
│   ├── [locale]/            # Locale-based routing (hr/en/de/it/es)
│   │   ├── layout.tsx       # Root layout (fonts, PageLoader, Header, Footer, CookieBanner)
│   │   ├── page.tsx         # Home page (Hero, Process, Portfolio, Services, Blog, Contact)
│   │   ├── o-meni/page.tsx  # About page (dual stacks, team cards, online presence)
│   │   ├── proces/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── portfolio-showcase/page.tsx  # R3F 3D space gallery
│   │   ├── usluge/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── kontakt/page.tsx
│   │   └── admin/           # Private admin panel (blog, portfolio, inbox, subscribers)
│   └── api/
│       ├── admin/           # login, logout, session
│       ├── blog/route.ts
│       ├── contact/route.ts
│       ├── subscribe/route.ts
│       └── og/              # Dynamic OG images
├── components/
│   ├── admin/               # Admin shell, forms, nav
│   ├── layout/              # Header, Footer, MobileMenu, AppChrome
│   ├── legal/               # TOS, consent modals
│   ├── navigation/          # Page transitions
│   ├── providers/           # Lenis, Analytics
│   ├── sections/
│   │   ├── Hero.tsx, Services.tsx, Process.tsx, Portfolio.tsx, Blog.tsx, Contact.tsx
│   │   ├── DualStacksSection.tsx   # Protos vs Bodulica stacks
│   │   └── OnlinePresence.tsx
│   ├── seo/                 # JsonLd, breadcrumbs
│   ├── three/
│   │   ├── backgrounds/     # Per-route R3F backgrounds
│   │   └── showcase/        # SpaceGallery 3D room
│   └── ui/
│       ├── PageLoader.tsx   # Boot gate wrapper + consent modal
│       ├── BootScreen.tsx   # Cinematic 5s orbit → nebula animation
│       ├── ProtosLoader.tsx # LDRS brand loaders (forms, showcase)
│       ├── ShimmerText.tsx  # Animated gradient text
│       ├── GlowCard.tsx     # Hover glow + border beam cards
│       ├── MagneticButton.tsx # CTA mouse-follow wrapper
│       ├── SiteBackground.tsx
│       ├── CustomCursor.tsx
│       └── CookieBanner.tsx
├── lib/
│   ├── tech-stacks.ts       # Single source of truth for public stack badges
│   ├── site.ts              # SITE_URL, social URL constants
│   ├── team-profiles.ts     # Team + online presence tiles
│   ├── boot-gate.ts         # BOOT_MIN_MS = 5000
│   ├── admin/               # Admin queries, auth helpers
│   ├── section-icons.tsx
│   ├── social-links.ts
│   └── supabase.ts
├── messages/
│   ├── hr.json, en.json, de.json, it.json, es.json
│   └── _legal/              # Legal copy split from main i18n
├── styles/globals.css
├── i18n.ts
├── routing.ts               # next-intl routing (separate from middleware)
└── middleware.ts
scripts/
├── upload-showcase-assets.ts
└── cleanup-showcase-assets.ts
```

## Config Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js 14 config with next-intl plugin, security headers, Three.js transpile |
| `tailwind.config.ts` | Tailwind with Protos theme colors, custom animations |
| `tsconfig.json` | TypeScript strict mode, `@/*` path alias, `allowJs: false` |
| `postcss.config.ts` | Tailwind + Autoprefixer |
| `.cursorrules` | Cursor AI coding standards |
| `package.json` | All dependencies |

**Note:** `next.config.mjs` is the only root JavaScript file. Next.js 14 does not support `next.config.ts`. All application code under `src/` is TypeScript.

## Theme Colors

| Variable | Color | Usage |
|----------|-------|-------|
| `--primary` | `#ff6600` | Orange — CTAs, highlights |
| `--secondary` | `#8b5cf6` | Purple — accents |
| `--accent` | `#06b6d4` | Cyan — tertiary |
| `--dark` | `#0a0a1a` | Background |
| `--dark-card` | `#0f0f2a` | Card backgrounds |
| `--light` | `#e8e8f0` | Text |
| `--light-muted` | `#8888aa` | Muted text |

## Features

### Completed
- [x] Header with desktop nav, language selector (5 langs), theme cycler, CTA, hamburger
- [x] MobileMenu with Framer Motion slide-in animation
- [x] Footer with brand, links, legal, social, Balkans causes
- [x] PageLoader with cinematic 5s boot animation (orbit → impact → nebula) and consent modal
- [x] CustomCursor with dot + follower
- [x] Lucide React icons
- [x] CookieBanner with localStorage persistence
- [x] Hero section with per-route R3F background via SiteBackground
- [x] Services section (6 cards)
- [x] Process section (4 steps + 3 feature cards)
- [x] Process page with ProcessBackground via SiteBackground
- [x] Portfolio section with showcase banner → /portfolio-showcase
- [x] Portfolio Showcase — full R3F 3D space gallery (WASD movement, E interact, ESC menu)
- [x] Blog section (preview) + full blog page from Supabase
- [x] Blog post detail pages (`/blog/[slug]`) with markdown content
- [x] Contact section with form
- [x] About page with dual-stack section, team cards, online presence, Support Balkans; nav **O NAMA**
- [x] Services page
- [x] Contact page
- [x] Admin panel (`/admin/login`, blog/portfolio CRUD, inbox, subscribers) — requires `ADMIN_SECRET`
- [x] API routes: POST /api/contact, GET /api/blog, POST /api/subscribe, /api/admin/*
- [x] i18n with next-intl (5 languages)
- [x] hreflang alternates + dynamic sitemap with blog posts
- [x] Dynamic OG images, GA4 consent-gated analytics, Vercel Speed Insights
- [x] All config files (tailwind, next, tsconfig, postcss, middleware, i18n)
- [x] .cursorrules for Cursor AI
- [x] UI motion layer: LDRS loaders, ShimmerText, GlowCard, MagneticButton (see [`docs/ui-motion-toolkit.md`](docs/ui-motion-toolkit.md))
- [x] 3D agent toolkit: [`docs/3d-toolkit.md`](docs/3d-toolkit.md) + [`.cursor/rules/r3f-drei-recipes.mdc`](.cursor/rules/r3f-drei-recipes.mdc)

### UI Motion & 3D docs

| Doc | Purpose |
|-----|---------|
| [`docs/ui-motion-toolkit.md`](docs/ui-motion-toolkit.md) | When to use LDRS vs Framer vs R3F; approved UI primitives |
| [`docs/3d-toolkit.md`](docs/3d-toolkit.md) | R3F + drei cheat sheet, perf budget, layer rules |
| [`.cursor/rules/r3f-drei-recipes.mdc`](.cursor/rules/r3f-drei-recipes.mdc) | Copy-paste 3D recipes for agents |

**Key deps:** `ldrs` (inline loaders), `framer-motion` (DOM motion), `@react-three/fiber` + `@react-three/drei` (3D). Boot screen stays custom — not LDRS.

### Backend
- [x] Supabase client connection
- [x] Blog data from Supabase (`blog_posts` table, 80 posts)
- [x] Contact form submission to Supabase (`submit_contact` RPC) + `submit-form` edge fn emails via DB webhook
- [x] Newsletter signup via `/api/subscribe` → `subscribe` edge fn
- [x] Portfolio data from Supabase
- [x] Supabase edge functions in repo: `keep-alive`, `submit-form`, `subscribe`, `content`
- [x] GitHub workflows: CI, keep-alive cron, edge function deploy, security audit, Dependabot, showcase asset upload

### Future Enhancements
- [ ] Design refinements (user will provide updates)
- [x] SEO metadata per page
- [x] OpenGraph images
- [x] Sitemap generation
- [x] Analytics integration
- [x] Performance optimization (lighthouse audit)

## Important Notes

1. **Supabase is live** — blog, contact form, and portfolio use remote DB (`laqnnzavwbojntfiqmxj`).
2. **Route segments are in Croatian**: `/proces`, `/o-meni`, `/usluge`, `/kontakt`
3. **3D components use React Three Fiber** — NOT vanilla Three.js
4. **Dark theme only** — no light mode
5. **All Three.js components are dynamically imported** with `ssr: false`
6. **Public stack badges** come from [`src/lib/tech-stacks.ts`](src/lib/tech-stacks.ts) — do not duplicate tech lists in i18n prose or components. i18n provides descriptive copy only; UI reads badges from `tech-stacks.ts`.
7. **100% TypeScript in `src/`** — `tsconfig.json` has `allowJs: false`
8. **Performance** — R3F canvases use `next/dynamic` with `ssr: false`; production responses use `compress: true` in `next.config.mjs`; Inter loads with `display: swap`. Run Lighthouse against a production build (`npm run build && npm start`) for audit scores.

## Environment Variables — Where Things Live

Secrets are **not** duplicated everywhere on purpose. Each platform reads only what it needs:

| Location | Purpose | What goes here |
|----------|---------|----------------|
| **Cloudflare** | DNS for `protosweb.eu` — MX (Zoho), Resend DKIM/SPF, DMARC. See [`docs/cloudflare-dns.md`](docs/cloudflare-dns.md) |
| **`.env.local`** (local dev, gitignored) | Your machine only | Copy from `.env.example` — never commit |
| **Vercel** | Production/preview builds + runtime | All `NEXT_PUBLIC_*` + server keys the Next.js app uses |
| **GitHub Secrets** | GitHub Actions workflows only | See breakdown below |
| **Supabase Edge Secrets** | Edge functions only | `KEEP_ALIVE_SECRET`, `RESEND_API_KEY`, `CONTACT_EMAIL=dario.admin@protosweb.eu`, `RESEND_FROM_EMAIL=dario.admin@protosweb.eu` |

**Why not one `.env` for everything?** `.env` files must never be pushed to git (security). Vercel injects vars at deploy time. GitHub and Supabase run separate services that never read Vercel's config.

**Do GitHub secrets need `NEXT_PUBLIC_SUPABASE_URL`?** No — the site reads that from Vercel. GitHub uses `SUPABASE_URL` (same host, no `NEXT_PUBLIC_` prefix) for keep-alive and showcase asset workflows.

### GitHub Secrets by workflow

| Secret | Used by |
|--------|---------|
| `SUPABASE_URL` | keep-alive cron, upload-showcase-assets |
| `KEEP_ALIVE_SECRET` | keep-alive cron |
| `SUPABASE_SERVICE_ROLE_KEY` | upload-showcase-assets |
| `SUPABASE_ACCESS_TOKEN` | deploy edge functions |
| `SUPABASE_PROJECT_REF` | deploy edge functions |

### Vercel — required for the live site

- `NEXT_PUBLIC_SITE_URL` = `https://protosweb.eu` (Production **and** Preview — mora odgovarati `SITE_URL` u `src/lib/site.ts`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SECRET` — private admin panel password

Email vars on Vercel are **legacy/unused** by Next.js (mail goes through Supabase edge fn) but kept in sync: `CONTACT_EMAIL` and `RESEND_FROM_EMAIL` = `dario.admin@protosweb.eu`.

**DNS (Cloudflare):** see [`docs/cloudflare-dns.md`](docs/cloudflare-dns.md) — MX for Zoho inbox, Resend on `send` subdomain, update DMARC `rua`.

**Analytics (GA4):** wired by default (`G-HR9HK4SR7Q`, consent-gated). Optional override: `NEXT_PUBLIC_GA_ID`. Alternative: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

### Vercel — safe to remove (unused by current code)

Stripe, Resend, Brevo, Sentry, Telegram, `DATABASE_URL` — leftovers from older setup; they do not break anything if left in place.

## Supabase Edge Functions

See [`supabase/functions/README.md`](supabase/functions/README.md) for deploy, secrets, and the contact-form database webhook setup.

Functions deploy automatically on push to `main` when `supabase/functions/**` changes (requires GitHub secrets `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF`).

## Supabase Keep-Alive

Free-tier Supabase projects pause after ~7 days of inactivity. A GitHub Actions cron (`.github/workflows/supabase-keep-alive.yml`) pings the `keep-alive` edge function **every 10 minutes**.

**One-time setup:**

1. Deploy the function: `supabase functions deploy keep-alive --project-ref laqnnzavwbojntfiqmxj`
2. Set Supabase Edge Function secret `KEEP_ALIVE_SECRET` (random string)
3. Add GitHub repo secrets:
   - `SUPABASE_URL` = `https://laqnnzavwbojntfiqmxj.supabase.co`
   - `KEEP_ALIVE_SECRET` = same value as step 2

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected into edge functions by Supabase.

## Vercel Build Warnings

Yellow `npm warn deprecated` lines during `npm install` (e.g. `eslint@8`, `glob@7`, `three-mesh-bvh`) come from **transitive dependencies** — not errors. The build still succeeds. Safe to ignore until a planned Next.js / ESLint major upgrade. Do not force-upgrade Three.js or ESLint without testing the 3D showcase.

## npm audit

`npm audit` may report moderate/high issues in transitive deps (e.g. `glob` via `eslint-config-next@14`, nested `postcss` via `next@14`). The security workflow (`.github/workflows/security.yml`) only fails on **critical** severity — it passes today.

**Do not run** `npm audit fix --force` — it pulls Next 16 / next-intl 4 (breaking). Safe patch bumps within the Next 14 ecosystem are fine (`@supabase/supabase-js`, `postcss`). Major upgrades require testing the 3D showcase first.
