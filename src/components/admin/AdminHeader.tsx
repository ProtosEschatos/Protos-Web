import { SITE_URL } from '@/lib/site'
import ProtosLogo from '@/components/ui/ProtosLogo'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

export default function AdminHeader() {
  return (
    <header className="relative z-[2] border-b border-white/5 bg-[#100818]/60 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ProtosLogo size={32} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">Privatno</p>
            <p className="text-sm font-semibold text-[var(--light)]">Ops panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={SITE_URL}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[var(--light-muted)] hover:text-[var(--light)] hover:border-white/20 transition-colors"
          >
            Javna stranica
          </a>
          <AdminLogoutButton />
        </div>
      </div>
    </header>
  )
}
