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

export const SERVICE_ICONS: LucideIcon[] = [
  Code,
  Palette,
  ShoppingCart,
  Search,
  Bot,
  Wrench,
]

export const PROCESS_FEATURE_ICONS: LucideIcon[] = [Bolt, Clock, Shield]

const ICON_MAP: Record<string, LucideIcon> = {
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

export function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Code
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return ICON_MAP[key] ?? Code
}
