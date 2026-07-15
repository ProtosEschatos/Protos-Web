import { AIRCASH_PHONE, AIRCASH_PHONE_DISPLAY, KO_FI_URL } from '@/lib/config/site'

export const DONATION_DEFAULT_CAUSE = 'resources' as const
export const DONATION_CAUSES = [DONATION_DEFAULT_CAUSE] as const
export type DonationCause = (typeof DONATION_CAUSES)[number]

/** External tip jar (Ko-fi) — use alongside Stripe Checkout. */
export { KO_FI_URL }

/** AirCash peer transfer — shown under every Stripe donation CTA. */
export { AIRCASH_PHONE, AIRCASH_PHONE_DISPLAY }

/** Legacy slugs — still valid in DB / admin for old rows */
export const LEGACY_DONATION_CAUSES = ['cyber', 'education', 'platforms'] as const

export const DONATION_MIN_EUR = 1
export const DONATION_MAX_EUR = 1000

export function isDonationCause(value: string): value is DonationCause {
  return (DONATION_CAUSES as readonly string[]).includes(value)
}

export function isKnownDonationCause(value: string): boolean {
  return isDonationCause(value) || (LEGACY_DONATION_CAUSES as readonly string[]).includes(value)
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}
