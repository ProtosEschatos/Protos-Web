'use client'

import { useEffect, useRef } from 'react'

const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function PageLoaderCyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId = 0
    let columns: number[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const fontSize = 14
      columns = Array.from({ length: Math.floor(canvas.width / fontSize) }, () =>
        Math.random() * canvas.height,
      )
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 26, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const fontSize = 14
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * fontSize
        const y = columns[i]

        const gradient = ctx.createLinearGradient(x, y - fontSize, x, y)
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.9)')
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.4)')
        ctx.fillStyle = gradient
        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0
        } else {
          columns[i] = y + fontSize
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(139, 92, 246, 0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.2) 0%, transparent 40%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--dark)]/80" />
    </div>
  )
}
