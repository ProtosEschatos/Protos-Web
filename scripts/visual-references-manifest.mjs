/**
 * Visual-references manifest.
 *
 * One entry per PNG/JPG in `~/Desktop/Za Protos Web/` (or wherever
 * VISUAL_REFERENCES_DIR points). Each entry decomposes the image into the
 * individual UI components / effects that live inside it, because most of
 * these screenshots are composite mood-boards (a single 4×3 grid can hold
 * 12 different loading spinners, for example).
 *
 * Consumed by:
 *   - scripts/upload-visual-references.mjs
 *   - .github/workflows/upload-visual-references.yml
 *
 * Storage layout in Supabase:
 *   bucket   : admin-uploads
 *   path     : visual-references/<slug>.<ext>
 *   metadata : { components: [...], protos_web_targets: [...], source: ... }
 *   tags     : ['visual-reference', <group>, ...componentSlugs]
 *
 * All entries are inserted as `is_published = false` — internal reference
 * library only, never surfaced on the public site.
 */

/**
 * @typedef {Object} ComponentRef
 * @property {string} name        Short human-readable name
 * @property {string} [note]      Optional visual detail
 */

/**
 * @typedef {Object} VisualReferenceEntry
 * @property {string}         filename       Exact filename on disk
 * @property {string}         slug           Storage slug (kebab-case, no ext)
 * @property {string}         label          Short admin-panel label
 * @property {string}         group          High-level bucket (hero, cards, icons, forms, ...)
 * @property {string[]}       tags           Extra tags in addition to ['visual-reference', group]
 * @property {ComponentRef[]} components     Individual components / effects inside the image
 * @property {string[]}       protosWebTargets  Where these could plug into Protos-Web
 */

/** @type {VisualReferenceEntry[]} */
export const VISUAL_REFERENCES = [
  // ─── HERO / BACKGROUND SCENES ────────────────────────────────────────────
  {
    filename: 'hero-header-backgrounds-set.png',
    slug: 'hero-header-backgrounds-set',
    label: 'Hero backgrounds — 8-pack',
    group: 'hero',
    tags: ['backgrounds', 'multi-component'],
    components: [
      { name: 'Hero Space BG', note: 'deep-space starfield + nebula glow' },
      { name: 'Wave Background', note: 'flowing gradient waves cyan → magenta' },
      { name: 'Grid Perspective', note: 'infinite floor grid vanishing to horizon' },
      { name: 'Aurora Hero', note: 'northern-lights ribbons over dark' },
      { name: 'Constellation BG', note: 'connected-dot star network' },
      { name: 'Floating Shapes', note: 'isometric 3D cubes / pyramids / spheres' },
      { name: 'Mesh Gradient', note: 'soft blurred multicolour blobs' },
      { name: 'Tunnel Grid', note: 'first-person tunnel of neon rings' },
    ],
    protosWebTargets: [
      'src/components/three/backgrounds/HomeBackground.tsx',
      'src/components/three/backgrounds/ServicesBackground.tsx',
      'src/components/three/backgrounds/ContactBackground.tsx',
    ],
  },
  {
    filename: 'homepage-hero-pack-ice-blue.png',
    slug: 'homepage-hero-pack-ice-blue',
    label: 'Homepage hero pack — ice-blue',
    group: 'hero',
    tags: ['icons', 'phases', 'multi-component'],
    components: [
      { name: 'Animated rotating globe/logo', note: 'wireframe planet + 3 orbits' },
      { name: 'Aurora borealis hero background' },
      { name: 'Floating particle overlay', note: 'bokeh over dark' },
      { name: 'Discovery phase icon', note: 'lightbulb with circuit board filament' },
      { name: 'Design phase icon', note: 'colour palette fan swatches' },
      { name: 'Development phase icon', note: 'glass code window <div><h1>' },
      { name: 'Launch phase icon', note: 'chrome rocket + sparkle stars' },
      { name: 'AI Academy icon', note: 'hex badge with neural node graph' },
    ],
    protosWebTargets: [
      'src/components/features/home/ProcessTimeline.tsx',
      'src/components/features/services/ServicesGrid.tsx',
    ],
  },
  {
    filename: 'cosmic-hero-background.png',
    slug: 'cosmic-hero-background',
    label: 'Cosmic hero — nodes + spheres',
    group: 'hero',
    tags: ['background', 'composite-scene'],
    components: [
      { name: 'Floating translucent spheres' },
      { name: 'Connected-node network', note: 'nodes + tension lines' },
      { name: 'Geometric wireframe shapes' },
      { name: 'Grid perspective floor' },
      { name: 'Starfield with nebula' },
    ],
    protosWebTargets: [
      'src/components/three/backgrounds/HomeBackground.tsx',
      'src/components/three/backgrounds/AboutBackground.tsx',
    ],
  },
  {
    filename: 'hero-backgrounds-new-palettes.png',
    slug: 'hero-backgrounds-new-palettes',
    label: 'Hero palettes — 6 variants',
    group: 'hero',
    tags: ['palettes', 'multi-component'],
    components: [
      { name: 'Fire / volcano sunset palette' },
      { name: 'Matrix green grid palette' },
      { name: 'Purple nebula galaxy palette' },
      { name: 'Aurora ice mountains palette' },
      { name: 'Yellow lightning storm palette' },
      { name: 'Teal cosmic trails palette' },
    ],
    protosWebTargets: [
      'src/lib/showcase/palette.ts',
      'src/components/three/backgrounds/*',
    ],
  },
  {
    filename: 'wireframe-portal-background.png',
    slug: 'wireframe-portal-background',
    label: 'Wireframe portal / wormhole',
    group: 'hero',
    tags: ['background', 'scene'],
    components: [
      { name: 'Concentric neon rings' },
      { name: 'Perspective wireframe grid' },
      { name: 'Floating translucent bubbles' },
      { name: 'Starfield / nebula backdrop' },
      { name: 'Central singularity glow' },
    ],
    protosWebTargets: [
      'src/components/three/backgrounds/PortalBackground.tsx (new)',
      'src/components/features/home/HeroSection.tsx',
    ],
  },
  {
    filename: 'Ultra-dynamic_3D_abstract_geometric_shapes_morphin-1783481047770.png',
    slug: 'geometric-shapes-morphing',
    label: 'Neon wireframe polyhedra swarm',
    group: 'hero',
    tags: ['background', 'scene', 'r3f-inspiration'],
    components: [
      { name: 'Wireframe cube swarm' },
      { name: 'Wireframe octahedron / tetrahedron / icosahedron' },
      { name: 'Rainbow neon edge glow' },
      { name: 'Motion blur streaks' },
      { name: 'Volumetric light shafts' },
    ],
    protosWebTargets: [
      'src/components/three/backgrounds/*',
      'src/components/features/admin/ConfiguratorScene.tsx',
    ],
  },

  // ─── LIGHTING / BACKGROUND PATTERNS ─────────────────────────────────────
  {
    filename: 'light-effects-backgrounds.png',
    slug: 'light-effects-backgrounds',
    label: 'Dramatic lighting effects — 12-pack',
    group: 'background',
    tags: ['lighting', 'multi-component'],
    components: [
      { name: 'Spotlight' }, { name: 'Glow orbs' }, { name: 'Light rays' },
      { name: 'Neon glow corridor' }, { name: 'Lens flare' }, { name: 'Rim light silhouette' },
      { name: 'Ambient glow' }, { name: 'Point lights bokeh' }, { name: 'Gradient glow' },
      { name: 'Reflection light (water)' }, { name: 'Caustics' }, { name: 'Aurora lights' },
    ],
    protosWebTargets: [
      'src/components/three/lighting/* (new)',
      'src/components/three/backgrounds/*',
    ],
  },
  {
    filename: 'animated-background-patterns.png',
    slug: 'animated-background-patterns',
    label: 'Animated BG patterns — 12-pack',
    group: 'background',
    tags: ['patterns', 'multi-component'],
    components: [
      { name: 'Particle field' }, { name: 'Grid lines' }, { name: 'Wave gradient' },
      { name: 'Geometric shapes' }, { name: 'Dot matrix' }, { name: 'Mesh gradient' },
      { name: 'Starfield' }, { name: 'Circuit pattern' }, { name: 'Hexagon tiles' },
      { name: 'Aurora borealis' }, { name: 'Liquid metal' }, { name: 'Holographic grid' },
    ],
    protosWebTargets: [
      'src/components/three/backgrounds/*',
      'src/components/ui/PatternOverlay.tsx (new)',
    ],
  },
  {
    filename: 'parallax-layer-elements.png',
    slug: 'parallax-layer-elements',
    label: 'Parallax layer stack — 12 layers',
    group: 'background',
    tags: ['parallax', 'multi-component'],
    components: [
      { name: 'Far background' }, { name: 'Mid background' }, { name: 'Foreground' },
      { name: 'Overlay layer' }, { name: 'Floating shapes layer' }, { name: 'Light layer' },
      { name: 'Grid layer' }, { name: 'Particle layer' }, { name: 'Blur layer' },
      { name: 'Shadow layer' }, { name: 'Glow layer' }, { name: 'Detail layer' },
    ],
    protosWebTargets: [
      'src/components/three/backgrounds/*',
      'src/components/features/home/HeroSection.tsx',
    ],
  },

  // ─── CARDS: 3D EFFECTS + HOVER STATES + GRID LAYOUTS ────────────────────
  {
    filename: 'card-3d-effects-mega-pack.png',
    slug: 'card-3d-effects-mega-pack',
    label: 'Card 3D effects — mega pack (16)',
    group: 'cards',
    tags: ['3d-effects', 'multi-component'],
    components: [
      { name: 'Lift with shadow' }, { name: '3D tilt (perspective)' }, { name: 'Expand borders' },
      { name: 'Particle burst' }, { name: 'Glow pulse' }, { name: 'Frosted glass spread' },
      { name: 'Flip card' }, { name: 'Scale with blur' }, { name: 'Shine effect' },
      { name: 'Magnetic pull' }, { name: 'Liquid spread' }, { name: 'Parallax layers' },
      { name: 'Neon border' }, { name: 'Glass crack' }, { name: 'Hologram glitch' },
      { name: 'Rotation orbit' },
    ],
    protosWebTargets: [
      'src/components/ui/Card.tsx',
      'src/components/features/services/ServiceCard.tsx',
      'src/components/features/portfolio/PortfolioCard.tsx',
    ],
  },
  {
    filename: 'card-hover-effects-showcase.png',
    slug: 'card-hover-effects-showcase',
    label: 'Card hover before/after — 8 pairs',
    group: 'cards',
    tags: ['hover-effects', 'multi-component'],
    components: [
      { name: 'Lift-off shadow & glow' },
      { name: '3D tilt perspective' },
      { name: 'Expanding border' },
      { name: 'Particle burst effect' },
      { name: 'Gradient shift animation' },
      { name: 'Scale & blur background' },
      { name: 'Neon outline pulse' },
      { name: 'Glass crack effect reveal' },
    ],
    protosWebTargets: [
      'src/components/ui/Card.tsx',
      'src/styles/card-hover.css (new)',
    ],
  },
  {
    filename: 'hover-effects-showcase.png',
    slug: 'hover-effects-showcase',
    label: 'Card hover FX — 12 palettes',
    group: 'cards',
    tags: ['hover-effects', 'palettes', 'multi-component'],
    components: [
      { name: 'Crimson lift' }, { name: 'Emerald tilt' }, { name: 'Ocean float' },
      { name: 'Galaxy expand' }, { name: 'Sunset glow' }, { name: 'Ice frost' },
      { name: 'Matrix scan' }, { name: 'Neon pulse' }, { name: 'Hologram glitch' },
      { name: 'Magnetic attract' }, { name: 'Liquid spread' }, { name: 'Particle trail' },
    ],
    protosWebTargets: [
      'src/components/ui/Card.tsx',
      'src/lib/showcase/palette.ts',
    ],
  },
  {
    filename: 'card-grid-layouts.png',
    slug: 'card-grid-layouts',
    label: 'Glassmorphism card grids — 12 layouts',
    group: 'cards',
    tags: ['layouts', 'multi-component'],
    components: [
      { name: 'Standard grid' }, { name: 'Masonry layout' }, { name: 'Featured + grid' },
      { name: 'Horizontal scroll' }, { name: 'Staggered grid' }, { name: 'Asymmetric layout' },
      { name: 'Carousel cards' }, { name: 'Stacked cards' }, { name: 'Timeline cards' },
      { name: 'Two-column mix' }, { name: 'Grid with sidebar' }, { name: 'Infinite scroll' },
    ],
    protosWebTargets: [
      'src/components/features/portfolio/PortfolioGrid.tsx',
      'src/components/features/blog/BlogGrid.tsx',
      'src/components/features/services/ServicesGrid.tsx',
    ],
  },

  // ─── ICONS / BADGES / LOGO CONTAINERS ───────────────────────────────────
  {
    filename: 'icon-badge-backgrounds_ac3ae3a8.png',
    slug: 'icon-badge-backgrounds',
    label: 'Icon / badge backgrounds — 8 shapes',
    group: 'icons',
    tags: ['badges', 'multi-component'],
    components: [
      { name: 'Icon badge (cyan star hex)' },
      { name: 'Glass icon BG (bubble)' },
      { name: 'Metallic badge (silver coin)' },
      { name: 'Holographic ring' },
      { name: 'Burst effect (particle spray)' },
      { name: 'Hex badge (purple magenta)' },
      { name: 'Platform icon (pedestal)' },
      { name: 'Orbital frame (concentric)' },
    ],
    protosWebTargets: [
      'src/components/ui/Badge.tsx',
      'src/components/ui/IconContainer.tsx (new)',
    ],
  },
  {
    filename: 'service-card-icons.png',
    slug: 'service-card-icons',
    label: 'Service card icons — 6 + heading',
    group: 'icons',
    tags: ['services', 'multi-component'],
    components: [
      { name: 'Web Development icon' },
      { name: 'UI/UX Design icon' },
      { name: 'SEO Optimization icon' },
      { name: 'Performance icon' },
      { name: 'Responsive Design icon' },
      { name: '“What we offer” heading treatment' },
    ],
    protosWebTargets: [
      'src/components/features/services/ServicesGrid.tsx',
      'src/lib/services/service-catalog.ts',
    ],
  },
  {
    filename: 'blog-category-icons.png',
    slug: 'blog-category-icons',
    label: 'Blog category icons — 6',
    group: 'icons',
    tags: ['blog', 'categories', 'multi-component'],
    components: [
      { name: 'Email Marketing icon' },
      { name: 'SEO icon' },
      { name: 'Responsive Design icon' },
      { name: 'Web Hosting icon' },
      { name: 'SSL Security icon' },
      { name: 'Analytics icon' },
    ],
    protosWebTargets: [
      'src/components/features/blog/BlogCategoryTag.tsx',
      'src/messages/*/blog.json (category labels)',
    ],
  },
  {
    filename: 'pricing-components-set.png',
    slug: 'logo-containers-set',
    label: 'Logo containers / badge frames — 8',
    group: 'icons',
    tags: ['branding', 'logo-containers', 'multi-component'],
    components: [
      { name: 'Logo container (holo frame)' },
      { name: 'Circular badge (metallic B)' },
      { name: 'Square plate (chrome L)' },
      { name: 'Neon outline (Twitter shield)' },
      { name: '3D embossed (H coin)' },
      { name: 'Floating logo (M + particles)' },
      { name: 'Logo reveal (R burst rays)' },
      { name: 'Watermark (iridescent star)' },
    ],
    protosWebTargets: [
      'src/components/ui/LogoBadge.tsx (new)',
      'src/components/layout/Footer.tsx (partner logos)',
    ],
  },

  // ─── BUTTONS / CTA / NAV / FORMS ────────────────────────────────────────
  {
    filename: 'buttons-cta-set.png',
    slug: 'buttons-cta-set',
    label: 'Buttons / CTAs — 10 variants',
    group: 'ui-controls',
    tags: ['buttons', 'multi-component'],
    components: [
      { name: 'Primary CTA (solid blue)' },
      { name: 'Glass button (frosted)' },
      { name: 'Chrome button (small)' },
      { name: 'Holographic (small)' },
      { name: 'Chrome large' },
      { name: 'Holographic large' },
      { name: 'Hover effect (particle burst)' },
      { name: 'Pulse animation (neon ring)' },
      { name: '3D raised' },
      { name: 'Pill button (neon underline)' },
    ],
    protosWebTargets: [
      'src/components/ui/Button.tsx',
      'src/styles/button-variants.css (new)',
    ],
  },
  {
    filename: 'navigation-ui-set.png',
    slug: 'navigation-ui-set',
    label: 'Navigation UI — 8 components',
    group: 'ui-controls',
    tags: ['navigation', 'multi-component'],
    components: [
      { name: 'Glass navbar' },
      { name: 'Neon tabs' },
      { name: '3D nav menu (isometric stack)' },
      { name: 'Holographic sidebar' },
      { name: 'Progress bar (particle trail)' },
      { name: 'Hamburger menu (neon)' },
      { name: 'Breadcrumbs (chevron chain)' },
      { name: 'Dock menu (bottom mobile)' },
    ],
    protosWebTargets: [
      'src/components/layout/Header.tsx',
      'src/components/features/admin/AdminSidebar.tsx',
      'src/components/features/admin/AdminHeader.tsx',
    ],
  },
  {
    filename: 'Collection_of_6_animated_hamburger_menu_icon_desig-1783480992032.png',
    slug: 'hamburger-menu-styles',
    label: 'Animated hamburger menu — 6 styles',
    group: 'ui-controls',
    tags: ['hamburger', 'menu', 'multi-component'],
    components: [
      { name: 'Liquid morphing (chrome mercury)' },
      { name: 'Neon glow (electric arcs)' },
      { name: 'Origami paper fold' },
      { name: 'Particle explosion' },
      { name: 'Glitch corruption' },
      { name: 'Fire magic (flame lines)' },
    ],
    protosWebTargets: [
      'src/components/layout/MobileMenuButton.tsx',
      'src/components/layout/Header.tsx',
    ],
  },
  {
    filename: 'contact-form-field-elements.png',
    slug: 'contact-form-field-elements',
    label: 'Contact form — glass 3D fields',
    group: 'forms',
    tags: ['contact-form', 'composite'],
    components: [
      { name: 'Frosted glass panel' },
      { name: 'Neon input (Your Name)' },
      { name: 'Neon input (Email)' },
      { name: 'Neon textarea (Message)' },
      { name: 'Submit arrow (chrome→neon)' },
      { name: 'Orbital particle trail effect' },
      { name: 'Floating 3D geometry (cubes, spheres)' },
    ],
    protosWebTargets: [
      'src/components/features/contact/ContactForm.tsx',
    ],
  },
  {
    filename: 'Cosmic_particle_constellation_contact_form_with_co-1783480941796.png',
    slug: 'contact-form-constellation',
    label: 'Contact form — constellation particle',
    group: 'forms',
    tags: ['contact-form', 'composite'],
    components: [
      { name: '“SEND A MESSAGE” heading' },
      { name: 'Name field (constellation-lined)' },
      { name: 'Email field (constellation-lined)' },
      { name: 'Message textarea' },
      { name: 'Submit button (particle burst)' },
      { name: 'Star-constellation connector lines' },
    ],
    protosWebTargets: [
      'src/components/features/contact/ContactForm.tsx',
    ],
  },
  {
    filename: 'Dramatic_glass_material_contact_form_with_shatter_-1783481023631.png',
    slug: 'contact-form-glass-shatter',
    label: 'Contact form — glass shatter validation FX',
    group: 'forms',
    tags: ['contact-form', 'error-state', 'composite'],
    components: [
      { name: 'Glass Contact Us panel (frosted 3D)' },
      { name: 'Name field (glass)' },
      { name: 'Email field ERROR — red glow + shattered glass' },
      { name: 'Chromatic aberration prism refraction' },
      { name: 'Message field (glass)' },
      { name: 'Submit button (fingerprint touch)' },
    ],
    protosWebTargets: [
      'src/components/features/contact/ContactForm.tsx (error states)',
      'src/components/ui/FieldError.tsx (new)',
    ],
  },

  // ─── ABOUT / TEAM / COMPANY ────────────────────────────────────────────
  {
    filename: 'about-us-page-elements.png',
    slug: 'about-us-page-elements',
    label: 'About-us page — 8 elements',
    group: 'about',
    tags: ['about', 'team', 'multi-component'],
    components: [
      { name: '3D team member card (hex frame)' },
      { name: 'Company values icon (handshake)' },
      { name: 'Company mission (target burst)' },
      { name: 'Company vision (telescope)' },
      { name: 'Achievement badge (trophy + laurels)' },
      { name: 'Certification badge (ribbon check)' },
      { name: 'Company timeline connector (vertical)' },
      { name: 'About hero pattern (isometric city)' },
    ],
    protosWebTargets: [
      'src/app/[locale]/o-nama/page.tsx',
      'src/components/features/about/TeamGrid.tsx',
      'src/components/features/about/CompanyTimeline.tsx (new)',
    ],
  },

  // ─── SERVICES / BLOG COMPLETE KITS ─────────────────────────────────────
  {
    filename: 'services-page-complete-set.png',
    slug: 'services-page-complete-set',
    label: 'Services page — 6 categories + 2 frames',
    group: 'services',
    tags: ['services', 'multi-component'],
    components: [
      { name: 'Web Development (3D code editor)' },
      { name: 'Mobile Apps (3D phone)' },
      { name: 'E-Commerce (3D cart + items)' },
      { name: 'UI/UX Design (3D component browser)' },
      { name: 'SEO & Marketing (magnifier + chart + rocket)' },
      { name: 'Consulting (bulb + strategy map)' },
      { name: 'Service card background frame' },
      { name: 'Pricing table background (3-col)' },
    ],
    protosWebTargets: [
      'src/components/features/services/ServicesGrid.tsx',
      'src/lib/services/service-catalog.ts',
      'src/components/features/pricing/PricingTable.tsx (new)',
    ],
  },
  {
    filename: 'blog-page-complete-kit.png',
    slug: 'blog-page-complete-kit',
    label: 'Blog page — 8 elements',
    group: 'blog',
    tags: ['blog', 'multi-component'],
    components: [
      { name: 'Featured post card background' },
      { name: 'Blog post thumbnail frame' },
      { name: 'TECH category badge (hex chip)' },
      { name: 'DESIGN category badge (palette)' },
      { name: 'BUSINESS category badge (briefcase + chart)' },
      { name: 'Author avatar frame (neon ring)' },
      { name: 'Reading-time icon (book + clock)' },
      { name: 'Share button set (FB/TW/LI)' },
    ],
    protosWebTargets: [
      'src/components/features/blog/BlogCard.tsx',
      'src/components/features/blog/BlogPostMeta.tsx',
      'src/components/features/blog/BlogShareButtons.tsx (new)',
    ],
  },

  // ─── LOADING / SKELETON / TRANSITION / TEXT / DIVIDERS ────────────────
  {
    filename: 'loading-orbital-globe.png',
    slug: 'loading-orbital-globe',
    label: 'Loading — orbital globe holographic',
    group: 'loading',
    tags: ['loading', 'composite'],
    components: [
      { name: 'Holographic globe' },
      { name: '3 orbital rings' },
      { name: '68% arc progress' },
      { name: '“Establishing connection” caption' },
      { name: 'Starfield backdrop' },
    ],
    protosWebTargets: [
      'src/components/ui/Loader.tsx',
      'src/components/loading/GlobalLoader.tsx (new)',
    ],
  },
  {
    filename: 'loading-animations-complete.png',
    slug: 'loading-animations-complete',
    label: 'Loading animations — 12-pack',
    group: 'loading',
    tags: ['loading', 'multi-component'],
    components: [
      { name: 'Flame ring' }, { name: 'Leaf / DNA progress' }, { name: 'Water wave' },
      { name: 'Orbital planets' }, { name: 'Hourglass' }, { name: 'Snowflake' },
      { name: 'Matrix rain (75%)' }, { name: 'DNA helix' }, { name: 'Cube→sphere→pyramid morph' },
      { name: 'Particle person scatter' }, { name: 'Plasma sphere' }, { name: 'Skeleton UI' },
    ],
    protosWebTargets: [
      'src/components/ui/Loader.tsx',
      'src/components/ui/Skeleton.tsx',
    ],
  },
  {
    filename: 'text-animation-effects.png',
    slug: 'text-animation-effects',
    label: 'Text animations — 12 effects',
    group: 'motion',
    tags: ['text-fx', 'multi-component'],
    components: [
      { name: 'Fade up' }, { name: 'Slide from left' }, { name: 'Character stagger' },
      { name: 'Word reveal' }, { name: 'Scale pop' }, { name: 'Rotate in' },
      { name: 'Glitch reveal' }, { name: 'Wave animation' }, { name: 'Type writer' },
      { name: 'Split reveal' }, { name: 'Blur to focus' }, { name: 'Gradient sweep' },
    ],
    protosWebTargets: [
      'src/components/motion/AnimatedText.tsx (new)',
      'src/components/features/home/HeroSection.tsx',
    ],
  },
  {
    filename: 'transition-effects-library.png',
    slug: 'transition-effects-library',
    label: 'Transitions — 12 effects (palettes)',
    group: 'motion',
    tags: ['transitions', 'multi-component'],
    components: [
      { name: 'Slide from right (crimson)' },
      { name: 'Fade with scale (emerald)' },
      { name: 'Curtain reveal (ocean blue)' },
      { name: 'Rotation flip (galaxy purple)' },
      { name: 'Liquid morph (sunset orange)' },
      { name: 'Glitch effect (ice blue)' },
      { name: 'Particle dissolve (matrix green)' },
      { name: 'Zoom blur (royal purple)' },
      { name: 'Wipe with glow (neon yellow)' },
      { name: 'Cube transition (3D cube)' },
      { name: 'Ripple effect' },
      { name: 'Shutter split' },
    ],
    protosWebTargets: [
      'src/components/motion/PageTransition.tsx (new)',
      'src/app/[locale]/template.tsx',
    ],
  },
  {
    filename: 'scroll-animations-pack.png',
    slug: 'scroll-animations-pack',
    label: 'Scroll animations — 12 triggers',
    group: 'motion',
    tags: ['scroll', 'multi-component'],
    components: [
      { name: 'Fade up (scroll)' }, { name: 'Stagger appear' }, { name: 'Parallax layers' },
      { name: 'Rotate in' }, { name: 'Scale reveal' }, { name: 'Slide from sides' },
      { name: 'Morph shapes' }, { name: 'Progress indicators' }, { name: 'Number counter' },
      { name: 'Text reveal' }, { name: 'Image zoom' }, { name: 'Timeline animation' },
    ],
    protosWebTargets: [
      'src/components/motion/ScrollReveal.tsx (new)',
      'src/hooks/useScrollTrigger.ts (new)',
    ],
  },
  {
    filename: 'dividers-abstract-futuristic.png',
    slug: 'dividers-abstract-futuristic',
    label: 'Section dividers — 8 futuristic',
    group: 'ui-controls',
    tags: ['dividers', 'multi-component'],
    components: [
      { name: 'Neon laser grid perspective' },
      { name: 'Quantum particle field' },
      { name: 'Metallic accordion structure' },
      { name: 'Holographic data stream' },
      { name: 'Crystalline ice formation' },
      { name: 'Flowing lava / plasma wave' },
      { name: 'Geometric mandala pattern band' },
      { name: 'Glitch hologram divider' },
    ],
    protosWebTargets: [
      'src/components/ui/SectionDivider.tsx (new)',
    ],
  },
  {
    filename: 'transition-dividers-set-1.png',
    slug: 'transition-dividers-set-1',
    label: 'Transition dividers — 8 3D separators',
    group: 'ui-controls',
    tags: ['dividers', 'multi-component'],
    components: [
      { name: 'Transparent glow barrier (triangles)' },
      { name: 'Floating geometric separator (magenta)' },
      { name: 'Dynamic waveform divider' },
      { name: 'Particle flow transition' },
      { name: 'Holographic section break (numbered)' },
      { name: 'Digital transition graphic (stacked)' },
      { name: 'Metallic zigzag separator' },
      { name: 'Curved metallic divider' },
    ],
    protosWebTargets: [
      'src/components/ui/SectionDivider.tsx (new)',
    ],
  },

  // ─── MODALS / OVERLAYS ─────────────────────────────────────────────────
  {
    filename: 'modal-popup-overlays.png',
    slug: 'modal-popup-overlays',
    label: 'Modal / popup overlays — 8 styles',
    group: 'ui-controls',
    tags: ['modals', 'multi-component'],
    components: [
      { name: 'Glass modal' }, { name: 'Dark overlay' }, { name: 'Holographic frame' },
      { name: 'Float card' }, { name: 'Neon border' }, { name: 'Pattern overlay' },
      { name: 'Particle backdrop' }, { name: 'Liquid popup' },
    ],
    protosWebTargets: [
      'src/components/ui/Modal.tsx',
      'src/components/ui/Dialog.tsx',
    ],
  },

  // ─── CURSORS ────────────────────────────────────────────────────────────
  {
    filename: 'Futuristic_holographic_cursor_interface_elements_o-1783481154748.png',
    slug: 'cursors-holographic',
    label: 'Cursors — holographic interface (12)',
    group: 'cursors',
    tags: ['cursors', 'multi-component'],
    components: [
      { name: 'Default pointer' }, { name: 'Hand' }, { name: 'Text I-beam' },
      { name: 'Loading (holo globe)' }, { name: 'Targeting crosshair (hex)' },
      { name: 'Resize arrows' }, { name: 'Link (chain hand)' },
      { name: 'Grab (wireframe hand)' }, { name: 'Grabbed (fist)' },
      { name: 'Context menu' }, { name: 'Denied (X)' }, { name: 'Precision (radar)' },
    ],
    protosWebTargets: [
      'public/cursors/* (new)',
      'src/styles/globals.css (cursor variants)',
    ],
  },
  {
    filename: 'Liquid_metal_morphing_cursor_collection_with_chrom-1783481110803.png',
    slug: 'cursors-liquid-metal',
    label: 'Cursors — liquid metal (12)',
    group: 'cursors',
    tags: ['cursors', 'multi-component'],
    components: [
      { name: 'Default pointer' }, { name: 'Hand pointer' }, { name: 'Text I-beam' },
      { name: 'Loading' }, { name: 'Crosshair' }, { name: 'Resize arrows' },
      { name: 'Link hover' }, { name: 'Drag hand' }, { name: 'Precision dot' },
      { name: 'Zoom' }, { name: 'Context menu' }, { name: 'Denied' },
    ],
    protosWebTargets: [
      'public/cursors/liquid-metal/* (new)',
      'src/styles/globals.css',
    ],
  },

  // ─── GLITCH / TERMINAL ─────────────────────────────────────────────────
  {
    filename: 'Digital_glitch_data_corruption_transition_effect_-1783480895605.png',
    slug: 'glitch-terminal-transitions',
    label: 'Glitch terminal transitions — 8 stages',
    group: 'motion',
    tags: ['glitch', 'terminal', 'cyberpunk', 'multi-component'],
    components: [
      { name: 'Terminal boot (System Secure)' },
      { name: 'Glitch shift (colored bands)' },
      { name: 'Vertical corruption bars' },
      { name: 'Text overlay glitch' },
      { name: 'Pure noise pattern' },
      { name: '“Access granted / loading” terminal' },
      { name: '“Access granted” filename (module load)' },
      { name: '“Access granted” final (system ready)' },
    ],
    protosWebTargets: [
      'src/components/motion/GlitchTransition.tsx (new)',
      'src/components/features/admin/AdminLoginTransition.tsx (new)',
    ],
  },

  // ─── FANTASY / R3F INSPIRATION SCENES ─────────────────────────────────
  {
    filename: 'Magical_3D_fantasy_floating_islands_in_clouds_back-1783481038237.png',
    slug: 'fantasy-floating-islands',
    label: 'Fantasy — floating islands scene',
    group: 'inspiration',
    tags: ['glb-reference', 'fantasy', 'composite-scene'],
    components: [
      { name: 'Floating islands with waterfalls' },
      { name: 'Dragons in flight' },
      { name: 'Crystals / rocks' },
      { name: 'Chain bridges' },
      { name: 'Volumetric clouds' },
    ],
    protosWebTargets: [
      'GLB asset inspiration only (not for direct copy)',
      'src/components/features/admin/ConfiguratorScene.tsx',
    ],
  },
  {
    filename: 'Mesmerizing_3D_underwater_bioluminescent_ocean_dep-1783481061389.png',
    slug: 'fantasy-underwater-bioluminescent',
    label: 'Fantasy — underwater bioluminescent',
    group: 'inspiration',
    tags: ['glb-reference', 'fantasy', 'composite-scene'],
    components: [
      { name: 'Bioluminescent jellyfish' },
      { name: 'Glowing coral' },
      { name: 'God-ray light shafts' },
      { name: 'Rising bubbles' },
      { name: 'Squid / crabs' },
    ],
    protosWebTargets: [
      'GLB asset inspiration only (not for direct copy)',
      'src/components/features/admin/ConfiguratorScene.tsx',
    ],
  },
]

/** Total component / effect count across all entries. */
export const TOTAL_COMPONENT_COUNT = VISUAL_REFERENCES.reduce(
  (sum, entry) => sum + entry.components.length,
  0,
)
