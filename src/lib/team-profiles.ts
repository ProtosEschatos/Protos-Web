import {
  DARIO_INSTAGRAM_URL,
  INSTAGRAM_URL,
  MARTINA_INSTAGRAM_URL,
} from '@/lib/site'
import type { PresenceItem } from '@/lib/social-links'

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
  profileLink('golance', 'goLance', '#', '#25b14c'),
  profileLink('upwork', 'Upwork', '#', '#14a800'),
]

export const martinaSocialItems: PresenceItem[] = [
  profileLink('instagram', 'Instagram', MARTINA_INSTAGRAM_URL, '#e1306c'),
  profileLink('tiktok', 'TikTok', '#', '#00f2ea'),
]

export const freelancePlatformItems: PresenceItem[] = [
  profileLink('golance', 'goLance.com', '#', '#25b14c'),
  profileLink('upwork', 'Upwork', '#', '#14a800'),
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
