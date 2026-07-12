'use client'

import { useEffect, useRef } from 'react'
import { BOOT_BG } from '@/lib/config/boot-gate'

type Star = {
  x: number
  y: number
  r: number
  baseAlpha: number
  twinkleSpeed: number
  phase: number
}

type FlyingCar = {
  x: number
  y: number
  dir: 1 | -1
  speed: number
  scale: number
  hue: [number, number, number]
  bob: number
  bobSpeed: number
  bobPhase: number
}

const CAR_COLORS: Array<[number, number, number]> = [
  [255, 102, 0], // primary orange
  [6, 182, 212], // accent cyan
  [139, 92, 246], // secondary purple
  [255, 179, 71], // warm amber
  [125, 211, 252], // sky
]

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Lightweight 2D canvas boot background: twinkling starfield + flying cars
 * with light trails. Deliberately avoids Three.js so the boot gate stays fast.
 */
export default function BootSkyBackground({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let stars: Star[] = []
    let cars: FlyingCar[] = []
    let raf = 0
    let running = true

    const spawnCar = (fromEdge = false): FlyingCar => {
      const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1
      const scale = rand(0.55, 1.35)
      return {
        x: fromEdge
          ? dir === 1
            ? -rand(40, 260)
            : width + rand(40, 260)
          : rand(0, width),
        y: rand(height * 0.12, height * 0.62),
        dir,
        speed: rand(0.5, 1.4) * (0.7 + scale),
        scale,
        hue: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
        bob: rand(2, 7),
        bobSpeed: rand(0.4, 1.1),
        bobPhase: rand(0, Math.PI * 2),
      }
    }

    const build = () => {
      const starCount = Math.round((width * height) / 5200)
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.92,
        r: rand(0.4, 1.6),
        baseAlpha: rand(0.25, 0.95),
        twinkleSpeed: rand(0.6, 2.4),
        phase: rand(0, Math.PI * 2),
      }))
      const carCount = Math.max(5, Math.round(width / 260))
      cars = Array.from({ length: carCount }, () => spawnCar(false))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    const drawBackground = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, '#01030c')
      grad.addColorStop(0.55, BOOT_BG)
      grad.addColorStop(1, '#0a0722')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // nebula glows
      const nebula = (cx: number, cy: number, r: number, color: string) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, color)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, width, height)
      }
      nebula(width * 0.22, height * 0.28, Math.max(width, height) * 0.34, 'rgba(139,92,246,0.10)')
      nebula(width * 0.8, height * 0.2, Math.max(width, height) * 0.3, 'rgba(6,182,212,0.09)')
      nebula(width * 0.6, height * 0.85, Math.max(width, height) * 0.4, 'rgba(255,102,0,0.06)')

      // distant city silhouette for depth
      ctx.fillStyle = 'rgba(2,4,14,0.85)'
      const baseY = height
      let bx = -20
      while (bx < width + 20) {
        const bw = rand(18, 46)
        const bh = rand(height * 0.05, height * 0.18)
        ctx.fillRect(bx, baseY - bh, bw, bh)
        bx += bw + rand(6, 20)
      }
    }

    const drawStars = (t: number) => {
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase)
        const alpha = reduceMotion ? s.baseAlpha : s.baseAlpha * (0.35 + 0.65 * twinkle)
        ctx.beginPath()
        ctx.fillStyle = `rgba(226,238,255,${alpha.toFixed(3)})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawCar = (car: FlyingCar, t: number) => {
      const [r, g, b] = car.hue
      const s = car.scale
      const yOff = reduceMotion ? 0 : Math.sin(t * car.bobSpeed + car.bobPhase) * car.bob
      const x = car.x
      const y = car.y + yOff
      const bodyW = 34 * s
      const bodyH = 9 * s

      ctx.save()
      ctx.translate(x, y)
      if (car.dir === -1) ctx.scale(-1, 1)

      // light trail behind
      const trailLen = 120 * s
      const trail = ctx.createLinearGradient(-trailLen, 0, 0, 0)
      trail.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',0)')
      trail.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0.5)')
      ctx.fillStyle = trail
      ctx.fillRect(-trailLen, -1.4 * s, trailLen, 2.8 * s)

      // glow
      ctx.shadowColor = 'rgba(' + r + ',' + g + ',' + b + ',0.9)'
      ctx.shadowBlur = 18 * s

      // body (rounded)
      const bx = -bodyW / 2
      const by = -bodyH / 2
      const rad = bodyH / 2
      ctx.beginPath()
      ctx.moveTo(bx + rad, by)
      ctx.lineTo(bx + bodyW - rad, by)
      ctx.quadraticCurveTo(bx + bodyW, by, bx + bodyW, by + rad)
      ctx.quadraticCurveTo(bx + bodyW, by + bodyH, bx + bodyW - rad, by + bodyH)
      ctx.lineTo(bx + rad, by + bodyH)
      ctx.quadraticCurveTo(bx, by + bodyH, bx, by + rad)
      ctx.quadraticCurveTo(bx, by, bx + rad, by)
      ctx.closePath()
      const bodyGrad = ctx.createLinearGradient(0, by, 0, by + bodyH)
      bodyGrad.addColorStop(0, 'rgba(40,48,70,0.98)')
      bodyGrad.addColorStop(1, 'rgba(14,18,34,0.98)')
      ctx.fillStyle = bodyGrad
      ctx.fill()

      // cabin / windshield
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.35)'
      ctx.fillRect(-bodyW * 0.16, by - 3.4 * s, bodyW * 0.42, 3.4 * s)

      // headlight (front) + taillight (back)
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255,246,224,0.95)'
      ctx.arc(bx + bodyW - 1.5 * s, 0, 1.7 * s, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.95)'
      ctx.arc(bx + 1.5 * s, 0, 1.5 * s, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    let last = performance.now()
    const loop = (now: number) => {
      if (!running) return
      const t = now / 1000
      const dt = Math.min((now - last) / 16.67, 3)
      last = now

      drawBackground()
      drawStars(t)

      for (const car of cars) {
        if (!reduceMotion) car.x += car.speed * car.dir * dt
        drawCar(car, t)
        if (car.dir === 1 && car.x > width + 260) Object.assign(car, spawnCar(true))
        else if (car.dir === -1 && car.x < -260) Object.assign(car, spawnCar(true))
      }

      if (!reduceMotion) raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduceMotion) {
      drawBackground()
      drawStars(0)
      for (const car of cars) drawCar(car, 0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: BOOT_BG }} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020818]/40 pointer-events-none" />
    </div>
  )
}
