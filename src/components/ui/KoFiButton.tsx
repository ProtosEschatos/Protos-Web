'use client'

import { Heart } from 'lucide-react'
import { KO_FI_URL } from '@/lib/config/site'

type Variant = 'header' | 'headerMobile' | 'footer' | 'inline'

type Props = {
  label: string
  variant?: Variant
  className?: string
}

const variants: Record<Variant, string> = {
  header:
    'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#ff5e5b]/10 hover:bg-[#ff5e5b]/20 border border-[#ff5e5b]/30 hover:border-[#ff5e5b]/60 transition-all duration-300',
  headerMobile:
    'inline-flex items-center gap-1.5 px-2.5 h-10 rounded-xl bg-[#ff5e5b]/10 border border-[#ff5e5b]/30 text-[#ff5e5b] text-[11px] font-bold',
  footer:
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#ff5e5b]/40 bg-[#ff5e5b]/10 text-xs font-semibold text-[var(--light)] whitespace-nowrap hover:border-[#ff5e5b] hover:bg-[#ff5e5b]/20 hover:-translate-y-0.5 transition-all duration-300',
  inline:
    'inline-flex items-center gap-2 text-sm font-semibold text-[#ff5e5b] hover:underline underline-offset-2',
}

export default function KoFiButton({ label, variant = 'header', className = '' }: Props) {
  return (
    <a
      href={KO_FI_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`${variants[variant]} ${className}`.trim()}
    >
      <Heart className={variant === 'headerMobile' ? 'w-4 h-4 fill-current' : 'w-3.5 h-3.5 fill-current'} />
      <span className={variant === 'header' ? 'text-sm font-medium text-[var(--light)]' : undefined}>
        {label}
      </span>
    </a>
  )
}

export { KO_FI_URL }
