type Props = {
  /** Pixel diameter of the avatar. */
  size?: number
  className?: string
}

/** Glowing gradient ring around the brand "M" mark — the author-avatar-frame board asset in code. */
export default function AuthorAvatar({ size = 40, className = '' }: Props) {
  const ring = Math.round(size * 0.06)

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        padding: ring,
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        boxShadow: '0 0 14px color-mix(in srgb, var(--primary) 55%, transparent)',
      }}
      aria-hidden="true"
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a1a]">
        <svg width="60%" height="60%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="avatarMSilver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4f8ff" />
              <stop offset="0.5" stopColor="#c6d2e8" />
              <stop offset="1" stopColor="#8fa2c2" />
            </linearGradient>
          </defs>
          <path
            d="M24 76 V26 L50 52 76 26 V76"
            fill="none"
            stroke="url(#avatarMSilver)"
            strokeWidth="13"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  )
}
