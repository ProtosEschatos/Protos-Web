# 3D Toolkit — Protos Web

Reference for building React Three Fiber scenes in this repo. Read this before adding or changing anything under `src/components/three/**`.

## Stack

| Layer | Package | Role |
|-------|---------|------|
| Renderer | `@react-three/fiber` | React renderer for Three.js |
| Helpers | `@react-three/drei` | Stars, Sparkles, Float, GLTF, Environment, Html, etc. |
| Core | `three` | Math, geometries, materials (via R3F only — no vanilla Three in pages) |
| Debug (dev) | `r3f-perf` | FPS / draw calls overlay |

**Do not** add vanilla Three.js scripts, GSAP, or Spline runtime. Use R3F + drei.

## Layer architecture

See [`.cursor/rules/dom-canvas-layers.mdc`](../.cursor/rules/dom-canvas-layers.mdc).

- **Site pages:** `SiteBackground` → per-route backgrounds in `three/backgrounds/` (fixed, behind DOM)
- **Showcase:** fullscreen `SpaceGallery` only — no Header/Footer/SiteBackground
- **One Canvas job:** 3D only; UI chrome stays in DOM

## drei cheat sheet (Protos aesthetic)

| Helper | Use for |
|--------|---------|
| `Stars` | Deep space starfield ([`HomeBackground.tsx`](../src/components/three/backgrounds/HomeBackground.tsx)) |
| `Sparkles` | Floating particles, magic dust |
| `Float` | Gentle hover on meshes |
| `MeshDistortMaterial` | Organic nebula blobs |
| `Environment` | HDRI lighting for GLTF models |
| `Cloud` | Volumetric fog layers |
| `Trail` | Motion trails behind moving objects |
| `Html` | Labels in 3D space (use sparingly — prefer DOM HUD) |
| `useGLTF` | Load `.glb` / `.gltf` assets |
| `OrbitControls` | Dev/preview only — not for production site backgrounds |

## Color palette (3D)

Match boot screen and design system:

- Neon green: `#39ff14`
- Orange: `#ff6600` / `#ff8c00`
- Purple: `#a855f7` / `#8b5cf6`
- Cyan accent: `#06b6d4`
- Background: `#0a0a1a` / `#020818`

## Performance budget

| | Mobile | Desktop |
|---|--------|---------|
| Point cloud particles | ≤ 600 | ≤ 1200 |
| Sparkles count | ≤ 40 | ≤ 80 |
| Shadow maps | off | optional low-res |
| Postprocessing | avoid | sparingly |

Pattern from [`HomeBackground.tsx`](../src/components/three/backgrounds/HomeBackground.tsx): detect mobile via viewport hook, reduce counts.

## Mandatory patterns

1. **Dynamic import** with `{ ssr: false }` for every Canvas
2. **`<Suspense>`** fallback (dark div or minimal loader)
3. Wrap route backgrounds in `AmbientBackgroundShell` / `BackgroundErrorBoundary`
4. Use `live-utils.ts` helpers (`pulseOpacity`, etc.) for consistent motion
5. Fetch drei/R3F API docs via Context7 MCP when unsure

## File locations

```
src/components/three/
├── backgrounds/     # Per-route ambient scenes
├── showcase/        # SpaceGallery 3D room
└── SpaceGallery.tsx
src/lib/
├── site-background-routes.ts
├── webgl.ts
└── showcase-viewport.ts
```

## External references

- [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber)
- [drei docs](https://drei.docs.pmnd.rs/)
- [Three.js journey](https://threejs-journey.com/) — concepts only; implement via R3F

## Agent workflow

1. Read `dom-canvas-layers.mdc` + this file
2. Check `design/references/README.md` for existing element patterns
3. Reuse `AmbientBackgroundShell`, `live-utils`, mobile particle scaling
4. Run `npm run build` — R3F errors often appear only at build time
