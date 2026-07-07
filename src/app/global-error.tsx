'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="hr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020818',
          color: '#e8e8f0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          padding: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Nešto je pošlo po zlu
          </h1>
          <p style={{ color: '#8888aa', lineHeight: 1.7, marginBottom: '2rem' }}>
            Dogodila se neočekivana greška. Pokušaj ponovno.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(to right, #ff6600, #ff8800)',
            }}
          >
            Pokušaj ponovno
          </button>
        </div>
      </body>
    </html>
  )
}
