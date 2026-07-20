import { z } from 'zod'

export const apiKeyEnvTargetSchema = z.enum(['all', 'production', 'preview', 'development'])

const providerSchema = z
  .string()
  .trim()
  .min(2, 'Provider mora imati barem 2 znaka')
  .max(48, 'Provider je predug (max 48)')
  .regex(/^[a-z0-9_-]+$/i, 'Provider može sadržavati samo slova, brojeve, - i _')

const labelSchema = z
  .string()
  .trim()
  .min(1, 'Nalijepnica je obavezna')
  .max(80, 'Nalijepnica je preduga (max 80)')

export const apiKeyCreateSchema = z.object({
  provider: providerSchema,
  label: labelSchema,
  envTarget: apiKeyEnvTargetSchema.default('all'),
  value: z
    .string()
    .trim()
    .min(4, 'Ključ mora imati barem 4 znaka')
    .max(4096, 'Ključ je predug (max 4096 znakova)'),
  notes: z.string().trim().max(500).nullish(),
  isActive: z.boolean().default(true),
})

export const apiKeyUpdateSchema = z.object({
  label: labelSchema.optional(),
  envTarget: apiKeyEnvTargetSchema.optional(),
  value: z
    .string()
    .trim()
    .min(4)
    .max(4096)
    .nullish(),
  notes: z.string().trim().max(500).nullish(),
  isActive: z.boolean().optional(),
})

export type ApiKeyCreateInput = z.infer<typeof apiKeyCreateSchema>
export type ApiKeyUpdateInput = z.infer<typeof apiKeyUpdateSchema>
