'use client'

import { create } from 'zustand'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  createdAt: number
  ttlMs: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: {
    title: string
    description?: string
    type?: ToastType
    ttlMs?: number
  }) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

const DEFAULT_TTL_MS = 5000

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: ({ title, description, type = 'info', ttlMs = DEFAULT_TTL_MS }) => {
    const id = newId()
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id, title, description, type, ttlMs, createdAt: Date.now() },
      ],
    }))
    if (ttlMs > 0 && typeof window !== 'undefined') {
      window.setTimeout(() => get().removeToast(id), ttlMs)
    }
    return id
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}))

/**
 * Ergonomic shortcuts for imperative toast calls from any client component,
 * server action response handler, or event listener.
 *
 *   import { toast } from '@/lib/stores/toast-store'
 *   toast.success('Spremljeno', 'API ključ pohranjen')
 */
export const toast = {
  info: (title: string, description?: string, ttlMs?: number) =>
    useToastStore.getState().addToast({ title, description, type: 'info', ttlMs }),
  success: (title: string, description?: string, ttlMs?: number) =>
    useToastStore.getState().addToast({ title, description, type: 'success', ttlMs }),
  warning: (title: string, description?: string, ttlMs?: number) =>
    useToastStore.getState().addToast({ title, description, type: 'warning', ttlMs }),
  error: (title: string, description?: string, ttlMs?: number) =>
    useToastStore.getState().addToast({
      title,
      description,
      type: 'error',
      ttlMs: ttlMs ?? 8000,
    }),
}
