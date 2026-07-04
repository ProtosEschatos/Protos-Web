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
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # Locale-based routing (hr/en/de/it/es)
│   │   ├── layout.tsx         # Root layout (fonts, PageLoader, Header, Footer, CookieBanner)
│   │   ├── page.tsx           # Home page (Hero, Process, Portfolio, Services, Blog, Contact)
│   │   ├── o-meni/page.tsx    # About page
│   │   ├── proces/page.tsx    # Process page
│   │   ├── portfolio/page.tsx # Portfolio page
│   │   ├── portfolio-showcase/page.tsx # R3F 3D space gallery
│   │   ├── usluge/page.tsx    # Services page
│   │   ├── blog/page.tsx      # Blog listing (Supabase)
│   │   ├── blog/[slug]/page.tsx # Blog post detail
│   │   └── kontakt/page.tsx   # Contact page
│   └── api/
│       ├── contact/route.ts   # POST contact form → Supabase RPC
│       ├── subscribe/route.ts # POST newsletter → subscribe edge fn
│       └── blog/route.ts      # GET blog API
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Navigation, lang selector, theme cycler
│   │   ├── Footer.tsx         # Footer with links, social, Balkans tags
│   │   └── MobileMenu.tsx     # Framer Motion slide-in mobile menu
│   ├── sections/
│   │   ├── Hero.tsx           # Hero with dynamic HeroCanvas
│   │   ├── Services.tsx       # 6 service cards grid
│   │   ├── Process.tsx        # 4 steps + 3 feature cards
│   │   ├── Portfolio.tsx      # Projects + showcase banner
│   │   ├── Blog.tsx           # 3 preview cards
│   │   └── Contact.tsx        # Form + contact info
│   ├── three/
│   │   ├── backgrounds/       # Per-route R3F backgrounds (Home, Process, etc.)
│   │   └── showcase/          # SpaceGallery 3D room only
│   └── ui/
│       ├── PageLoader.tsx     # Cyber boot gate + cookie modal
│       ├── SiteBackground.tsx # Route-aware background wrapper
│       ├── PageBackgroundCanvas.tsx
│       ├── CustomCursor.tsx   # Dot + follower cursor
│       └── CookieBanner.tsx   # Cookie consent
├── lib/
│   ├── section-icons.tsx      # Shared Lucide icons for services/process
│   ├── social-links.ts        # Social profile URLs
│   └── supabase.ts           # Supabase client (anon + service role)
├── messages/
│   ├── hr.json               # Croatian translations
│   ├── en.json               # English translations
│   ├── de.json               # German translations
│   ├── it.json               # Italian translations
│   └── es.json               # Spanish translations
├── styles/
│   └── globals.css            # Tailwind + CSS vars + reset
├── i18n.ts                    # next-intl configuration
└── middleware.ts              # next-intl locale routing
```

## Config Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js 14 config with next-intl plugin, Three.js transpile |
| `tailwind.config.ts` | Tailwind with Protos theme colors, custom animations |
| `tsconfig.json` | TypeScript strict mode, `@/*` path alias |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `.cursorrules` | Cursor AI coding standards |
| `package.json` | All dependencies |

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
- [x] PageLoader with cyber background, progress gate, and boot cookie modal
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
- [x] About page with bio, goals, Support Balkans
- [x] Services page
- [x] Contact page
- [x] API routes: POST /api/contact, GET /api/blog
- [x] i18n with next-intl (5 languages)
- [x] hreflang alternates + dynamic sitemap with blog posts
- [x] All config files (tailwind, next, tsconfig, postcss, middleware, i18n)
- [x] .cursorrules for Cursor AI

### Backend
- [x] Supabase client connection
- [x] Blog data from Supabase (`blog_posts` table, 80 posts)
- [x] Contact form submission to Supabase (`submit_contact` RPC) + `submit-form` edge fn emails via DB webhook
- [x] Newsletter signup via `/api/subscribe` → `subscribe` edge fn
- [x] Portfolio data from Supabase
- [x] Supabase edge functions in repo: `keep-alive`, `submit-form`, `subscribe`
- [x] GitHub workflows: CI, keep-alive cron, edge function deploy, security audit, Dependabot

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
6. **Performance** — R3F canvases use `next/dynamic` with `ssr: false`; production responses use `compress: true` in `next.config.js`; Inter loads with `display: swap`. Run Lighthouse against a production build (`npm run build && npm start`) for audit scores.

## Environment Variables — Where Things Live

Secrets are **not** duplicated everywhere on purpose. Each platform reads only what it needs:

| Location | Purpose | What goes here |
|----------|---------|----------------|
| **`.env.local`** (local dev, gitignored) | Your machine only | Copy from `.env.example` — never commit |
| **Vercel** | Production/preview builds + runtime | All `NEXT_PUBLIC_*` + server keys the Next.js app uses |
| **GitHub Secrets** | GitHub Actions workflows only | `SUPABASE_URL`, `KEEP_ALIVE_SECRET`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` |
| **Supabase Edge Secrets** | Edge functions only | `KEEP_ALIVE_SECRET`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM_EMAIL`, `BREVO_API_KEY` (optional) |

**Why not one `.env` for everything?** `.env` files must never be pushed to git (security). Vercel injects vars at deploy time. GitHub and Supabase run separate services that never read Vercel's config.

**Do GitHub secrets need `NEXT_PUBLIC_SUPABASE_URL`?** No — the site reads that from Vercel. GitHub only needs the base URL for the keep-alive curl (`SUPABASE_URL`, same host without `NEXT_PUBLIC_` prefix).

### Vercel — required for the live site

- `NEXT_PUBLIC_SITE_URL` = `https://www.protosweb.eu`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional later: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_GA_ID`

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
