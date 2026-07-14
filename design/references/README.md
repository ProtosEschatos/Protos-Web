# Protos Web — Design Element Library

> Trajna biblioteka dizajn elemenata / inspiracije za Protos Web.
> **Dostupna na dva mjesta:**
> 1. **Ovaj repo** (`design/references/`) + Cursor pravilo `.cursor/rules/protos-web.mdc` → AI uvijek ima kontekst.
> 2. **Supabase** — Storage bucket `design-assets` + tablica `public.design_elements` (metapodaci).

---

## Vizualni jezik (design language)

Protos Web = **cosmic / neon / glassmorphism** na tamnoj podlozi.

| Token | Vrijednost | Uloga |
|-------|-----------|-------|
| `--dark` | `#0a0a1a` | Osnovna pozadina (svemir) |
| `--dark-card` | `#0f0f2a` | Kartice / paneli |
| `--primary` | `#ff6600` | Brand naglasak (sunset narančasta) |
| `--secondary` | `#8b5cf6` | Ljubičasta (neon) |
| `--accent` | `#06b6d4` | Cyan (neon) |
| `--light` | `#e8e8f0` | Tekst |
| `--light-muted` | `#8888aa` | Sekundarni tekst |

**Neon paleta za efekte:** cyan `#22d3ee`, plava `#3b82f6`, ljubičasta `#a855f7`, magenta `#ec4899`, neon zelena `#39ff9e`.

**Principi:**
- Tamna svemirska podloga + glassmorphism paneli (blur, tanki svijetli rub `rgba(255,255,255,0.08)`).
- Glow / neon rubovi i sjene umjesto tvrdih linija.
- Animacije samo na `opacity` + `transform` (vidi `.cursor/rules/protos-web.mdc`).
- 3D prostor ide u R3F (`src/components/three/**`), UI chrome u DOM.

---

## Kako dodati slike

1. **Board screenshotovi** (cijele ploče iz inspiracije) → spremi u `design/references/boards/` s imenom kao u tablici ispod (`source_board`), npr. `boards/buttons.png`.
2. **Pojedinačni elementi** (izrezani) → `design/references/elements/<kategorija>/<name>.png`.
3. Za Supabase: uploadaj u bucket `design-assets` (isti path), pa upiši `storage_path` + `image_url` u red tablice `design_elements`.

> Napomena: chat-priložene slike se ne spremaju automatski na disk — treba ih ručno dropnuti u gornje foldere (ili u Storage).

---

## Katalog (kategorije i elementi)

Svaki red u tablici `public.design_elements` ima: `category`, `name`, `description`, `source_board`, `tags`, `storage_path`, `image_url`.

### 1. `text-animations` — animacije naslova/teksta
`fade_up`, `slide_from_left`, `character_stagger`, `word_reveal`, `scale_pop`, `rotate_in`, `glitch_reveal`, `wave_animation`, `type_writer`, `split_reveal`, `blur_to_focus`, `gradient_sweep`

### 2. `scroll-animations` — okidači na scroll
`fade_up`, `stagger_appear`, `parallax_layers`, `rotate_in`, `scale_reveal`, `slide_from_sides`, `morph_shapes`, `progress_indicators`, `number_counter`, `text_reveal`, `image_zoom`, `timeline_animation`

### 3. `page-transitions` — prijelazi sadržaja/stranica
`slide_from_right`, `fade_with_scale`, `curtain_reveal`, `rotation_flip`, `liquid_morph`, `glitch_effect`, `particle_dissolve`, `zoom_blur`, `wipe_with_glow`, `cube_transition`, `ripple_effect`, `shutter_split`

### 4. `card-layouts` — glassmorphism grid rasporedi
`standard_grid`, `masonry`, `featured_grid`, `horizontal_scroll`, `staggered_grid`, `asymmetric`, `carousel_cards`, `stacked_cards`, `timeline_cards`, `two_column_mix`, `grid_with_sidebar`, `infinite_scroll`

### 5. `card-hover` — hover efekti kartica
`lift_with_shadow`, `tilt_3d`, `expand_borders`, `particle_burst`, `glow_pulse`, `frosted_glass_spread`, `flip_card`, `scale_with_blur`, `shine_effect`, `magnetic_pull`, `liquid_spread`, `neon_border`, `glass_crack`, `hologram_glitch`, `rotation_orbit`, `gradient_shift`, `neon_outline_pulse`

### 6. `card-hover-themes` — tematizirani hover setovi
`crimson_lift`, `emerald_tilt`, `ocean_float`, `galaxy_expand`, `sunset_glow`, `ice_frost`, `matrix_scan`, `neon_pulse`, `magnetic_attract`, `particle_trail`

### 7. `card-bg-textures` — teksture pozadine kartica
`neon_laser_grid`, `quantum_particle_field`, `metallic_accordion`, `holographic_data_stream`, `crystalline_ice`, `flowing_lava_plasma`, `geometric_mandala`, `glitch_hologram`

### 8. `hero-backgrounds` — hero pozadine
`hero_space_bg`, `wave_background`, `grid_perspective`, `aurora_hero`, `constellation_bg`, `floating_shapes`, `mesh_gradient`, `tunnel_grid`, `neon_tunnel`, `network_constellation`, `volcano_sunset`, `matrix_grid`, `purple_galaxy`, `aurora_ice`, `lightning`, `teal_particles`

### 9. `animated-bg-patterns` — animirani body patterni
`particle_field`, `grid_lines`, `wave_gradient`, `geometric_shapes`, `dot_matrix`, `mesh_gradient`, `starfield`, `circuit_pattern`, `hexagon_tiles`, `aurora_borealis`, `liquid_metal`, `holographic_grid`

### 10. `lighting-backgrounds` — dramatično osvjetljenje
`spotlight`, `glow_orbs`, `light_rays`, `neon_glow`, `lens_flare`, `rim_light`, `ambient_glow`, `point_lights`, `gradient_glow`, `reflection_light`, `caustics`, `aurora_lights`

### 11. `parallax-layers` — slojevi za parallax scene
`far_background`, `mid_background`, `foreground`, `overlay`, `floating_shapes`, `light`, `grid`, `particle`, `blur`, `shadow`, `glow`, `detail`

### 12. `buttons` — stilovi gumba
`primary_cta`, `glass`, `chrome`, `holographic`, `hover_effect`, `pulse_animation`, `raised_3d`, `pill`

### 13. `navigation` — navigacijske komponente
`glass_navbar`, `neon_tabs`, `nav_menu_3d`, `holographic_sidebar`, `progress_bar`, `hamburger_menu`, `breadcrumbs`, `dock_menu`

### 14. `modals` — modali/popupi
`glass_modal`, `dark_overlay`, `holographic_frame`, `float_card`, `neon_border`, `pattern_overlay`, `particle_backdrop`, `liquid_popup`

### 15. `logo-treatments` — obrade logotipa
`logo_container`, `circular_badge`, `square_plate`, `neon_outline`, `embossed_3d`, `floating_logo`, `logo_reveal`, `watermark`

### 16. `icon-badges` — okviri/podloge ikona
`icon_badge`, `glass_icon_bg`, `metallic_badge`, `holographic_ring`, `burst_effect`, `hex_badge`, `platform_icon`, `orbital_frame`

### 17. `dividers` — 3D separatori sekcija
`transparent_glow_barrier`, `floating_geometric_separator`, `dynamic_waveform_divider`, `particle_flow_transition`, `holographic_section_break`, `digital_transition_graphic`, `metallic_zigzag_separator`, `curved_metallic_divider`

### 18. `service-icons` — ikone usluga
`web_development`, `mobile_apps`, `e_commerce`, `ui_ux_design`, `seo_marketing`, `consulting`, `service_card_bg`, `pricing_table_bg`, `email_marketing`, `seo`, `responsive_design`, `web_hosting`, `ssl_security`, `analytics`

### 19. `blog-ui` — elementi bloga
`featured_post_card_bg`, `blog_thumbnail_frame`, `category_badge_tech`, `category_badge_design`, `category_badge_business`, `author_avatar_frame`, `reading_time_icon`, `share_button_set`

### 20. `about-assets` — About stranica
`team_member_card_3d`, `company_values_icon`, `mission_icon`, `vision_icon`, `achievement_badge`, `certification_badge`, `timeline_connector`, `about_hero_bg`

### 21. `process-assets` — Proces / faze
`animated_rotating_logo`, `floating_particle_overlay`, `discovery_phase`, `design_phase`, `development_phase`, `launch_phase`, `ai_academy`

### 22. `loaders` — loaderi / progress
`flame_ring`, `vine_bar`, `wave_loader`, `orbit_loader`, `hourglass`, `snowflake`, `matrix_percent`, `dna_helix`, `morph_shapes`, `plasma_globe`, `skeleton_loader`, `holographic_connection`

### 23. `admin-assets` — privatni admin panel
`mystical_knight_mark` — neon glass sahovski konj (watermark pozadina `/admin`)

---

## Sinkronizacija repo ↔ Supabase

- Metapodaci (kategorija/naziv/tagovi) žive u obje verzije; **repo katalog je izvor istine** za popis.
- Kad dodaš/uploadaš sliku: upiši `storage_path` + `image_url` u red `design_elements` (preko Supabase dashboarda ili MCP-a).
- Migracije: `supabase/migrations/*_design_elements_library.sql` (shema) + `*_seed_design_elements.sql` (metapodaci).
