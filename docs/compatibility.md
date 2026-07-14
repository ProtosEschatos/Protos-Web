# Compatibility — Protos Web

Protos Web is built for **all common devices, OS, and browsers**. No feature is desktop-only without a mobile/touch fallback.

## Supported targets

| Layer | Support |
|-------|---------|
| Browsers | Chrome, Firefox, Safari, Edge (last 2 major versions) |
| Mobile | iOS Safari, Android Chrome — touch controls on showcase |
| OS | Windows, macOS, Linux, iOS, Android |
| WebGL | Optional — showcase degrades to grid fallback if unavailable |

## Showcase (`/portfolio-showcase`)

| Capability | Desktop | Mobile / tablet |
|------------|---------|-----------------|
| 3D room | WASD + E | Touch joystick + tap interact |
| WebGL missing | `ShowcaseFallback` grid with project links | Same |
| Context lost | Retry button + fallback grid | Same |
| Boot / loader | `ShowcaseBootLoader` only — no site PageLoader | Same |

Detection: `src/lib/showcase/webgl.ts` (webgl2 → webgl → experimental-webgl).

Viewport: `src/hooks/use-showcase-viewport.ts` — desktop / tablet / mobile.

## Site chrome

- Responsive layout: Tailwind breakpoints (`sm`, `md`, `lg`)
- Lenis smooth scroll disabled on showcase and admin
- Cookie consent + boot gate work on all viewports
- Admin panel usable on tablet (mobile usable but cramped)

## What breaks without env vars

See [env-required.md](./env-required.md). Missing Supabase keys do **not** crash the app — public pages render with empty data; showcase shows empty frames.

## Testing before release

```bash
npm run lint && npm run type-check && npm run build
```

Manual smoke: home, portfolio, portfolio-showcase (desktop + narrow viewport), admin login.
