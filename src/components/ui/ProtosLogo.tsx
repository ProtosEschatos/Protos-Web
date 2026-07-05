'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

interface ProtosLogoProps {
  size?: number
  className?: string
}

const CENTER = 18
const RX = 9.5
const RY = 5.4
const REVS = 2
const N = 60

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x))
}
function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
// 1 while orbiting, 0 while the two orbs are merged at the center
function radiusFactor(t: number) {
  const down = 1 - smoothstep(0.45, 0.55, t)
  const up = smoothstep(0.85, 0.95, t)
  return Math.max(down, up)
}

const times = Array.from({ length: N + 1 }, (_, i) => i / N)
const cxA: number[] = []
const cyA: number[] = []
const cxB: number[] = []
const cyB: number[] = []
const orbOpacity: number[] = []
const coreOpacity: number[] = []
const coreScale: number[] = []

for (let i = 0; i <= N; i++) {
  const t = i / N
  const rf = radiusFactor(t)
  const merge = 1 - rf
  const theta = t * Math.PI * 2 * REVS
  cxA.push(CENTER + rf * RX * Math.cos(theta))
  cyA.push(CENTER + rf * RY * Math.sin(theta))
  cxB.push(CENTER - rf * RX * Math.cos(theta))
  cyB.push(CENTER - rf * RY * Math.sin(theta))
  orbOpacity.push(1 - 0.8 * merge)
  coreOpacity.push(smoothstep(0.4, 0.75, merge))
  coreScale.push(0.45 + 0.55 * merge)
}

const LOOP = 6.5

/**
 * Protos Web brand mark — two neon orbs (sky blue + sunset orange) orbit on an
 * ellipse, fold together like a yin-yang and fuse into a rotating purple/green
 * neon sphere, then split apart and repeat.
 */
export default function ProtosLogo({ size = 36, className = '' }: ProtosLogoProps) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const blue = `pl-blue-${uid}`
  const orange = `pl-orange-${uid}`
  const neon = `pl-neon-${uid}`

  const loopTween = { duration: LOOP, times, repeat: Infinity, ease: 'linear' as const }

  return (
    <motion.span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
      whileHover={reduceMotion ? undefined : { scale: 1.1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      <svg
        viewBox="0 0 36 36"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
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

        {reduceMotion ? (
          // Static fallback: the fused sphere.
          <circle
            cx={CENTER}
            cy={CENTER}
            r="8"
            fill={`url(#${neon})`}
            style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.8))' }}
          />
        ) : (
          <>
            {/* fused neon sphere with a rotating shine */}
            <motion.g
              animate={{ opacity: coreOpacity }}
              transition={loopTween}
              style={{ transformBox: 'view-box', transformOrigin: '18px 18px' }}
            >
              <motion.g
                animate={{ scale: coreScale }}
                transition={loopTween}
                style={{ transformBox: 'view-box', transformOrigin: '18px 18px' }}
              >
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r="8"
                  fill={`url(#${neon})`}
                  style={{
                    filter:
                      'drop-shadow(0 0 4px rgba(168,85,247,0.85)) drop-shadow(0 0 7px rgba(57,255,158,0.5))',
                  }}
                />
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                  style={{ transformBox: 'view-box', transformOrigin: '18px 18px' }}
                >
                  <circle cx={CENTER} cy={CENTER - 4} r="2.4" fill="#ffffff" opacity="0.5" />
                </motion.g>
              </motion.g>
            </motion.g>

            {/* sky-blue orb */}
            <motion.circle
              cx={cxA[0]}
              cy={cyA[0]}
              r="3.4"
              fill={`url(#${blue})`}
              animate={{ cx: cxA, cy: cyA, opacity: orbOpacity }}
              transition={loopTween}
              style={{ filter: 'drop-shadow(0 0 3px rgba(92,200,255,0.95))' }}
            />

            {/* sunset-orange orb */}
            <motion.circle
              cx={cxB[0]}
              cy={cyB[0]}
              r="3.4"
              fill={`url(#${orange})`}
              animate={{ cx: cxB, cy: cyB, opacity: orbOpacity }}
              transition={loopTween}
              style={{ filter: 'drop-shadow(0 0 3px rgba(255,138,0,0.95))' }}
            />
          </>
        )}
      </svg>
    </motion.span>
  )
}
