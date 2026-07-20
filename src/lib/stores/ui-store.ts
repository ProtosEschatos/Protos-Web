'use client'

import { create } from 'zustand'

/**
 * Global UI state that lives outside the React tree.
 *
 * Keep this store lean — a place for cross-component UI signals that don't
 * belong in URL/route state or component-local state. Anything server-rendered
 * or user-scoped belongs elsewhere (Supabase, cookies, route params).
 */
interface UIState {
  mobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleMobileMenu: () => void

  transitioning: boolean
  setTransitioning: (value: boolean) => void

  consentAcknowledged: boolean
  acknowledgeConsent: () => void
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  transitioning: false,
  setTransitioning: (value) => set({ transitioning: value }),

  consentAcknowledged: false,
  acknowledgeConsent: () => set({ consentAcknowledged: true }),
}))
