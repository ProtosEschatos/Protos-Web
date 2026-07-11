'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId, useMemo } from 'react'

type Props = {
  size?: number
  className?: string
}

const CENTER = 18
const RX = 10
const RY = 5.8
const REVS = 2
const N = 72
const LOOP = 4.8

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x))
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function radiusFactor(t: number) {
  const down = 1 - smoothstep(0.42, 0.54, t)
  const up = smoothstep(0.82, 0.94, t)
  return Math.max(down, up)
}

function buildOrbitKeyframes(power: number) {
  const times = Array.from({ length: N + 1 }, (_, i) => i / N)
  const cxA: number[] = []
  const cyA: number[] = []
  const cxB: number[] = []
  const cyB: number[] = []
  const orbOpacity: number[] = []
  const coreOpacity: number[] = []
  const coreScale: number[] = []
  const burstOpacity: number[] = []

  for (let i = 0; i <= N; i++) {
    const linear = i / N
    const eased = linear ** power
    const rf = radiusFactor(eased)
    const merge = 1 - rf
    const theta = eased * Math.PI * 2 * REVS

    cxA.push(CENTER + rf * RX * Math.cos(theta))
    cyA.push(CENTER + rf * RY * Math.sin(theta))
    cxB.push(CENTER - rf * RX * Math.cos(theta))
    cyB.push(CENTER - rf * RY * Math.sin(theta))
    orbOpacity.push(1 - 0.85 * merge)
    coreOpacity.push(smoothstep(0.38, 0.72, merge))
    coreScale.push(0.35 + 0.65 * merge)
    burstOpacity.push(smoothstep(0.48, 0.56, merge) * (1 - smoothstep(0.56, 0.68, merge)))
  }

  return { times, cxA, cyA, cxB, cyB, orbOpacity, coreOpacity, coreScale, burstOpacity }
}

const BURST_ANGLES = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2)

/** Boot screen logo — accelerating elliptic orbit, merge burst, then split. */
export default function BootOrbitLogo({ size = 112, className = '' }: Props) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const blue = `boot-blue-${uid}`
  const orange = `boot-orange-${uid}`
  const neon = `boot-neon-${uid}`

  const orbit = useMemo(() => buildOrbitKeyframes(1.85), [])
  const loopTween = { duration: LOOP, times: orbit.times, repeat: Infinity, ease: 'linear' as const }

  if (reduceMotion) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div
          className="rounded-full bg-gradient-to-br from-[#39ff9e] via-[#a855f7] to-[#7c1fd8]"
          style={{ width: size * 0.42, height: size * 0.42, boxShadow: '0 0 24px rgba(168,85,247,0.75)' }}
        />
      </div>
    )
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {BURST_ANGLES.map((angle, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 5,
            height: 5,
            left: '50%',
            top: '50%',
            marginLeft: -2.5,
            marginTop: -2.5,
            background: i % 2 === 0 ? '#5cc8ff' : '#ff9a3d',
            boxShadow: i % 2 === 0 ? '0 0 10px #5cc8ff' : '0 0 10px #ff9a3d',
          }}
          animate={{
            opacity: orbit.burstOpacity,
            x: orbit.burstOpacity.map((o) => Math.cos(angle) * o * (size * 0.34)),
            y: orbit.burstOpacity.map((o) => Math.sin(angle) * o * (size * 0.34)),
            scale: orbit.burstOpacity.map((o) => 0.4 + o * 1.6),
          }}
          transition={loopTween}
        />
      ))}

      <motion.span
        className="absolute rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(125,211,252,0.35)_35%,transparent_72%)]"
        style={{ width: size * 0.95, height: size * 0.95 }}
        animate={{ opacity: orbit.burstOpacity.map((o) => o * 0.9) }}
        transition={loopTween}
      />

      <svg viewBox="0 0 36 36" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <radialGradient id={blue} cx="40%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#eaf9ff" />
            <stop offset="45%" stopColor="#5cc8ff" />
            <stop offset="100%" stopColor="#1b7fd6" />
          </radialGradient>
          <radialGradient id={orange} cx="40%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#fff2d6" />
            <stop offset="45%" stopColor="#ff9a3d" />
            <stop offset="100%" stopColor="#ff5a00" />
          </radialGradient>
          <radialGradient id={neon} cx="42%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#c9ffe6" />
            <stop offset="34%" stopColor="#39ff9e" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c1fd8" />
          </radialGradient>
        </defs>

        <motion.g animate={{ opacity: orbit.coreOpacity }} transition={loopTween}>
          <motion.g
            animate={{ scale: orbit.coreScale }}
            transition={loopTween}
            style={{ transformBox: 'view-box', transformOrigin: '18px 18px' }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r="8.2"
              fill={`url(#${neon})`}
              style={{
                filter:
                  'drop-shadow(0 0 6px rgba(168,85,247,0.9)) drop-shadow(0 0 12px rgba(57,255,158,0.55))',
              }}
            />
          </motion.g>
        </motion.g>

        <motion.circle
          cx={orbit.cxA[0]}
          cy={orbit.cyA[0]}
          r="3.6"
          fill={`url(#${blue})`}
          animate={{ cx: orbit.cxA, cy: orbit.cyA, opacity: orbit.orbOpacity }}
          transition={loopTween}
          style={{ filter: 'drop-shadow(0 0 4px rgba(92,200,255,0.95))' }}
        />
        <motion.circle
          cx={orbit.cxB[0]}
          cy={orbit.cyB[0]}
          r="3.6"
          fill={`url(#${orange})`}
          animate={{ cx: orbit.cxB, cy: orbit.cyB, opacity: orbit.orbOpacity }}
          transition={loopTween}
          style={{ filter: 'drop-shadow(0 0 4px rgba(255,138,0,0.95))' }}
        />
      </svg>
    </div>
  )
}
