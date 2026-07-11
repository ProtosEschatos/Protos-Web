export type InsightStatus = 'ok' | 'warn' | 'off' | 'info'

export type AdminInsight = {
  id: string
  label: string
  status: InsightStatus
  statusLabel: string
  detail: string
  href: string
  external?: boolean
}

export type AdminInsightsSnapshot = {
  insights: AdminInsight[]
  checkedAt: string
}

export type AdminChannelNotification = {
  id: string
  title: string
  subtitle: string
  detail?: string | null
  created_at: string
  href: string
}

export type AdminCommsChannel = {
  id: string
  label: string
  role: string
  href: string
  external?: boolean
  status: InsightStatus
  statusLabel: string
  detail: string
  badge?: string
  notifications: AdminChannelNotification[]
}

export type AdminCommsSnapshot = {
  channels: AdminCommsChannel[]
  checkedAt: string
}
