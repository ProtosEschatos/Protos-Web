# Admin visual editors — roadmap

Protos Web admin panel supports content editing today; visual/scene editors roll out in phases.

## Phase 1 — Live preview (shipped)

| Area | Location | Capability |
|------|----------|------------|
| Blog | `/admin/blog/new`, `/admin/blog/[id]/edit` | Markdown editor + live preview panel; AI insert |
| Portfolio | `/admin/portfolio/new`, `/admin/portfolio/[id]/edit` | Card preview + AI description helper |

## Phase 2 — Design library (shipped)

| Area | Location | Capability |
|------|----------|------------|
| Design assets | `/admin/integrations` | Upload to Supabase `design-assets` bucket; CRUD `design_elements` rows |

Use this instead of manual Supabase dashboard uploads for board references and textures.

## Phase 3 — AI content studio (shipped)

| Area | Location | Capability |
|------|----------|------------|
| AI chat | `/admin/ai` | DeepSeek + Gemini via `/api/admin/ai` |
| Inline AI | Blog/portfolio forms | Toggle “AI pomoć”, insert generated text |

**Env vars (Vercel only, never commit):**

- `DEEPSEEK_API_KEY`
- `GEMINI_API_KEY`

## Phase 4 — 3D scene editor (planned)

Goal: edit R3F page backgrounds (`src/components/three/backgrounds/*`) without touching code for every tweak.

Recommended stack:

1. **[Theatre.js](https://www.theatrejs.com/)** — timeline + keyframes for camera, lights, object transforms
2. Export JSON config to Supabase (`scene_configs` table — future migration)
3. `PageBackgroundCanvas` reads config at runtime; CSS fallback if WebGL fails

Not in scope until Phase 1–3 are stable on production.

### Phase 4 implementation sketch

```
admin/scenes/[routeKey]  →  Theatre studio (dev-only bundle)
        ↓ save
Supabase scene_configs   →  PageBackgroundCanvas loader
        ↓ fallback
BACKGROUND_FALLBACKS     →  existing CSS gradients
```

## Rules for agents

- Boot screen (`BootScreen.tsx`, `PageLoader.tsx`) — do not replace with generic loaders
- Stack badges — source of truth is `src/lib/tech-stacks.ts`
- API keys — Vercel env only; admin UI shows configured/missing status
- Supabase migrations — never auto-apply from admin without explicit user confirmation
