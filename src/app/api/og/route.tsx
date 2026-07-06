import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const eclipseSvg = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#0d0d1a" stroke="#FF8800" stroke-width="5"/><path d="M100,10 A90,90 0 0,1 100,190 A90,90 0 0,0 100,10" fill="#FF6600"/></svg>`,
)}`

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')?.slice(0, 80) || 'Protos Web'
  const description =
    searchParams.get('description')?.slice(0, 140) || 'Websites with soul, built with love'

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
            maxWidth: '820px',
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? 56 : 72,
              fontWeight: 800,
              color: '#e8e8f0',
              letterSpacing: '-2px',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: '18px',
              fontSize: 32,
              color: '#8888aa',
              lineHeight: 1.35,
            }}
          >
            {description}
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
