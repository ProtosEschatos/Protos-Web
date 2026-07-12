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
 * Content rows store a plain Lucide component name in their `icon` column
 * (e.g. "Code", "ShoppingCart"). This maps those names to the actual Lucide
 * icon so admin edits to `icon` immediately reflect on the site.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Palette,
  ShoppingCart,
  TrendingUp,
  Crown,
  Shield,
  MessageCircle,
  PenTool,
  Rocket,
  Bot,
  Wrench,
  Bolt,
  Clock,
  Search,
  Star,
  Sparkles,
}

const DEFAULT_ICON: LucideIcon = Code

/** Resolves a Lucide component name stored in the DB to its icon component. */
export function resolveIcon(icon: string | null | undefined): LucideIcon {
  if (!icon) return DEFAULT_ICON
  return ICON_MAP[icon] || DEFAULT_ICON
}
