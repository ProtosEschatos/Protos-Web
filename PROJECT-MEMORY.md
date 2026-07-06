# Protos-Web — Project Memory

> **Last updated:** 2026-07-06
> **Live:** https://www.protosweb.eu
> **Repo:** `ProtosEschatos/Protos-Web`
> **Latest commit:** email infra + PROJECT-MEMORY (ovaj commit)

---

## Gdje si stao (TL;DR)

**Email stack (2026-07-06):** `dario.admin@protosweb.eu` na Zoho Mail (inbox) + Resend (slanje s web stranice). Cloudflare MX za Zoho ✅. Resend domena + novi API key u Supabase secrets ✅. `src/lib/site.ts` = single source of truth.

**Kritičan fix:** `NEXT_PUBLIC_SUPABASE_URL` nedostajao na Vercel **Production** → kontakt forma vraćala "not configured". Dodan + redeploy.

**GA4:** `G-HR9HK4SR7Q` (consent-gated).

**Preostalo:** DMARC `rua` → `dario.admin@protosweb.eu`; IMAP/SMTP opcionalno (mobitel); online presence linkovi placeholderi; design asset slike.

---

## 2026-07-06 — Email: protosweb.eu + Zoho + Resend

### Arhitektura
- **Zoho Mail** `dario.admin@protosweb.eu` — prima admin upite (inbox). IMAP/SMTP opcionalno za mobitel (nije potrebno za site).
- **Resend** — šalje transakcijske mailove (kontakt forma admin + auto-reply, newsletter welcome).
- **Cloudflare DNS** (`docs/cloudflare-dns.md`):
  - MX: `mx.zoho.eu` / `mx2.zoho.eu` / `mx3.zoho.eu` ✅
  - SPF apex: `include:zohomail.eu` ✅
  - Resend: `send.protosweb.eu` SPF + `resend._domainkey` DKIM ✅
  - DMARC: još `rua=contact@protos-design.net` → promijeniti u `dario.admin@protosweb.eu`

- **Resend API key:** u Supabase secrets. **Ne commitati u repo.**
- **Brevo:** `BREVO_API_KEY` ažuriran u Supabase (2026-07-06). Registriraj/verificiraj domenu na brevo.com; `brevo-code` TXT u Cloudflareu.

### Kod
- `src/lib/site.ts` — `CONTACT_EMAIL`, `SITE_URL`, `SITE_DOMAIN`
- Edge fn: `submit-form` (webhook INSERT → Resend), `subscribe` (newsletter)
- Deploy workflow: `--no-verify-jwt` za submit-form + subscribe

### Vercel fix (kritično)
`NEXT_PUBLIC_SUPABASE_URL` bio samo na **Development** — kontakt forma na produkciji padala. Dodan na Production + redeploy.

### E2E testovi (2026-07-06)
- Newsletter subscribe edge fn: ✅ 200
- submit-form webhook (Resend): ✅ 200 `Poruka poslana!`
- Live `/api/contact`: ✅ 200 nakon Vercel redeploy

---

- **GA4 Measurement ID:** `G-HR9HK4SR7Q` (property na `dario23imsirovic@gmail.com`).
- **Kod:** `Analytics.tsx` učitava gtag samo nakon analytics cookie opt-in; SPA navigacije trackirane ručno (`page_view` event).
- **Deploy:** ID je hardcodirani fallback u kodu — ne treba Vercel env var da bi radio na produkciji. Override: `NEXT_PUBLIC_GA_ID`.
- **Provjera:** prihvati kolačiće na live siteu → GA4 Realtime report.

---

## 2026-07-06 — Logo, Online Presence & Design biblioteka

- **Novi animirani logo** (`src/components/ui/ProtosLogo.tsx`): dvije neonske kugle (plava + narančasta) eliptično orbitiraju, spoje se u ljubičasto-zelenu neonsku kuglu, pa se razdvoje. Poštuje `prefers-reduced-motion`. Stari `ProtosEclipseLogo` obrisan.
- **"Moja online prisutnost"** sekcija na `/o-meni` (`components/sections/OnlinePresence.tsx` + `ui/BrandIcons.tsx` + `lib/social-links.ts`) — socials + freelance platforme kao pločice. Nav gumb `PRISUTNOST` u headeru + mobilnom meniju (deep-link `#online-presence`). **Linkovi su placeholderi (`#`)** osim WhatsAppa — čekaju prave URL-ove.
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
- Generiran `src/lib/database.types.ts`, Supabase klijent tipiziran (`createClient<Database>`), `actions/blog.ts` usklađen s nullability.
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
| CI/CD | GitHub Actions: `ci` (lint/type-check/build), `security`, `supabase-keep-alive` (cron 10min), `supabase-deploy-functions`. |

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
- **Opcionalno:** Stripe/donacije (`donations`, `stripe_price_id`) — trenutno neiskorišteni ostatak multi-tenant platforme.
- **Sitno:** `NEXT_PUBLIC_SITE_URL` dodati i za Vercel Preview (točni canonical/sitemap na preview deployevima); razmisliti o `.gitignore` za `test-results/`.
- **Cloudflare DNS:** MX + Zoho SPF ✅; DMARC `rua` još stara adresa — vidi [`docs/cloudflare-dns.md`](docs/cloudflare-dns.md)
