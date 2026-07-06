import { CONTACT_EMAIL } from '@/lib/site'

export const SOCIAL_EMAIL = CONTACT_EMAIL
export const SOCIAL_PHONE = '+385 97 604 39 41'
export const WHATSAPP_URL = 'https://wa.me/385976043941'

export type PresenceItem = {
  id: string
  label: string
  href: string
  brand: string
  /** true until the real profile URL is provided */
  pending?: boolean
}

export const socialItems: PresenceItem[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/ProtosEschatos', brand: '#e7e7f0', pending: true },
  { id: 'instagram', label: 'Instagram', href: '#', brand: '#e1306c', pending: true },
  { id: 'facebook', label: 'Facebook', href: '#', brand: '#1877f2', pending: true },
  { id: 'whatsapp', label: 'WhatsApp', href: WHATSAPP_URL, brand: '#25d366' },
]

export const platformItems: PresenceItem[] = [
  { id: 'upwork', label: 'Upwork', href: '#', brand: '#14a800', pending: true },
  { id: 'freelancer', label: 'Freelancer.com', href: '#', brand: '#29b2fe', pending: true },
  { id: 'malt', label: 'Malt.com', href: '#', brand: '#fc5757', pending: true },
  { id: 'guru', label: 'Guru.com', href: '#', brand: '#ff7300', pending: true },
  { id: 'peopleperhour', label: 'PeoplePerHour', href: '#', brand: '#ff6900', pending: true },
  { id: 'golance', label: 'goLance.com', href: '#', brand: '#25b14c', pending: true },
  { id: 'hubstaff', label: 'Hubstaff Talent', href: '#', brand: '#4a90d9', pending: true },
  { id: 'jobbers', label: 'Jobbers.io', href: '#', brand: '#6c5cef', pending: true },
]
