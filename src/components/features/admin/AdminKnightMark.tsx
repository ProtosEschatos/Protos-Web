type Props = {
  className?: string
}

/** Custom Protos-style chess knight watermark (neon glass silhouette). */
export default function AdminKnightMark({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="knightFill" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#ff6600" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="knightStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8800" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="knightGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#knightGlow)" opacity="0.85">
        <path
          d="M100 18c-8 12-22 18-22 36 0 10 4 18 12 24-6 4-10 12-10 22 0 14 10 26 24 30v8H56c-6 0-10 4-10 10v12c0 6 4 10 10 10h88c6 0 10-4 10-10v-12c0-6-4-10-10-10h-48v-8c14-4 24-16 24-30 0-10-4-18-10-22 8-6 12-14 12-24 0-18-14-24-22-36z"
          fill="url(#knightFill)"
          stroke="url(#knightStroke)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M78 52c6-8 16-12 22-12s16 4 22 12"
          stroke="url(#knightStroke)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="88" cy="58" r="3" fill="#22d3ee" opacity="0.8" />
        <path
          d="M62 200h76"
          stroke="url(#knightStroke)"
          strokeWidth="1"
          opacity="0.4"
          strokeDasharray="4 6"
        />
      </g>
    </svg>
  )
}
