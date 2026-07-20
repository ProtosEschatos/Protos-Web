# Internal visual-reference library

This is the **internal design mood-board** for Protos-Web. It lives entirely
in Supabase Storage (`admin-uploads` bucket, prefix `visual-references/`) and
in the `public.admin_assets` table. It is **never surfaced on the public
site** — `is_published = false` on every row.

Purpose: give the agent (and any collaborator opening `/admin/assets`) a
single, searchable, tagged library of composition ideas, effects, and 3D
scene references that we want to eventually port into real components.

## What's in it

39 source images (~90 MB total) sitting on the maintainer's desktop
(`~/Desktop/Za Protos Web/`), each fully decomposed into its constituent
components / effects. **Almost every image is a mood-board grid** — a single
PNG can hold 12 different loading spinners or 8 hero backgrounds — so the
manifest tracks every sub-component individually, not just the file.

Rough counts:

| Group          | Files | Component slots (approx.) |
| -------------- | ----: | ------------------------: |
| hero           |     6 |                        40 |
| background     |     3 |                        36 |
| cards          |     4 |                        44 |
| icons          |     4 |                        26 |
| ui-controls    |     5 |                        43 |
| forms          |     3 |                        18 |
| about          |     1 |                         8 |
| services       |     1 |                         8 |
| blog           |     1 |                         8 |
| loading        |     2 |                        17 |
| motion         |     4 |                        44 |
| cursors        |     2 |                        24 |
| inspiration    |     2 |                        10 |
| **Total**      |  **39** |                    **>320** |

Exact per-image decomposition (with the target Protos-Web files) lives in
[`scripts/visual-references-manifest.mjs`](../scripts/visual-references-manifest.mjs).

## Data flow

```
~/Desktop/Za Protos Web/*.png
       │
       │  scripts/upload-visual-references.mjs
       ▼
Supabase Storage: admin-uploads/visual-references/<slug>.<ext>
       │
       │  same script upserts one row per file
       ▼
Supabase table: public.admin_assets
       │  category         = 'image'
       │  is_published     = false
       │  tags             = ['visual-reference', <group>, ...]
       │  metadata.components = [{name, note?}, ...]
       │  metadata.protos_web_targets = ['src/...','src/...']
       ▼
Admin panel: /admin/assets  →  filter by tag "visual-reference"
```

## Running the upload

Prereqs: `SUPABASE_SERVICE_ROLE_KEY` (bucket is private, RLS lets only the
service role write) and `NEXT_PUBLIC_SUPABASE_URL`.

```bash
# from the Protos-Web root, using the value currently in Vercel
export NEXT_PUBLIC_SUPABASE_URL="https://laqnnzavwbojntfiqmxj.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."   # or the legacy service_role JWT

npm run upload:visual-references
```

Optional overrides:

| Env var                          | Default                                | Notes                                    |
| -------------------------------- | -------------------------------------- | ---------------------------------------- |
| `VISUAL_REFERENCES_DIR`          | `~/Desktop/Za Protos Web`              | Where to read the PNGs from.             |
| `VISUAL_REFERENCES_UPLOADED_BY`  | `protos-agent`                         | Written to `admin_assets.uploaded_by`.   |

The script is **idempotent**: it upserts on `storage_path`, so re-running
after tweaking `visual-references-manifest.mjs` refreshes metadata without
duplicating rows.

Stale service-role keys are demoted to `WARN` instead of failing the run
(same pattern as `upload-showcase-assets.mjs`) — rotate the key when
convenient and re-run.

## Consuming it in the admin panel

Open `/admin/assets`. The "visual-reference" tag lights the whole library
up; per-group tags (`hero`, `cards`, `motion`, ...) narrow it down. Each
asset carries its own component list under `metadata.components`, so
clicking through will reveal what's inside (e.g. 12 loading spinners in one
image).

## Adding new reference images

1. Drop the file into `~/Desktop/Za Protos Web/`.
2. Add a new entry to `scripts/visual-references-manifest.mjs` with:
   - `filename` (exact),
   - `slug` (kebab-case, unique),
   - `group` (one of the existing ones or a new bucket),
   - `components` — one object per distinct sub-element inside the image,
   - `protosWebTargets` — files you'd wire this into.
3. Re-run `npm run upload:visual-references`.

The extra sanity block at the end of the script prints any on-disk file
that is not yet in the manifest, so you always know what's still
untracked.
