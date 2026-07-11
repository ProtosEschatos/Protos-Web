import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const eclipseSvg = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#0d0d1a" stroke="#FF8800" stroke-width="5"/><path d="M100,10 A90,90 0 0,1 100,190 A90,90 0 0,0 100,10" fill="#FF6600"/></svg>`,
)}`

type OgVariant = 'default' | 'about'

function resolveVariant(searchParams: URLSearchParams): OgVariant {
  return searchParams.get('type') === 'about' ? 'about' : 'default'
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const variant = resolveVariant(searchParams)
  const isAbout = variant === 'about'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '90px',
          background: 'linear-gradient(135deg, #14142b 0%, #0a0a1a 60%)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={eclipseSvg} width={220} height={220} alt="" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '72px',
          }}
        >
          <div
            style={{
              fontSize: isAbout ? 72 : 84,
              fontWeight: 800,
              color: '#e8e8f0',
              letterSpacing: '-2px',
            }}
          >
            {isAbout ? 'Protos Web — O nama' : 'Protos Web'}
          </div>
          <div
            style={{
              marginTop: '18px',
              fontSize: isAbout ? 30 : 38,
              color: '#8888aa',
              maxWidth: 720,
              lineHeight: 1.35,
            }}
          >
            {isAbout
              ? 'Full Stack Duo iz Zagreba — AI & Full Stack · Shop/UI Design'
              : 'Websites with soul, built with love'}
          </div>
          <div
            style={{
              marginTop: '48px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 26,
              color: '#FF8800',
              fontWeight: 600,
            }}
          >
            protosweb.eu
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
