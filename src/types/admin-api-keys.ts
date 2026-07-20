import type { AdminApiKeyProviderId } from '@/lib/config/api-key-providers'

export type AdminApiKeyEnvTarget = 'all' | 'production' | 'preview' | 'development'

/** Row shape returned to the client — never contains the plaintext or ciphertext. */
export type AdminApiKeyListItem = {
  id: string
  provider: AdminApiKeyProviderId | string
  label: string
  envTarget: AdminApiKeyEnvTarget
  maskedHint: string | null
  notes: string | null
  isActive: boolean
  lastUsedAt: string | null
  createdAt: string
  updatedAt: string
}

export type AdminApiKeyFormInput = {
  provider: AdminApiKeyProviderId | string
  label: string
  envTarget: AdminApiKeyEnvTarget
  value: string
  notes?: string | null
  isActive?: boolean
}

export type AdminApiKeyUpdateInput = {
  label?: string
  envTarget?: AdminApiKeyEnvTarget
  /** If provided, re-encrypt this new value and update masked_hint. */
  value?: string | null
  notes?: string | null
  isActive?: boolean
}
