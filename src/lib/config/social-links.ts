import { CONTACT_EMAIL } from '@/lib/config/site'

export const SOCIAL_EMAIL = CONTACT_EMAIL
export const SOCIAL_PHONE = '+385 97 604 39 41'
export const WHATSAPP_URL = 'https://wa.me/385976043941'

export type PresenceItem = {
  id: string
  label: string
  href: string
  brand: string
  pending?: boolean
}

/** @deprecated Use studioSocialItems from team-profiles.ts */
export { studioSocialItems as socialItems, freelancePlatformItems as platformItems, partnerReferralItems } from '@/lib/config/team-profiles'
