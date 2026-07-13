# Protos-Web — Project Memory

> **Kanonski izvor:** [Protos-Agent/memory/](https://github.com/ProtosEschatos/Protos-Agent/tree/main/memory) + pregled u adminu na `/admin/memory`.  
> Ovaj fajl je lokalni TL;DR — ne dupliciraj punu memoriju ovdje.

> **Last updated:** 2026-07-11 (23:10)
> **Live:** https://www.protosweb.eu
> **Repo:** `ProtosEschatos/Protos-Web`
> **Latest commit:** `3c039ed` — Admin Console v3.0 UI

---

## Gdje si stao (TL;DR)

**Admin Console v3.0 (2026-07-11):** UI kao [Google-AI-Studio-Github-Connect](https://github.com/ProtosEschatos/Google-AI-Studio-Github-Connect) — slate/indigo, sidebar „Nadzorni moduli”, header sat + Sinkroniziraj. `src/styles/admin-console.css`. Perf: Next.js Link, bez Lenis/Three.js na adminu, boot gate bypass. Docs: `docs/admin-console.md`.

**Donacije LIVE:** Stripe Checkout, webhook SDK + `donation-confirm` backup. `/admin/donacije`.

**i18n O meni:** lokalizirani about URL-ovi po jeziku.

**Inbox:** Zoho + Gmail studio u `/admin/inbox` (Martina se prikazuje samo kad joj IMAP bude podešen).

**Ne commitati:** `public/design/` (untracked).

---

## Preostalo — za tebe / za dalje (2026-07-12)

### Za tebe (Vercel env — dodaj kad budeš spreman, svaka je opcionalna dok se ne postavi)

| Varijabla | Za što | Kako dobiti |
|---|---|---|
| `GMAIL_STUDIO_IMAP_PASSWORD` | Aktivira Gmail studio inbox u `/admin/inbox` (kod već postoji, samo nedostaje lozinka) | Uključi 2FA na `protoswebmark23@gmail.com` → Google Account → App Passwords → generiraj za "Mail" |
| `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ZONE_ID` | "Živi status servisa" na `/admin` — Cloudflare zona | dash.cloudflare.com → My Profile → API Tokens → **novi token, samo Zone → Zone → Read** (ne koristi DNS-edit token iz `docs/cloudflare-dns.md`) |
| `SENTRY_AUTH_TOKEN` + `SENTRY_ORG_SLUG` + `SENTRY_PROJECT_SLUG` | Broj nerješenih grešaka na `/admin` | sentry.io → treba prvo napraviti projekt ako ga nemaš, zatim Settings → Auth Tokens |
| `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` (+ `VERCEL_TEAM_ID` ako je team projekt) | Status zadnjeg deploya na `/admin` | vercel.com/account/tokens |
| `MARTINA_IMAP_PASSWORD` (+ `MARTINA_IMAP_USER` ako se razlikuje) | Vraća Martinin mailbox u `/admin/inbox` (skriven dok nije podešen) | Kad `martina.admin@protosweb.eu` postane live u Zohu |

Sve navedeno je **opcionalno i ne blokira ništa** — svaka kartica na `/admin` samo pokazuje "Nije podešeno" dok token ne postaviš.

### Za dalje (moj/agent nastavak)

- Provjeriti da sve nove "Živi status servisa" kartice ispravno prikazuju podatke kad dodaš gornje tokene
- Srpski (`sr.json`) je **transliteracija** hrvatskog teksta, ne izvorni prijevod — preporučam da netko izvorni govornik jednom pregleda tekst (posebno pravne stranice — Uvjeti/Privatnost/Kolačići)
- Opcionalno: nova Supabase Edge funkcija za prave Resend/Brevo statistike slanja (trenutno samo link + DNS status, jer im API ključevi ostaju na Supabaseu po dizajnu)
- Repo ostaje public (tvoja odluka) — ako se ikad predomisliš, promjena vidljivosti je u GitHub Settings → Danger Zone, traje 10 sekundi

---

## 2026-07-11 — Stripe donacije LIVE + post-payment fix (`13a6083`)

### Flow
- `/o-meni` → `DonationModal` → `POST /api/donate` → edge `donation-checkout` → **checkout.stripe.com**
- Success: lokalizirani about URL + `?donation=success&session_id={CHECKOUT_SESSION_ID}`
- Backup: `POST /api/donate/confirm` → edge `donation-confirm` (ako webhook ne stigne)
- Webhook: `stripe-webhook` — Stripe SDK `constructEventAsync`, ažurira `donations.status = completed`
- Admin: `/admin/donacije`

### Edge fn (Supabase, `--no-verify-jwt`)
| Fn | Uloga |
|----|-------|
| `donation-checkout` | Kreira pending red + Stripe session |
| `donation-confirm` | Backup: retrieve session → mark completed |
| `stripe-webhook` | Primarni: `checkout.session.completed` / `expired` |

### Supabase Edge secrets
| Secret | Napomena |
|--------|----------|
| `STRIPE_SECRET_KEY` | `sk_live_...` (produkcija) |
| `STRIPE_WEBHOOK_SECRET` | **LIVE** `whsec_...` iz Stripe webhook endpointa |
| `SITE_URL` | `https://www.protosweb.eu` |

### Commits (donacije + i18n, 2026-07-11)
| SHA | Opis |
|-----|------|
| `41ddca3` | Jedan donation gumb, bez progress barova |
| `48fc01c` | DB migracija + `resources` cause |
| `287a547` | O meni i18n + lokalizirani about URL-ovi |
| `13a6083` | Webhook SDK + donation-confirm + lokalizirani redirect |

Docs: `docs/stripe-donations.md`

---

## 2026-07-11 — Admin Console v3.0 (`3c039ed`)

### Referenca
- UI izvor: **ProtosEschatos/Google-AI-Studio-Github-Connect** (Google AI Studio mock → ciljani admin izgled)
- Tema: slate-950 + indigo (ne cosmic orange javnog sitea)

### Fixevi iste večeri
| SHA | Što |
|-----|-----|
| `0ba7201` | Boot veil ne blokira `/admin` (init script bypass) |
| `0871c0e` | AdminLink → Next.js Link; Lenis off; bez WebGL bg |
| `3c039ed` | Console v3.0 reskin — header, sidebar, kartice, login |

### Ključne datoteke
- `src/styles/admin-console.css`
- `src/components/features/admin/AdminShell.tsx`, `AdminHeader.tsx`, `AdminSidebar.tsx`
- `docs/admin-console.md`

---

## 2026-07-11 — Multi-inbox + Martina (`7d18a6c`)

### Promjene
- `admin/pages/` → `admin/stranice/` (o-meni, proces, usluge)
- `components/sections/` → `components/features/home/sections/`
- `components/admin/` → `components/features/admin/`
- `lib/admin/*-queries.ts` → `lib/queries/admin/`
- `lib/site.ts`, `seo.ts`, … → `lib/config/`
- `lib/admin-auth*.ts` → `lib/auth/`
- `actions/blog.ts`, `actions/portfolio.ts` → `lib/queries/` + `types/`
- `main-nav-routes.ts` → `lib/routes/main-nav.ts`
- Obrisan mrtvi `AdminActivityFeed`

### O nama branding
- `aboutPage.heroTitleHighlight`: "Protos Web"
- `aboutPage.heroTitleLine2`: "Full Stack Duo iz Zagreba." (+ en/de/it/es)
- OG `/api/og?type=about` — "Full Stack Duo iz Zagreba"

### Integracije (status)
- **DeepSeek** `/admin/ai` — aktivno (`DEEPSEEK_API_KEY` na Vercelu)
- **Zoho IMAP** — `/admin/inbox` čita `dario.admin@protosweb.eu` (`ZOHO_IMAP_*` na Vercelu)
- **Gmail studio IMAP** — `protoswebmark23@gmail.com` (`GMAIL_STUDIO_IMAP_*` na Vercelu)
- **Martina IMAP** — placeholder `martina.admin@protosweb.eu` (`MARTINA_IMAP_*` kad bude live)
- **Stripe donacije** — LIVE Checkout 1–1000 EUR; edge fn deployane; secrets u Supabase (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`); webhook mora biti **live mode** `whsec_`

Detalji: **Protos-Agent** `memory/sessions/2026-07-11-inbox-stripe-donations.md`

---

## 2026-07-11 — Branding, stackovi, SEO entiteti (`1baa74d`)

### Novi moduli
- `src/lib/config/tech-stacks.ts` — javni stack (jezici/framework), bez Supabase/Stripe/Cloudflare u UI
- `src/lib/config/team-profiles.ts` — Studio / Dario / Martina social + freelance platforme
- `src/components/features/home/sections/DualStacksSection.tsx` — Bodulica vanilla vs Protos Web na `/o-meni`

### SEO
- Fragment IDs: `#dario-imsirovic`, `#martina-markulin`
- `AboutPage` JSON-LD (`o-meni/layout.tsx`), OG `/api/og?type=about`
- Root `authors` + keywords (`protos`, `protosweb`, ASCII imena)
- Blog: `author_slug` migracija (remote ✅), byline UI, `Blog`+`ItemList` na indexu
- `public/llms.txt` — tim, dva stacka

### Instagram
- Studio/Dario: `protos_eschatos`
- Martina: `everybodycries`

### GitHub
- Branch protection `main` → required **CI**
- `security.yml` bez `continue-on-error` na critical audit

Detalji: **Protos-Agent** `memory/sessions/2026-07-11-branding-seo-stack.md`

---

## Povijest — Email + DNS (2026-07-06)

**Email + DNS:** Sve na `dario.admin@protosweb.eu`. Zoho inbox (MX) ✅. Resend verified (eu-west-1), DNS na `send` + `resend._domainkey` ✅. Brevo DKIM + brevo-code ✅. DMARC `rua` → `dario.admin@protosweb.eu` ✅. SPF apex Zoho+Brevo ✅.

**Security:** `public/.well-known/security.txt` live ✅. `ADMIN_SECRET` samo Vercel.

**Preostalo (starije):** Cloudflare MFA (ručno); design asset slike u bucket.

---

## 2026-07-06 — Email: protosweb.eu + Zoho + Resend

### Arhitektura
- **Zoho Mail** `dario.admin@protosweb.eu` — prima admin upite (inbox). IMAP/SMTP opcionalno za mobitel (nije potrebno za site).
- **Resend** — šalje transakcijske mailove (kontakt forma admin + auto-reply, newsletter welcome).
- **Cloudflare DNS** (`docs/cloudflare-dns.md`) — **sve OK (2026-07-06):**
  - MX: `mx.zoho.eu` / `mx2.zoho.eu` / `mx3.zoho.eu` ✅
  - SPF apex: `include:zohomail.eu include:spf.brevo.com` ✅
  - DMARC: `rua=mailto:dario.admin@protosweb.eu` ✅
  - Brevo: `brevo-code:360956...` (jedan zapis) + `brevo1/2._domainkey` CNAME ✅
  - Resend: `send` MX+SPF + `resend._domainkey` DKIM ✅; domena **Verified** (eu-west-1)

### Kod
- `src/lib/config/site.ts` — `CONTACT_EMAIL`, `SITE_URL`, `SITE_DOMAIN`
- Edge fn: `submit-form` (webhook INSERT → Resend), `subscribe` (newsletter)
- Deploy workflow: `--no-verify-jwt` za submit-form + subscribe

### Vercel fix (kritično)
`NEXT_PUBLIC_SUPABASE_URL` bio samo na **Development** — kontakt forma na produkciji padala. Dodan na Production + redeploy.

### E2E testovi (2026-07-06)
- Newsletter subscribe edge fn: ✅ 200
- submit-form webhook (Resend): ✅ 200 `Poruka poslana!`
- Live `/api/contact`: ✅ 200 nakon Vercel redeploy

---

- **GA4 Measurement ID:** `G-HR9HK4SR7Q` (property na vlasnikovom Google računu).
- **Kod:** `Analytics.tsx` učitava gtag samo nakon analytics cookie opt-in; SPA navigacije trackirane ručno (`page_view` event).
- **Deploy:** ID je hardcodirani fallback u kodu — ne treba Vercel env var da bi radio na produkciji. Override: `NEXT_PUBLIC_GA_ID`.
- **Provjera:** prihvati kolačiće na live siteu → GA4 Realtime report.

---

## 2026-07-06 — Logo, Online Presence & Design biblioteka

- **Novi animirani logo** (`src/components/ui/ProtosLogo.tsx`): dvije neonske kugle (plava + narančasta) eliptično orbitiraju, spoje se u ljubičasto-zelenu neonsku kuglu, pa se razdvoje. Poštuje `prefers-reduced-motion`. Stari `ProtosEclipseLogo` obrisan.
- **"Moja online prisutnost"** sekcija na `/o-meni` (`components/features/home/sections/OnlinePresence.tsx` + `ui/BrandIcons.tsx` + `lib/config/social-links.ts`) — socials + freelance platforme kao pločice. Nav gumb `PRISUTNOST` u headeru + mobilnom meniju (deep-link `#online-presence`). **Linkovi su placeholderi (`#`)** osim WhatsAppa — čekaju prave URL-ove.
- **Design element library (baza):**
  - Repo: `design/references/README.md` (katalog 22 kategorije / ~232 elementa) + `design/references/{boards,elements}/` za slike.
  - Cursor pravilo `.cursor/rules/design-system.mdc` (`alwaysApply`) — vizualni jezik (cosmic/neon/glassmorphism) + popis kategorija; AI uvijek ima kontekst.
  - Supabase: tablica `public.design_elements` (RLS on, service-role only) + Storage bucket `design-assets` (public, bez listanja). Migracije `20260706001900_design_elements_library.sql` + `20260706002000_seed_design_elements.sql`. Tipovi regenerirani u `database.types.ts`.
  - **TODO:** uploadati stvarne slike u bucket / `design/references/` i upisati `storage_path`+`image_url` u redove.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14, TypeScript, App Router |
| 3D | React Three Fiber, Three.js 0.169, @react-three/drei |
| i18n | next-intl (hr, en, de, it, es) |
| Backend | Supabase (Postgres + Storage + Edge Functions) |
| Deploy | Vercel (auto from `main`) |

---

## Danas #1 — Showcase soba s astronautom

**Ruta:** `/portfolio-showcase`

- **Vraćena soba:** `GalleryScene.tsx` + `constants.ts` vraćeni na pre-corridor stanje (commit `6511a25`); uklonjene koridor teksture (`backdrop.png`, `city-strip.png`, `desert-strip.png`).
- **Povećana prostorija (`c00e52b`):** `galleryLength` 24 → **48**, `galleryWidth` 12 → **24** (2x duže i šire). Sve (pod, zidovi, strop, svjetla, granice kretanja) izvedeno iz tih konstanti.
- **Prazna polja za dizajne (`4bf532c`):** dodan `FRAME_SLOTS = 8` (4 po strani). Prva 4 popunjena iz `PROJECT_LINKS`, ostala 4 prazni holografski placeholderi (bez popupa/linka). Novi unos u `PROJECT_LINKS` automatski popuni sljedeći slot.

Ključne datoteke: `src/components/three/SpaceGallery.tsx` (phase UI), `showcase/GalleryScene.tsx` (scena + kretanje + okviri), `showcase/constants.ts` (dimenzije, `FRAME_SLOTS`, `PROJECT_LINKS`), `showcase/buildProjects.ts`, `lib/showcase-storage.ts`.

---

## Danas #2 — Backend hardening (`8f15a77`)

### Sigurnost (migracija `20260705193252_harden_security_advisors`)
- Uklonjena prekomjerna RLS politika `subscribers_anon_insert` (newsletter ide preko `subscribe` edge fn sa service-role; anon insert nije trebao).
- `REVOKE EXECUTE` na `get_donation_totals` za `anon`/`authenticated` (donacije nisu spojene).
- Uklonjena široka showcase bucket SELECT politika (spriječeno listanje; javni object URL-ovi i dalje rade).
- SECURITY DEFINER funkcije već su imale `search_path = public` — nije trebalo dirati.

### Kontakt-mailovi — kritičan popravak (migracija `20260705193549_create_contacts_submit_form_webhook`)
- Otkriveno: DB webhook `contacts INSERT → submit-form` **nije postojao**, pa se mailovi nisu slali (upiti su se samo spremali). Vraćen kao kôd (trigger `supabase_functions.http_request`).

### Drift edge funkcija
- `content` funkcija (generic read API za DB sadržaj) bila deployana ali neverzionirana → uvezena u repo `supabase/functions/content/index.ts` (bez nepostojeće `products` tablice).
- `.github/workflows/supabase-deploy-functions.yml` generaliziran (petlja po `supabase/functions/*`).

### Shema kao source-of-truth
- Generiran `src/lib/database.types.ts`, Supabase klijent tipiziran (`createClient<Database>`), `lib/queries/blog.ts` usklađen s nullability.
- Migracije checked-in + `supabase/migrations/README.md` ažuriran (povijest verzija, baseline dump + type-gen upute).

---

## Backend — trenutna arhitektura

| Sloj | Detalji |
|------|---------|
| DB | Supabase Postgres, RLS na svim tablicama. Multi-tenant shema (`sites` + FK-ovi). |
| App čita iz DB | `portfolio_items`, `blog_posts` (server akcije), kontakt preko RPC `submit_contact`. |
| Hardkodirano (i18n) | `services`, `process_steps`, `pricing_plans`, `testimonials` — NISU spojeni na frontend (namjerno). |
| Edge funkcije | `submit-form` (v18), `subscribe` (v17), `content` (v13), `keep-alive` (v4) — deployane, submit/subscribe bez JWT |
| API rute | `/api/contact`, `/api/subscribe`, `/api/blog`. |
| CI/CD | GitHub Actions: `ci` (lint/type-check/build), `security`, `supabase-keep-alive` (cron 5min), `supabase-deploy-functions`. |

### Config status (provjereno 2026-07-06)
- **Supabase Edge secrets:** ✅ `RESEND_API_KEY`, `RESEND_FROM_EMAIL=dario.admin@protosweb.eu`, `CONTACT_EMAIL=dario.admin@protosweb.eu`, `KEEP_ALIVE_SECRET`, `BREVO_API_KEY`.
- **Email domena:** Zoho Mail inbox `dario.admin@protosweb.eu`; Resend DNS (SPF/DKIM na `send.protosweb.eu`) već prisutan — provjeri verifikaciju u Resend dashboardu.
- **GitHub Actions secrets:** ✅ dodani `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_REF` (deploy workflow sad zelen), uz `KEEP_ALIVE_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Vercel env:** ✅ `NEXT_PUBLIC_SUPABASE_URL` (Production — fix 2026-07-06), `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `CONTACT_EMAIL` + `RESEND_FROM_EMAIL` = `dario.admin@protosweb.eu`

### Preostali (namjerni) security advisor WARN-ovi
- `pg_net` u `public` schemi — Supabase-managed; webhook ovisi o njemu → ostavljeno.
- `submit_contact` anon/authenticated executable — namjerno, kontakt forma ga zove kao anon.

---

## Sljedeći koraci / ideje (nisu urađeni)

- **Dodati nove dizajne u showcase:** dopiši unos u `PROJECT_LINKS` + odgovarajuće `projectN_title`/`projectN_desc` ključeve u `src/messages/*.json` + screenshoti u Supabase Storage (`showcase` bucket).
- **Opcionalno:** spojiti DB sadržaj (`services`/`process`/`pricing`/`testimonials`) na frontend preko `content` edge funkcije umjesto hardkodiranog i18n.
- **Opcionalno:** Turnstile, Upstash, Brevo list ID
- ~~Stripe/donacije~~ — **LIVE** od 2026-07-11 (`13a6083`); vidi sekciju gore
- **Sitno:** `NEXT_PUBLIC_SITE_URL` dodati i za Vercel Preview (točni canonical/sitemap na preview deployevima); razmisliti o `.gitignore` za `test-results/`.
- **Cloudflare DNS:** sve email zapise ✅ (vidi [`docs/cloudflare-dns.md`](docs/cloudflare-dns.md))
- **security.txt:** `public/.well-known/security.txt` ✅
