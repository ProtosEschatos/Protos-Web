# UI Motion Toolkit — Protos Web

When to use which motion layer, and where approved patterns live.

## Decision tree

```
Loading / waiting?
├── Full-screen cinematic boot → BootScreen.tsx (custom, do NOT replace)
├── Showcase 3D room load      → ProtosLoader variant="orbit"
├── Form submit / API          → ProtosLoader variant="ring" inline
└── Page section enter         → Framer Motion whileInView

Card / panel hover?
└── GlowCard wrapper + cosmic-panel

Hero / CTA emphasis?
├── Highlight text → ShimmerText
└── Primary button → MagneticButton wrapper

Spatial / depth?
└── R3F background (see docs/3d-toolkit.md)
```

## Installed tools

| Tool | Type | Use |
|------|------|-----|
| [LDRS](https://uiball.com/ldrs/) | npm `ldrs` | Inline spinners via [`ProtosLoader.tsx`](../src/components/ui/ProtosLoader.tsx) |
| Framer Motion | npm | Scroll reveals, boot timeline, GlowCard beam |
| React Bits | copy-paste patterns | Adapted into `src/components/ui/` — never import as package |

## Approved UI primitives

| Component | File | Purpose |
|-----------|------|---------|
| `ProtosLoader` | `src/components/ui/ProtosLoader.tsx` | Brand-colored LDRS loaders |
| `ShimmerText` | `src/components/ui/ShimmerText.tsx` | Animated gradient text |
| `GlowCard` | `src/components/ui/GlowCard.tsx` | Hover glow + border beam |
| `MagneticButton` | `src/components/ui/MagneticButton.tsx` | Subtle CTA mouse follow |

All respect `prefers-reduced-motion`.

## Design language

Follow [`.cursor/rules/design-system.mdc`](../.cursor/rules/design-system.mdc):

- Dark cosmic bg, glassmorphism panels
- CSS vars: `--primary`, `--secondary`, `--accent`
- Animate only `opacity` + `transform` on large layers
- Class `cosmic-panel` for card surfaces

## Element catalog

- Local: [`design/references/README.md`](../design/references/README.md)
- Remote: Supabase `design_elements` table + `design-assets` bucket

Check catalog before inventing new UI patterns.

## Inspiration (do not npm install)

- [React Bits tools](https://reactbits.dev/tools) — text, cards, backgrounds
- [LDRS gallery](https://uiball.com/ldrs/) — pick variant, wrap in ProtosLoader

## Boot screen exception

[`BootScreen.tsx`](../src/components/ui/BootScreen.tsx) is a custom 5s cinematic sequence. Do not replace with LDRS or React Bits.
