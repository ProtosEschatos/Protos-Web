# Admin panel — Console v3.0

**URL:** https://www.protosweb.eu/admin  
**Auth:** `ADMIN_SECRET` na **Vercelu** (ne Supabase)  
**UI referenca:** [Google-AI-Studio-Github-Connect](https://github.com/ProtosEschatos/Google-AI-Studio-Github-Connect) — slate/indigo „Console v3.0” layout

## Izgled i layout

| Element | Datoteke |
|---------|----------|
| Shell + footer | `src/components/features/admin/AdminShell.tsx` |
| Stilovi (scoped) | `src/styles/admin-console.css` — klasa `.admin-console` |
| Header (sat, sync) | `AdminHeader.tsx` |
| Sidebar moduli | `AdminSidebar.tsx` + `src/lib/admin-nav.ts` |
| Client navigacija | `AdminLink.tsx` → Next.js `Link` (bez full reload) |

**Tema:** `slate-950` pozadina, **indigo** akcent (ne narančasti cosmic javnog sitea). Unutar `.admin-console` CSS varijable `--primary`, `--dark-card` itd. su overrideane na indigo/slate.

## Performance (admin-only)

- **Lenis** smooth scroll isključen na `/admin/*`
- **Nema Three.js** pozadine u adminu (CSS gradient)
- **Boot gate** preskače `/admin` u `BOOT_GATE_INIT_SCRIPT` (`src/lib/config/boot-gate.ts`) — cookie loader ne prekriva login

## Rute

| Put | Sadržaj |
|-----|---------|
| `/admin` | Dashboard — statistike, inboxi, sigurnost, marketing |
| `/admin/inbox` | Zoho + Gmail studio + Martina IMAP + kontakt forma |
| `/admin/donacije` | Stripe donacije (`donations` tablica) |
| `/admin/blog`, `/admin/portfolio` | CMS CRUD |
| `/admin/stranice/*` | Statičke stranice (i18n u `messages/`) |
| `/admin/assets` | Slike, videa, 3D modeli, teksture, audio → Supabase Storage (`admin-uploads` bucket) + `admin_assets` metadata tablica |
| `/admin/konfigurator` | Live 3D scena (R3F) + assets library (isti bucket) + Sketchfab / Poly.Pizza + chat asistent |
| `/admin/memory` | Protos-Agent memorija (GitHub raw, `GITHUB_TOKEN` ako je repo privatan) |
| `/admin/ai` | GPT-OSS-120B → DeepSeek → Gemini cascade (`GPT_OSS_API_KEY` → `DEEPSEEK_API_KEY` → `GEMINI_API_KEY`) |
| `/admin/tools` | Linkovi na Vercel, DNS, platforme |

## Asset pipeline (`/admin/assets` + `/admin/konfigurator` → Studio tab)

Slike, videa, 3D modeli i teksture koje admin uploada:

| Sloj | Gdje živi | Kako se čita |
|------|-----------|--------------|
| Binary content | **Supabase Storage**, privatni bucket `admin-uploads` | Server mint-a signed URL (`lib/storage/admin-uploads.ts` → `createSignedReadUrl`) |
| Metadata | **Postgres**, tablica `public.admin_assets` (kategorija, MIME, dimenzije, tagovi, `is_published`) | `adminListAssets()` u adminu; `getPublishedAssets({ tag })` (server-only, `lib/assets/index.ts`) na javnim stranicama |
| Upload flow | Browser dropzone → server action `adminCreateAssetUpload()` mint-a signed upload URL → browser PUT direktno u Supabase → `adminFinalizeAssetUpload()` insertira metadata | `src/components/features/admin/AssetUploader.tsx` |
| Publikacija | Toggle "LIVE" u gridu → `is_published = true` → RLS pušta `anon SELECT` samo za te retke | `src/components/features/admin/AssetLibrary.tsx` |
| Integracija u scenu | Klik na `model_glb/gltf` → `useSceneStore.loadGltf(signedUrl)` | `ConfiguratorManager` "Moji assets" tab |

**Bitno:** Protos-Agent repo (GitHub) je **isključivo za AI memoriju** (markdown/JSONL). **Nikada** ne treba u njega gurati binary assete — koristi ovaj pipeline.

Zavisi o env varijablama: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (na Vercelu, već postoji).

## IMAP env (Vercel Production)

| Mailbox | Env prefix |
|---------|------------|
| Zoho admin | `ZOHO_IMAP_*` |
| Gmail studio | `GMAIL_STUDIO_IMAP_*` |
| Martina (placeholder) | `MARTINA_IMAP_*` |

Detalji: `docs/security.md`, `docs/email-setup.md`

## Sljedeći korak (opcionalno)

Portati tabove iz reference repoa 1:1: Brevo/Resend hub, Security terminal, Shortcuts manager — trenutno su ekvivalenti raspršeni po `/admin/tools`, `/admin/inbox`, dashboardu.

## Commits (2026-07-11 večer)

| SHA | Opis |
|-----|------|
| `0ba7201` | Boot gate bypass na admin rutama |
| `0871c0e` | Perf: Link navigacija, bez Lenis/WebGL |
| `3c039ed` | Console v3.0 reskin (reference repo) |
