# Protos-Web — Project Memory

> **Last updated:** 2026-07-02  
> **Live:** https://www.protosweb.eu  
> **Repo:** `ProtosEschatos/Protos-Web`  
> **Latest commit:** `2766de1` — *Restore original space station portfolio showcase environment.*

---

## Gdje si stao (TL;DR)

**Odlučeno:** Synthwave / 360° experiment **odbačen**. Radi se na **originalnoj Space Station** 3D galeriji.

**Trenutno stanje:**
- Space station prostorija je vraćena i pushana na `main`
- Portfolio screenshoti idu preko **Supabase Storage** (+ fallback iz `public/showcase/`)
- Movement (WASD / joystick / E za projekt) radi
- Synthwave asseti i kod **obrisani** (git + Supabase cleanup workflow)

**Sljedeći korak kad se vratiš:** doraditi space station do produkcijske kvalitete (vizual, UX, možda više projekata iz DB).

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

## Showcase — trenutna arhitektura

**Ruta:** `/portfolio-showcase` (NE `/showcase` — to je 404)

| Datoteka | Uloga |
|----------|--------|
| `src/app/[locale]/portfolio-showcase/page.tsx` | Dynamic import `SpaceGallery` |
| `src/components/three/SpaceGallery.tsx` | Phase UI: loading → intro → playing |
| `src/components/three/showcase/GalleryScene.tsx` | **Space station soba** + movement + project frames |
| `src/components/three/showcase/constants.ts` | Dimenzije galerije, project linkovi, Supabase URL-ovi |
| `src/components/three/showcase/buildProjects.ts` | Spaja i18n + DB `portfolio_items` + screenshot URL |
| `src/lib/showcase-storage.ts` | Supabase public URL helper |
| `src/components/three/showcase/AstronautCharacter.tsx` | 3D astronaut |
| `src/components/layout/AppChrome.tsx` | Showcase = bez Header/Footer/PageLoader |

**Obrisano / ne koristi se više:**
- `SynthwaveRoom.tsx`
- `retrowave/` folder
- 360° panorama asseti
- `synthwaveTextures.ts`

---

## Space Station — što je u sceni

- Zatvorena galerija (pod, strop, 4 zida, unutarnji paneli)
- Starfield pozadina
- Neon "PORTFOLIO" tekst na stražnjem zidu
- 4 project frame-a na lijevom/desnom zidu (desktop/mobile screenshot)
- Floor ring markeri ispod projekata
- Third-person kamera, astronaut na startu gore u sobi

**Konfiguracija** (`SHOWCASE_CONFIG`):
- `galleryLength: 24`, `galleryWidth: 12`, `galleryHeight: 10`
- `frameSpacing: 8`, `moveSpeed: 0.35`, `turnSpeed: 0.05`

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

**Obrisano iz storagea (cleanup workflow):**
- `environment/synthwave-*` (room, equirect, panorama, sheet)

**Skripte:**
- `npm run upload:showcase-assets` — upload iz `public/showcase/` → Supabase
- `npm run cleanup:showcase-assets` — briše legacy pathove
- GitHub Action: `.github/workflows/upload-showcase-assets.yml` (manual dispatch, cleanup pa upload)

**GitHub secrets:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `KEEP_ALIVE_SECRET`

---

## Lokalni asseti (`public/showcase/`)

Samo project screenshoti (8 JPG):
- `desktop-bodulica.jpg`, `mobile-bodulica.jpg`
- `desktop-zeustrading.jpg`, `mobile-zeustrading.jpg`
- `desktop-cosmic-blueprint.jpg`, `mobile-cosmic-blueprint.jpg`
- `desktop-protosweb.jpg`, `mobile-protosweb.jpg`

Koriste se za lokalni dev fallback i kao izvor za upload workflow.

---

## UI / i18n (showcase)

- Loader: **🚀 Space Station**
- Intro: **🌌 Space Gallery**
- Header: **🚀 Space | Station**
- Boje: `#6366f1` (indigo), `#06b6d4` (cyan)
- Ključevi u `src/messages/{locale}.json` → sekcija `"showcase"`

---

## Hard rules (NE dirati bez razloga)

1. **Ne dirati** `PageLoader` / boot video logiku (`src/components/ui/PageLoader.tsx`, `src/lib/boot-gate.ts`) osim ako eksplicitno tražiš
2. **Ne upgradeati** Three.js bez plana migracije
3. Showcase ruta = **izolirana** — nema site chrome (Header/Footer/SiteBackground)
4. **Ne commitati/pushati** osim ako eksplicitno tražiš (user preference)
5. TypeScript (`.tsx`) — ne "JS bundle" terminologija s korisnikom

---

## Kako testirati

```bash
npm run dev
# → http://localhost:3000/portfolio-showcase
```

Production:
1. Hard refresh (`Ctrl+Shift+R`)
2. Klik **Započni razgledavanje**
3. WASD / strelice, **E** kod projekta

Build:
```bash
npm run type-check && npm run build
```

---

## TODO — kad se vratiš doraditi space station

- [ ] **Vizual polish** — bolje materijali, glow, detalji na zidovima/stropu
- [ ] **Portfolio iz DB** — provjeri da svi `portfolio_items.image_url` imaju ispravne Supabase URL-ove
- [ ] **Više projekata** — trenutno hardcoded 4 u `PROJECT_LINKS`; proširiti dinamički?
- [ ] **Mobile UX** — joystick pozicija, frame veličine na malom ekranu
- [ ] **Performance** — shadow map size, starfield count, DPR na slabijim uređajima
- [ ] **SEO / meta** — `portfolio-showcase/layout.tsx` title/description
- [ ] Opcionalno: planet/dekoracije, animirani hologrami, bolji "PORTFOLIO" znak

---

## Povijest odluka (kratko)

| Period | Što se radilo | Ishod |
|--------|---------------|-------|
| Ranije | Original space station + astronaut | ✅ Referentna verzija |
| Sredina | Synthwave highway → retrowave → 360° panorama | ❌ Odbačeno — nije radilo pouzdano |
| 2026-07-02 | Vraćen space station + Supabase screenshoti | ✅ Trenutni `main` |
| 2026-07-02 | Cleanup git + Supabase od synthwave asset-a | ✅ Gotovo |

---

## Brzi kontakti u kodu

```bash
# Showcase scene
src/components/three/showcase/GalleryScene.tsx

# Movement & bounds
src/components/three/showcase/GalleryScene.tsx  → useFrame
src/components/three/showcase/constants.ts      → SHOWCASE_CONFIG

# Project data
src/components/three/showcase/buildProjects.ts
src/actions/portfolio.ts

# Storage URLs
src/lib/showcase-storage.ts
```

---

*Ažuriraj ovaj file kad napraviš veće promjene.*
