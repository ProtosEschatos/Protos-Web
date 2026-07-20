import type { LucideIcon } from 'lucide-react'
import {
  Blocks,
  BookOpen,
  Bot,
  FileText,
  Gauge,
  Heart,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  Sparkles,
  UserRound,
  Webhook,
  Wrench,
  Workflow,
} from 'lucide-react'

export const ADMIN_NAV_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  about: UserRound,
  process: Workflow,
  portfolio: LayoutGrid,
  services: Sparkles,
  blog: FileText,
  contact: Inbox,
  donations: Heart,
  configurator: Blocks,
  subscribers: Mail,
  memory: BookOpen,
  ai: Bot,
  keys: KeyRound,
  automations: Webhook,
  seo: Gauge,
  tools: Wrench,
}

export function adminNavIcon(id: string): LucideIcon {
  return ADMIN_NAV_ICONS[id] ?? LayoutDashboard
}
