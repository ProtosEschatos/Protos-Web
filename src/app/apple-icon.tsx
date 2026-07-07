import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #14142b 0%, #0a0a1a 60%)',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '14px solid #ff6600',
            borderTopColor: '#8b5cf6',
            borderRightColor: '#06b6d4',
          }}
        />
      </div>
    ),
    size,
  )
}
