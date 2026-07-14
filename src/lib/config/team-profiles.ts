import {
  CONTACT_EMAIL,
  DARIO_INSTAGRAM_URL,
  INSTAGRAM_URL,
  MARTINA_INSTAGRAM_URL,
} from '@/lib/config/site'

export const SOCIAL_EMAIL = CONTACT_EMAIL
export const SOCIAL_PHONE = '+385 97 604 39 41'

export type PresenceItem = {
  id: string
  label: string
  href: string
  brand: string
  pending?: boolean
}

const WHATSAPP_URL = 'https://wa.me/385976043941'

function profileLink(
  id: string,
  label: string,
  href: string,
  brand: string,
): PresenceItem {
  const pending = !href || href === '#'
  return { id, label, href: pending ? '#' : href, brand, ...(pending ? { pending: true } : {}) }
}

export const studioSocialItems: PresenceItem[] = [
  profileLink('github', 'GitHub', 'https://github.com/ProtosEschatos', '#e7e7f0'),
  profileLink('instagram', 'Instagram', INSTAGRAM_URL, '#e1306c'),
  profileLink('facebook', 'Facebook', '#', '#1877f2'),
  profileLink('whatsapp', 'WhatsApp', WHATSAPP_URL, '#25d366'),
  profileLink('tiktok', 'TikTok', '#', '#00f2ea'),
]

export const darioSocialItems: PresenceItem[] = [
  profileLink('instagram', 'Instagram', DARIO_INSTAGRAM_URL, '#e1306c'),
  profileLink('facebook', 'Facebook', 'https://www.facebook.com/imsirovicdario23/', '#1877f2'),
  profileLink('tiktok', 'TikTok', '#', '#00f2ea'),
  profileLink('golance', 'goLance', 'https://golance.com/freelancer/home/', '#25b14c'),
  profileLink('upwork', 'Upwork', 'https://www.upwork.com/freelancers/protos01eschatos', '#14a800'),
]

export const martinaSocialItems: PresenceItem[] = [
  profileLink('instagram', 'Instagram', MARTINA_INSTAGRAM_URL, '#e1306c'),
  profileLink('tiktok', 'TikTok', '#', '#00f2ea'),
]

export const freelancePlatformItems: PresenceItem[] = [
  profileLink('golance', 'goLance.com', 'https://golance.com/freelancer/home/', '#25b14c'),
  profileLink('upwork', 'Upwork', 'https://www.upwork.com/freelancers/protos01eschatos', '#14a800'),
  profileLink('freelancer', 'Freelancer.com', '#', '#29b2fe'),
  profileLink('malt', 'Malt.com', '#', '#fc5757'),
  profileLink('guru', 'Guru.com', '#', '#ff7300'),
  profileLink('peopleperhour', 'PeoplePerHour', '#', '#ff6900'),
  profileLink('hubstaff', 'Hubstaff Talent', '#', '#4a90d9'),
  profileLink('jobbers', 'Jobbers.io', '#', '#6c5cef'),
]

export function getLiveProfileUrls(items: PresenceItem[]): string[] {
  return items.map((item) => item.href).filter((href) => href && href !== '#')
}
