# Sljedeći koraci nakon c0295b5

> **Referentni commit:** `c0295b5629f371e88f90d7e035508023e1241d83` (15.7. 09:30)  
> **Supabase projekt:** `laqnnzavwbojntfiqmxj`  
> **Deploy:** `git push origin main` → Vercel → `https://protosweb.eu`

---

## Trenutno stanje (tri sloja)

| Sloj | Što znači |
|------|-----------|
| **Git kod** | Vraćen na `c0295b5` + minimalni fix (`r3f-perf` uklonjen jer lomi produkcijski showcase chunk) |
| **Git historija** | Commitovi poslije `c0295b5` (SEO, pg_cron, reverti) **ostaju vidljivi** na GitHubu — revert ne briše timeline |
| **Supabase remote** | 37 primijenjenih migracija; **2 extra** nisu u repou na `c0295b5`: `20260715073243` (site_assets bucket), `20260715122913` (pg_cron zapis — job uklonjen) |

**Revert Git repoa NE poništava Supabase migracije.** Baza drži vlastiti popis što je već odrađeno.

---

## Korak 1 — Showcase mora učitati (PRIORITET)

- [x] Maknuti `r3f-perf` iz `src/components/three/SafeCanvas.tsx` (produkcijski Turbopack crash)
- [ ] Nakon deploya: test `/portfolio-showcase` na mobitelu i desktopu (consent modal → Enter → showcase)
- [ ] CI zelen: `npm run lint && npm run type-check && npm run build`

---

## Korak 2 — Vizualni cherry-pick (jedan commit → test → push)

Redoslijed, **ne preskakati** — **primijenjeno 15.7.:**

1. [x] `b5b51c1` — unified Supabase CDN za produkcijske assete
2. [x] `34e6804` — gift wall inscription kao Supabase PNG
3. [x] `97ae33f` — lower gift wall inscription
4. [x] `ddaa8f4` — enlarge desktop project frame screens
5. [x] `720acd2` — double Astra Castra / Numen Lumen size
6. [x] `20052b7` — triptych back wall
7. [x] `84c922a` — 2x triptych text, raise wall shrine
8. [x] `f17cd1c` — boot → Enter → ToS/cookie modal gate

---

## Korak 3 — NE dirati odmah

- `9a9838e`, `f1757a1`, `69c0bb3`, `0c5995e` — responsive/consent kaos
- `277b7be` — SEO modul
- `79adf19` — pg_cron 2 min migracija
- Mass revert/rebuild, Vercel CLI deploy

---

## Korak 4 — Supabase

- Remote je “naprijed” za 2 migracije — **ne gurati** nove migracije dok showcase ne radi
- `site_assets` bucket na remote može ostati; `c0295b5` boot video = `/loader/boot-bg.mp4` lokalno
- pg_cron job `protos-keep-alive` — uklonjen; GitHub Actions cron (`supabase-keep-alive.yml`) ostaje fallback
- **Ne brisati** bucket/extension bez eksplicitnog OK-a
- **Ne dirati** `.env*` datoteke

---

## Korak 5 — Pravilo prije svakog pusha

1. `npm run lint && npm run type-check && npm run build`
2. Ručni test showcase 2 min (mob + desktop)
3. Jedan commit po pushu
4. Poklon URL mora biti `https://protos-system-boost.pages.dev/`

---

## Referenca zahtjeva

Desktop: `Protos-Web_INTENDED_CHANGES_JUL14-15.md`
