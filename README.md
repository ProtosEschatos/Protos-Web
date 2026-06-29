# Protos Web — Next.js 14 Agency Website

## Project Overview
- **Name**: Protos Web
- **Goal**: Complete agency website migrated from vanilla HTML/CSS/JS to Next.js 14 App Router
- **Stack**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, GSAP, Lenis, next-intl
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
│   │   ├── blog/page.tsx      # Blog page (16 articles)
│   │   └── kontakt/page.tsx   # Contact page
│   └── api/
│       ├── contact/route.ts   # POST placeholder
│       └── blog/route.ts      # GET placeholder
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
│   │   ├── HeroCanvas.tsx     # R3F Stars + ParticleSphere
│   │   └── ProcessCanvas.tsx  # R3F distort spheres + particles
│   └── ui/
│       ├── PageLoader.tsx     # Eclipse animation loader
│       ├── CustomCursor.tsx   # Dot + follower cursor
│       ├── MagneticButton.tsx # Magnetic hover effect
│       └── CookieBanner.tsx   # Cookie consent
├── lib/
│   ├── animations.ts         # Shared Framer Motion variants
│   └── supabase.ts           # Supabase client placeholder
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
- [x] PageLoader with eclipse animation
- [x] CustomCursor with dot + follower
- [x] MagneticButton component
- [x] CookieBanner with localStorage persistence
- [x] Hero section with R3F HeroCanvas (Stars + ParticleSphere)
- [x] Services section (6 cards)
- [x] Process section (4 steps + 3 feature cards)
- [x] Process page with R3F ProcessCanvas
- [x] Portfolio section with showcase banner → /portfolio-showcase
- [x] Portfolio Showcase — full R3F 3D space gallery (WASD movement, E interact, ESC menu)
- [x] Blog section (preview) + full blog page (16 articles)
- [x] Contact section with form
- [x] About page with bio, goals, Support Balkans
- [x] Services page
- [x] Contact page
- [x] API routes (placeholder): POST /api/contact, GET /api/blog
- [x] i18n with next-intl (5 languages)
- [x] All config files (tailwind, next, tsconfig, postcss, middleware, i18n)
- [x] .cursorrules for Cursor AI

### Backend (Placeholder — Wire Up Later)
- [ ] Supabase client connection
- [ ] Blog data from Supabase
- [ ] Contact form submission to Supabase
- [ ] Portfolio data from Supabase
- [ ] Authentication (if needed)

### Future Enhancements
- [ ] Design refinements (user will provide updates)
- [x] SEO metadata per page
- [x] OpenGraph images
- [x] Sitemap generation
- [x] Analytics integration
- [x] Performance optimization (lighthouse audit)

## Important Notes

1. **Backend is placeholder** — all API routes return mock data. Wire up Supabase later.
2. **Route segments are in Croatian**: `/proces`, `/o-meni`, `/usluge`, `/kontakt`
3. **3D components use React Three Fiber** — NOT vanilla Three.js
4. **Dark theme only** — no light mode
5. **All Three.js components are dynamically imported** with `ssr: false`
6. **Performance** — R3F canvases use `next/dynamic` with `ssr: false`; production responses use `compress: true` in `next.config.js`; Inter loads with `display: swap`. Run Lighthouse against a production build (`npm run build && npm start`) for audit scores.
