import { z } from 'zod'
import { localeSchema } from './locale'

export const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Neispravan email')
    .max(200, 'Email je predugačak'),
  language: localeSchema.optional().default('hr'),
  source: z.string().trim().max(64).optional().default('website'),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
