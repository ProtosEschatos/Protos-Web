import { adminGetActivityBadgeCount } from '@/lib/admin/notifications'

export default async function AdminActivityBadge() {
  const count = await adminGetActivityBadgeCount()
  if (count <= 0) return null

  return (
    <span
      className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[10px] font-bold text-white"
      title={`${count} nova aktivnost u zadnjih 24h`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
