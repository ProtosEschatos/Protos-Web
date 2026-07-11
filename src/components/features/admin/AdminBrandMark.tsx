type Props = {
  className?: string
}

/** Static brand mark for admin — no framer-motion, no RAF loop. */
export default function AdminBrandMark({ className = '' }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff6600] via-[#a855f7] to-[#06b6d4] shadow-[0_0_12px_rgba(255,102,0,0.35)] ${className}`}
      aria-hidden
    />
  )
}
