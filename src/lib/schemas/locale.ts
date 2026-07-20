import { z } from 'zod'

export const SUPPORTED_LOCALES = ['hr', 'en', 'de', 'es', 'it', 'sr'] as const

export const localeSchema = z.enum(SUPPORTED_LOCALES)

export type Locale = z.infer<typeof localeSchema>
