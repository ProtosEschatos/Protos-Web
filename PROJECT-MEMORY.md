# Protos-Web — Project Memory (TL;DR)

> **Kanonski izvor:** [Protos-Agent/memory/](https://github.com/ProtosEschatos/Protos-Agent/tree/main/memory)  
> Pregled u adminu: `/admin/memory`  
> **Ne dupliciraj** punu session memoriju ovdje — ažuriraj samo ovaj sažetak.

**Live:** https://www.protosweb.eu  
**Repo:** `ProtosEschatos/Protos-Web`  
**Deploy:** `git push origin main` → GitHub → Vercel (bez Vercel CLI)

## Trenutno stanje (2026-07-14)

- **Showcase fix:** `40b0514` — `PortfolioShowcaseClient` koristi `ShowcaseBootLoader` u `next/dynamic` (nikad `loading: () => null` na showcaseu).
- **Supabase:** projekt `laqnnzavwbojntfiqmxj` — backend live. Tajne: `docs/security.md`.
- **Admin Console v3.0:** slate/indigo UI — detalji u Protos-Agent memoriji i `docs/admin-console.md`.
- **Donacije:** Stripe LIVE — `docs/stripe-donations.md`, `/admin/donacije`.
- **Ne commitati:** `public/design/` (untracked assets).

## Agent workflow

1. Pročitaj `AGENTS.md` + relevantne `.cursor/rules/*.mdc`
2. `npm run lint && npm run type-check && npm run build`
3. Commit samo kad korisnik traži
4. Push na `main` na kraju — provjeri live s `curl` (ne `vercel` CLI)

## Brzi linkovi

| Tema | Gdje |
|------|------|
| Sigurnost / tajne | `docs/security.md` |
| Admin UI | `docs/admin-console.md` |
| Edge funkcije | `supabase/functions/README.md` |
| DNS | `docs/cloudflare-dns.md` |
| Stripe | `docs/stripe-donations.md` |
