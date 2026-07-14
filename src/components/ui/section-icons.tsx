import {
  Bolt,
  Bot,
  Code,
  Clock,
  Palette,
  Search,
  Shield,
  ShoppingCart,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

const ICON_BY_NAME: Record<string, LucideIcon> = {
  code: Code,
  palette: Palette,
  shoppingcart: ShoppingCart,
  cart: ShoppingCart,
  search: Search,
  bot: Bot,
  wrench: Wrench,
  bolt: Bolt,
  clock: Clock,
  shield: Shield,
}

export const SERVICE_ICONS: LucideIcon[] = [
  Code,
  Palette,
  ShoppingCart,
  Search,
  Bot,
  Wrench,
]

export function resolveIcon(name: string | null | undefined, fallbackIndex = 0): LucideIcon {
  const key = (name ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (key && ICON_BY_NAME[key]) return ICON_BY_NAME[key]
  return SERVICE_ICONS[fallbackIndex % SERVICE_ICONS.length] ?? Code
}

export const PROCESS_FEATURE_ICONS: LucideIcon[] = [Bolt, Clock, Shield]
