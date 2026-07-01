'use client'

import { motion } from 'framer-motion'
import type { TransitionPhase } from '@/components/navigation/PageTransitionProvider'
import type { TransitionDestinationKey } from '@/lib/main-nav-routes'
import { getTransitionVariant } from '@/lib/transition-variants'

type TransitionVisualProps = {
  destinationKey: TransitionDestinationKey | null
  phase: TransitionPhase
}

function active(phase: TransitionPhase) {
  return phase === 'exit' || phase === 'loading'
}

function StarsVisual({ primary, secondary, accent, phase }: { primary: string; secondary: string; accent: string; phase: TransitionPhase }) {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 50%, ${primary}55 0%, transparent 55%)` }}
        animate={{ scale: active(phase) ? [0.5, 2.5, 1.8] : 0, opacity: phase === 'enter' ? 0 : 0.8 }}
        transition={{ duration: 1.4 }}
      />
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i / 48) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 block h-0.5 origin-left"
            style={{
              width: 80 + (i % 5) * 40,
              background: `linear-gradient(90deg, ${i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent}, transparent)`,
              rotate: `${(angle * 180) / Math.PI}deg`,
            }}
            animate={{
              opacity: phase === 'enter' ? 0 : active(phase) ? [0, 1, 0.4] : 0,
              scaleX: active(phase) ? [0.2, 2.5, 1.2] : 0,
            }}
            transition={{ duration: 1.1, delay: i * 0.012 }}
          />
        )
      })}
    </>
  )
}

function RingsVisual({ primary, secondary, accent, phase }: { primary: string; secondary: string; accent: string; phase: TransitionPhase }) {
  const colors = [primary, secondary, accent, primary]
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border-2"
          style={{ borderColor: colors[i % colors.length], boxShadow: `0 0 30px ${colors[i % colors.length]}66` }}
          initial={{ width: 60, height: 60, x: '-50%', y: '-50%', opacity: 0 }}
          animate={{
            width: phase === 'enter' ? 40 : [80, 120 + i * 90, 100 + i * 70],
            height: phase === 'enter' ? 40 : [80, 120 + i * 90, 100 + i * 70],
            x: '-50%',
            y: '-50%',
            opacity: phase === 'enter' ? 0 : active(phase) ? [0.2, 0.7, 0.35] : 0,
            rotate: active(phase) ? [0, 180 + i * 30, 360 + i * 20] : 0,
          }}
          transition={{ duration: 1.5, delay: i * 0.08, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

function NodesVisual({ primary, accent, secondary, phase }: { primary: string; accent: string; secondary: string; phase: TransitionPhase }) {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    x: 15 + (i * 11) % 70,
    y: 20 + ((i * 17) % 60),
  }))
  return (
    <>
      <svg className="absolute inset-0 h-full w-full">
        {nodes.slice(0, -1).map((n, i) => (
          <motion.line
            key={`l-${i}`}
            x1={`${n.x}%`}
            y1={`${n.y}%`}
            x2={`${nodes[i + 1].x}%`}
            y2={`${nodes[i + 1].y}%`}
            stroke={i % 2 === 0 ? primary : accent}
            strokeWidth="2"
            animate={{ opacity: phase === 'enter' ? 0 : active(phase) ? [0, 0.8, 0.3] : 0 }}
            transition={{ duration: 1, delay: i * 0.06 }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: 10 + (i % 3) * 4,
            height: 10 + (i % 3) * 4,
            background: i % 3 === 0 ? primary : i % 3 === 1 ? accent : secondary,
            boxShadow: `0 0 20px ${i % 2 === 0 ? primary : accent}`,
          }}
          animate={{
            opacity: phase === 'enter' ? 0 : active(phase) ? [0.2, 1, 0.5] : 0,
            scale: active(phase) ? [0, 2, 1] : 0,
            x: active(phase) ? [(i % 2 ? -1 : 1) * 40, 0] : 0,
            y: active(phase) ? [(i % 3 ? -1 : 1) * 30, 0] : 0,
          }}
          transition={{ duration: 1.1, delay: i * 0.07 }}
        />
      ))}
    </>
  )
}

function FramesVisual({ primary, secondary, accent, phase }: { primary: string; secondary: string; accent: string; phase: TransitionPhase }) {
  const colors = [primary, secondary, accent]
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-xl border-2 bg-black/20 backdrop-blur-[1px]"
          style={{
            borderColor: colors[i % 3],
            width: 90 + i * 35,
            height: 55 + i * 20,
            left: '50%',
            top: '50%',
            boxShadow: `0 0 40px ${colors[i % 3]}44`,
          }}
          animate={{
            x: active(phase) ? [-60 - i * 100, -50 + i * 20, -50] : '-50%',
            y: active(phase) ? [-50 + i * 15, -50, -50] : '-50%',
            opacity: phase === 'enter' ? 0 : active(phase) ? [0, 0.85, 0.5] : 0,
            rotate: active(phase) ? [-12 + i * 8, 0, i * 3] : 0,
            scale: active(phase) ? [0.5, 1.1, 1] : 0,
          }}
          transition={{ duration: 1.2, delay: i * 0.09 }}
        />
      ))}
    </>
  )
}

function HexVisual({ primary, secondary, accent, phase }: { primary: string; secondary: string; accent: string; phase: TransitionPhase }) {
  const colors = [primary, secondary, accent]
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2
        const radius = active(phase) ? 160 + (i % 4) * 30 : 100
        return (
          <motion.div
            key={i}
            className="absolute h-12 w-12 border-2"
            style={{
              borderColor: colors[i % 3],
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              boxShadow: `0 0 16px ${colors[i % 3]}55`,
            }}
            animate={{
              opacity: phase === 'enter' ? 0 : active(phase) ? [0.1, 0.75, 0.35] : 0,
              scale: active(phase) ? [0.3, 1.4, 1] : 0,
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              rotate: active(phase) ? [0, 60 + i * 10, 30] : 0,
            }}
            transition={{ duration: 1.2, delay: i * 0.04 }}
          />
        )
      })}
    </div>
  )
}

function LinesVisual({ primary, accent, secondary, phase }: { primary: string; accent: string; secondary: string; phase: TransitionPhase }) {
  const colors = [primary, accent, secondary]
  return (
    <>
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px]"
          style={{
            left: `${3 + i * 3.4}%`,
            top: 0,
            height: '100%',
            background: `linear-gradient(to bottom, transparent, ${colors[i % 3]}, transparent)`,
            boxShadow: `0 0 12px ${colors[i % 3]}88`,
          }}
          animate={{
            opacity: phase === 'enter' ? 0 : active(phase) ? [0.1, 0.9, 0.3] : 0,
            scaleY: active(phase) ? [0.1, 1.2, 0.5] : 0,
            y: active(phase) ? ['-20%', '20%', '-10%'] : 0,
          }}
          transition={{ duration: 1.3, delay: i * 0.025 }}
        />
      ))}
    </>
  )
}

function WavesVisual({ primary, secondary, accent, phase }: { primary: string; secondary: string; accent: string; phase: TransitionPhase }) {
  const colors = [primary, secondary, accent, primary]
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border-2"
          style={{ borderColor: colors[i], boxShadow: `0 0 24px ${colors[i]}66` }}
          animate={{
            width: phase === 'enter' ? 0 : [40, 280 + i * 120, 220 + i * 90],
            height: phase === 'enter' ? 0 : [40, 280 + i * 120, 220 + i * 90],
            x: '-50%',
            y: '-50%',
            opacity: phase === 'enter' ? 0 : active(phase) ? [0.6, 0.15, 0] : 0,
          }}
          transition={{ duration: 1.8, delay: i * 0.22, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[55vh] w-1 origin-bottom rounded-full"
        style={{ background: `linear-gradient(to top, transparent, ${primary}, ${accent})`, boxShadow: `0 0 30px ${primary}` }}
        animate={{
          rotate: active(phase) ? [0, 120, 240] : 0,
          opacity: phase === 'enter' ? 0 : active(phase) ? [0.3, 0.9, 0.4] : 0,
        }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
    </>
  )
}

export default function TransitionVisual({ destinationKey, phase }: TransitionVisualProps) {
  const variant = getTransitionVariant(destinationKey)

  const visual = (() => {
    switch (variant.particleShape) {
      case 'stars':
        return <StarsVisual primary={variant.primary} secondary={variant.secondary} accent={variant.accent} phase={phase} />
      case 'rings':
        return <RingsVisual primary={variant.primary} secondary={variant.secondary} accent={variant.accent} phase={phase} />
      case 'nodes':
        return <NodesVisual primary={variant.primary} accent={variant.accent} secondary={variant.secondary} phase={phase} />
      case 'frames':
        return <FramesVisual primary={variant.primary} secondary={variant.secondary} accent={variant.accent} phase={phase} />
      case 'hex':
        return <HexVisual primary={variant.primary} secondary={variant.secondary} accent={variant.accent} phase={phase} />
      case 'lines':
        return <LinesVisual primary={variant.primary} accent={variant.accent} secondary={variant.secondary} phase={phase} />
      case 'waves':
        return <WavesVisual primary={variant.primary} secondary={variant.secondary} accent={variant.accent} phase={phase} />
    }
  })()

  return (
    <>
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: phase === 'enter' ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `radial-gradient(circle at 50% 45%, ${variant.primary}44 0%, transparent 52%), radial-gradient(circle at 15% 85%, ${variant.secondary}33 0%, transparent 48%), radial-gradient(circle at 85% 20%, ${variant.accent}28 0%, transparent 45%)`,
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen opacity-40"
        style={{ background: `conic-gradient(from 0deg, transparent, ${variant.primary}22, transparent, ${variant.secondary}22, transparent)` }}
        animate={{ rotate: active(phase) ? 360 : 0, opacity: phase === 'enter' ? 0 : 0.5 }}
        transition={{ rotate: { duration: 2.5, ease: 'linear' }, opacity: { duration: 0.4 } }}
      />
      {visual}
    </>
  )
}
