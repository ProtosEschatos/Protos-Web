/**
 * Maps design_elements.source_board → primary board PNG from Desktop/Za Protos Web.
 * Extra boards are copied to boards/extras/.
 */
export const DESIGN_BOARD_MAP: Record<string, string> = {
  'about-assets': 'about-us-page-elements.png',
  'animated-bg-patterns': 'animated-background-patterns.png',
  'blog-ui': 'blog-page-complete-kit.png',
  buttons: 'buttons-cta-set.png',
  'card-bg-textures': 'card-3d-effects-mega-pack.png',
  'card-hover': 'card-hover-effects-showcase.png',
  'card-hover-themes': 'hover-effects-showcase.png',
  'card-layouts': 'card-grid-layouts.png',
  dividers: 'dividers-abstract-futuristic.png',
  'hero-backgrounds': 'cosmic-hero-background.png',
  'icon-badges': 'icon-badge-backgrounds_ac3ae3a8.png',
  'lighting-backgrounds': 'light-effects-backgrounds.png',
  loaders: 'loading-animations-complete.png',
  modals: 'modal-popup-overlays.png',
  navigation: 'navigation-ui-set.png',
  'page-transitions': 'transition-effects-library.png',
  'parallax-layers': 'parallax-layer-elements.png',
  'scroll-animations': 'scroll-animations-pack.png',
  'service-icons': 'service-card-icons.png',
  'text-animations': 'text-animation-effects.png',
}

/** Additional boards stored under boards/extras/ */
export const DESIGN_BOARD_EXTRAS = [
  'blog-category-icons.png',
  'contact-form-field-elements.png',
  'Cosmic_particle_constellation_contact_form_with_co-1783480941796.png',
  'Digital_glitch_data_corruption_transition_effect_-1783480895605.png',
  'Dramatic_glass_material_contact_form_with_shatter_-1783481023631.png',
  'Futuristic_holographic_cursor_interface_elements_o-1783481154748.png',
  'hero-backgrounds-new-palettes.png',
  'hero-header-backgrounds-set.png',
  'homepage-hero-pack-ice-blue.png',
  'Liquid_metal_morphing_cursor_collection_with_chrom-1783481110803.png',
  'loading-orbital-globe.png',
  'Magical_3D_fantasy_floating_islands_in_clouds_back-1783481038237.png',
  'Mesmerizing_3D_underwater_bioluminescent_ocean_dep-1783481061389.png',
  'pricing-components-set.png',
  'services-page-complete-set.png',
  'transition-dividers-set-1.png',
  'Ultra-dynamic_3D_abstract_geometric_shapes_morphin-1783481047770.png',
  'wireframe-portal-background.png',
  'Collection_of_6_animated_hamburger_menu_icon_desig-1783480992032.png',
]

/** Per-route page backdrop: hero + pattern + lighting board categories */
export const ROUTE_DESIGN_BACKGROUNDS: Record<
  string,
  { hero: string; pattern: string; lighting: string }
> = {
  home: {
    hero: 'hero-backgrounds',
    pattern: 'animated-bg-patterns',
    lighting: 'lighting-backgrounds',
  },
  about: {
    hero: 'about-assets',
    pattern: 'parallax-layers',
    lighting: 'lighting-backgrounds',
  },
  process: {
    hero: 'hero-backgrounds',
    pattern: 'scroll-animations',
    lighting: 'lighting-backgrounds',
  },
  portfolio: {
    hero: 'hero-backgrounds',
    pattern: 'animated-bg-patterns',
    lighting: 'parallax-layers',
  },
  services: {
    hero: 'service-icons',
    pattern: 'card-layouts',
    lighting: 'lighting-backgrounds',
  },
  blog: {
    hero: 'blog-ui',
    pattern: 'animated-bg-patterns',
    lighting: 'lighting-backgrounds',
  },
  contact: {
    hero: 'modals',
    pattern: 'parallax-layers',
    lighting: 'lighting-backgrounds',
  },
}
