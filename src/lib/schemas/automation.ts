import { z } from 'zod'
import { isBlockedHostLiteral } from '@/lib/security/ssrf'

export const automationMethodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
export const automationAuthTypeSchema = z.enum(['none', 'bearer', 'basic', 'custom'])
export const automationEventSchema = z.enum([
  'manual',
  'contact.received',
  'subscriber.new',
  'donation.completed',
  'portfolio.published',
  'blog.published',
])

const headersJsonSchema = z
  .record(z.string().max(120), z.string().max(2048))
  .default({})
  .refine((obj) => Object.keys(obj).length <= 20, {
    message: 'Najviše 20 custom headera',
  })

const httpsUrlSchema = z
  .string()
  .trim()
  .url('URL nije valjan')
  .refine((value) => value.startsWith('https://') || value.startsWith('http://'), {
    message: 'URL mora početi s http(s)://',
  })
  .refine((value) => !isBlockedHostLiteral(value), {
    // Authoritative runtime check happens in `assertPublicUrl()` right before
    // fetch — this is only a fast fail-early at admin-write time.
    message: 'Interni / lokalni URL-ovi (RFC1918, loopback, link-local, IPv6 unique local) nisu dozvoljeni',
  })

export const automationWebhookCreateSchema = z.object({
  name: z.string().trim().min(1).max(80),
  url: httpsUrlSchema,
  method: automationMethodSchema.default('POST'),
  event: automationEventSchema.default('manual'),
  authType: automationAuthTypeSchema.default('none'),
  authHeaderName: z.string().trim().max(80).nullish(),
  authSecret: z.string().trim().min(4).max(4096).nullish(),
  headersJson: headersJsonSchema,
  bodyTemplate: z.unknown().nullish(),
  notes: z.string().trim().max(500).nullish(),
  isEnabled: z.boolean().default(true),
})

export const automationWebhookUpdateSchema = automationWebhookCreateSchema
  .partial()
  .extend({
    clearAuthSecret: z.boolean().optional(),
  })

export type AutomationWebhookCreate = z.infer<typeof automationWebhookCreateSchema>
export type AutomationWebhookUpdate = z.infer<typeof automationWebhookUpdateSchema>
