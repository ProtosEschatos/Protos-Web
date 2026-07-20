import { z } from 'zod'
import { localeSchema } from './locale'

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ime mora imati barem 2 znaka')
    .max(120, 'Ime je predugačko'),
  email: z
    .string()
    .trim()
    .email('Neispravan email')
    .max(200, 'Email je predugačak'),
  service: z.string().trim().max(120).optional().default(''),
  message: z
    .string()
    .trim()
    .min(10, 'Poruka mora imati barem 10 znakova')
    .max(4000, 'Poruka je predugačka'),
  language: localeSchema.optional().default('hr'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
