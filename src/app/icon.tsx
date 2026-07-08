import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a0a1a',
          borderRadius: 7,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4f8ff" />
              <stop offset="0.5" stopColor="#c6d2e8" />
              <stop offset="1" stopColor="#8fa2c2" />
            </linearGradient>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M24 76 V26 L50 52 76 26 V76"
            fill="none"
            stroke="url(#g)"
            strokeWidth="22"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M24 76 V26 L50 52 76 26 V76"
            fill="none"
            stroke="url(#s)"
            strokeWidth="13"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  )
}
