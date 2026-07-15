import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from '@/lib/config/site'

export const SOCIAL_EMAIL = CONTACT_EMAIL
export const SOCIAL_PHONE = CONTACT_PHONE_DISPLAY
export { WHATSAPP_URL }

export type PresenceItem = {
  id: string
  label: string
  href: string
  brand: string
  pending?: boolean
}

/** @deprecated Use studioSocialItems from team-profiles.ts */
export { studioSocialItems as socialItems, freelancePlatformItems as platformItems, partnerReferralItems } from '@/lib/config/team-profiles'
