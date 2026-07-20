import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Bot,
  FileText,
  Heart,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  Sparkles,
  UserRound,
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
  subscribers: Mail,
  memory: BookOpen,
  ai: Bot,
  keys: KeyRound,
  tools: Wrench,
}

export function adminNavIcon(id: string): LucideIcon {
  return ADMIN_NAV_ICONS[id] ?? LayoutDashboard
}
