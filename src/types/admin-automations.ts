export type AutomationHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type AutomationAuthType = 'none' | 'bearer' | 'basic' | 'custom'

export type AutomationEvent =
  | 'manual'
  | 'contact.received'
  | 'subscriber.new'
  | 'donation.completed'
  | 'portfolio.published'
  | 'blog.published'

export type AutomationWebhookListItem = {
  id: string
  name: string
  url: string
  method: AutomationHttpMethod
  event: AutomationEvent
  authType: AutomationAuthType
  authHeaderName: string | null
  hasAuthSecret: boolean
  headersJson: Record<string, string>
  bodyTemplate: unknown | null
  notes: string | null
  isEnabled: boolean
  lastFiredAt: string | null
  lastStatusCode: number | null
  lastResponse: string | null
  fireCount: number
  createdAt: string
  updatedAt: string
}

export type AutomationWebhookFormInput = {
  name: string
  url: string
  method: AutomationHttpMethod
  event: AutomationEvent
  authType: AutomationAuthType
  authHeaderName?: string | null
  authSecret?: string | null
  headersJson?: Record<string, string>
  bodyTemplate?: unknown | null
  notes?: string | null
  isEnabled?: boolean
}

export type AutomationWebhookUpdateInput = Partial<AutomationWebhookFormInput> & {
  /** Set to `true` to clear the stored auth secret (write null ciphertext). */
  clearAuthSecret?: boolean
}

export type AutomationFireResult = {
  ok: boolean
  status: number | null
  durationMs: number
  bodyPreview: string | null
  error?: string
}
