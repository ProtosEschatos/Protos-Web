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
| `/admin/inbox` | Zoho IMAP + kontakt forma (Supabase) |
| `/admin/donacije` | Stripe donacije (`donations` tablica) |
| `/admin/blog`, `/admin/portfolio` | CMS CRUD |
| `/admin/stranice/*` | Statičke stranice (i18n u `messages/`) |
| `/admin/memory` | Protos-Agent memorija — **samo GitHub** (`ProtosEschatos/Protos-Agent`; `GITHUB_TOKEN` ako je repo privatan) |
| `/admin/ai` | DeepSeek (`DEEPSEEK_API_KEY`) |
| `/admin/tools` | Linkovi na Vercel, DNS, platforme |

## IMAP env (Vercel Production)

| Mailbox | Env prefix |
|---------|------------|
| Zoho admin | `ZOHO_IMAP_*` |

Detalji: `docs/security.md`, `docs/email-setup.md`

## Sljedeći korak (opcionalno)

Portati tabove iz reference repoa 1:1: Brevo/Resend hub, Security terminal, Shortcuts manager — trenutno su ekvivalenti raspršeni po `/admin/tools`, `/admin/inbox`, dashboardu.

## Commits (2026-07-11 večer)

| SHA | Opis |
|-----|------|
| `0ba7201` | Boot gate bypass na admin rutama |
| `0871c0e` | Perf: Link navigacija, bez Lenis/WebGL |
| `3c039ed` | Console v3.0 reskin (reference repo) |
