import {
  Bolt,
  Bot,
  Clock,
  Code,
  Crown,
  MessageCircle,
  Palette,
  PenTool,
  Rocket,
  Search,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export const PROCESS_FEATURE_ICONS: LucideIcon[] = [Bolt, Clock, Shield]

/**
 * Content rows store FontAwesome-style class strings in their `icon` column
 * (e.g. "fas fa-code"). This maps those classes to Lucide icons so admin
 * edits to `icon` immediately reflect on the site without code changes for
 * icons already covered here.
 */
export const FA_ICON_MAP: Record<string, LucideIcon> = {
  'fa-code': Code,
  'fa-paint-brush': Palette,
  'fa-store': ShoppingCart,
  'fa-shopping-cart': ShoppingCart,
  'fa-chart-line': TrendingUp,
  'fa-crown': Crown,
  'fa-shield-alt': Shield,
  'fa-shield': Shield,
  'fa-comments': MessageCircle,
  'fa-comment': MessageCircle,
  'fa-pencil-ruler': PenTool,
  'fa-rocket': Rocket,
  'fa-robot': Bot,
  'fa-wrench': Wrench,
  'fa-bolt': Bolt,
  'fa-clock': Clock,
  'fa-search': Search,
  'fa-star': Star,
  'fa-sparkles': Sparkles,
}

const DEFAULT_ICON: LucideIcon = Code

/**
 * Resolves a FontAwesome-style class string (e.g. "fas fa-code") to a
 * Lucide icon component, falling back to a sensible default when the class
 * isn't mapped yet.
 */
export function resolveFaIcon(icon: string | null | undefined): LucideIcon {
  if (!icon) return DEFAULT_ICON
  const key = icon
    .split(' ')
    .find((token) => token.startsWith('fa-'))
  return (key && FA_ICON_MAP[key]) || DEFAULT_ICON
}
