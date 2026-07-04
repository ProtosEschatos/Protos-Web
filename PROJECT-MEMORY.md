# Protos-Web — Project Memory

> **Last updated:** 2026-07-04  
> **Live:** https://www.protosweb.eu  
> **Repo:** `ProtosEschatos/Protos-Web`  
> **Latest commit:** `main` @ Synthwave 360 showcase

---

## Gdje si stao (TL;DR)

**Odlučeno:** Space station zamijenjen **Synthwave 360° okolinom** iz concept sheeta (`synthwave-360-sheet.jpg`).

**Trenutno stanje:**
- 360° cylinder panorama (4 panela: right | back | left | front) + animirani grid pod
- Astronaut, WASD/joystick movement, portfolio frameovi uz cestu
- Playwright e2e snima 4 smjera (`npm run test:e2e:showcase`)
- Portfolio screenshoti preko **Supabase Storage** (+ lokalni fallback)
- UI: Retrowave Drive / Synthwave boje (`#ff0099`, `#00eaff`)

**Sljedeći korak kad se vratiš:** fine-tune vizual (bloom, frame pozicije), provjeri Supabase upload nakon pusha.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14, TypeScript, App Router |
| 3D | React Three Fiber, Three.js 0.169, @react-three/drei |
| i18n | next-intl (hr, en, de, it, es) |
| Backend | Supabase (Postgres + Storage + Edge Functions) |
| Deploy | Vercel (auto from `main`) |
| E2E | Playwright (`e2e/showcase-panorama.spec.ts`) |

---

## Showcase — trenutna arhitektura

**Ruta:** `/portfolio-showcase` (NE `/showcase` — to je 404)

| Datoteka | Uloga |
|----------|--------|
| `src/app/[locale]/portfolio-showcase/page.tsx` | Dynamic import `SpaceGallery` |
| `src/components/three/SpaceGallery.tsx` | Phase UI: loading → intro → playing |
| `src/components/three/showcase/GalleryScene.tsx` | Astronaut + movement + portfolio frames |
| `src/components/three/showcase/SynthwaveEnvironment.tsx` | Cylinder panorama + grid floor + lighting |
| `src/components/three/showcase/constants.ts` | Outdoor path, frame pozicije, project linkovi |
| `src/components/three/showcase/buildProjects.ts` | Spaja i18n + DB `portfolio_items` + screenshot URL |
| `src/lib/showcase-storage.ts` | Supabase public URL helper |
| `scripts/build-synthwave-panorama.mjs` | Crop sheeta → panorama + ref paneli |

**Obrisano / ne koristi se više:**
- `GalleryShell`, `Starfield`, `PortfolioWallText` (space station)
- `SynthwaveRoom.tsx`, `retrowave/` folder

---

## Synthwave 360 — što je u sceni

**Panel mapping (heading 0 = -Z naprijed):**

| Smjer | Panel |
|-------|-------|
| Naprijed (-Z) | CENTER FRONT — sunce, grid road, horizont |
| Lijevo (-X) | LEFT — motel, auto, cyber city |
| Desno (+X) | RIGHT — Neon Diner, palme |
| Nazad (+Z) | BACK — GATEWAY 360, globe diagram |

**Cylinder UV:** `[right, back, left, front]` + `rotation Y = π` + horizontal flip za BackSide.

**Konfiguracija** (`SHOWCASE_CONFIG`):
- `pathLength: 72`, `pathWidth: 18`
- `frameSpacing: 14`, `moveSpeed: 0.35`, `turnSpeed: 0.05`

**Asset pipeline:**
```bash
npm run build:synthwave-panorama   # sheet → panorama + refs/
npm run test:e2e:showcase          # 4 view screenshots
```

---

## Supabase

| Item | Vrijednost |
|------|------------|
| Project ref | `laqnnzavwbojntfiqmxj` |
| Bucket | `showcase` (public read) |
| URL pattern | `https://laqnnzavwbojntfiqmxj.supabase.co/storage/v1/object/public/showcase/{path}` |

**Aktivni storage pathovi:**
- `projects/desktop-{slug}.jpg`
- `projects/mobile-{slug}.jpg`
- `environment/synthwave-360-panorama.jpg`
- `environment/synthwave-360-sheet.jpg` (opcionalno)

**Skripte:**
- `npm run build:synthwave-panorama` — generira panoramu iz sheeta
- `npm run upload:showcase-assets` — upload iz `public/showcase/` → Supabase
- `npm run cleanup:showcase-assets` — briše legacy pathove
- GitHub Action: `.github/workflows/upload-showcase-assets.yml` (manual dispatch)

---

## Lokalni asseti (`public/showcase/`)

**Environment:**
- `environment/synthwave-360-sheet.jpg` (master, 1536×1024)
- `environment/synthwave-360-panorama.jpg` (2048×512, built)
- `environment/refs/{front,left,right,back}.jpg`

**Project screenshoti (8 JPG):** `desktop-*`, `mobile-*` za 4 projekta.

---

## UI / i18n (showcase)

- Header: **Retrowave Drive** / Synthwave Gallery
- Boje: `#ff0099` (magenta), `#00eaff` (cyan), `#0a0018` (bg)
- Joystick: `bottom-20 right-6` (mobile)
- Ključevi u `src/messages/{locale}.json` → sekcija `"showcase"`

---

## Hard rules (NE dirati bez razloga)

1. **Ne dirati** `PageLoader` / boot video logiku
2. **Ne upgradeati** Three.js bez plana migracije
3. Showcase ruta = **izolirana** — nema site chrome
4. Ako panorama nije točna — **popravi UV/rotation**, ne revertaj na space station

---

## Kako testirati

```bash
npm run dev
# → http://localhost:3000/portfolio-showcase

npm run build:synthwave-panorama
npm run test:e2e:showcase
npm run type-check && npm run build
```

---

## Povijest odluka (kratko)

| Period | Što se radilo | Ishod |
|--------|---------------|-------|
| Ranije | Space station + astronaut | ✅ Referentna verzija (prije synthwave) |
| Sredina | Synthwave experimenti | ❌ Krivi crop, async HEAD |
| 2026-07-04 | Synthwave 360 iz concept sheeta + Playwright | ✅ Trenutni `main` |

---

*Ažuriraj ovaj file kad napraviš veće promjene.*
