'use client'

import { motion } from 'framer-motion'
import type { TransitionPhase } from '@/components/navigation/PageTransitionProvider'
import type { TransitionDestinationKey } from '@/lib/main-nav-routes'
import { getTransitionVariant } from '@/lib/transition-variants'

type TransitionVisualProps = {
  destinationKey: TransitionDestinationKey | null
  phase: TransitionPhase
}

function StarsVisual({ primary, secondary, phase }: { primary: string; secondary: string; phase: TransitionPhase }) {
  return (
    <>
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            background: i % 2 === 0 ? primary : secondary,
          }}
          animate={{
            opacity: phase === 'enter' ? 0 : phase === 'loading' ? 0.7 : 0.35,
            scale: phase === 'exit' ? [0, 1.5, 1] : phase === 'enter' ? 0 : 1,
            y: phase === 'loading' ? -40 - i * 2 : 0,
          }}
          transition={{ duration: 0.9, delay: i * 0.02 }}
        />
      ))}
    </>
  )
}

function RingsVisual({ primary, secondary, phase }: { primary: string; secondary: string; phase: TransitionPhase }) {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{ borderColor: i % 2 === 0 ? primary : secondary }}
          initial={{ width: 40, height: 40, x: '-50%', y: '-50%', opacity: 0 }}
          animate={{
            width: phase === 'enter' ? 40 : 80 + i * 100,
            height: phase === 'enter' ? 40 : 80 + i * 100,
            x: '-50%',
            y: '-50%',
            opacity: phase === 'enter' ? 0 : 0.35 - i * 0.06,
            rotate: phase === 'loading' ? 180 + i * 20 : 0,
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

function NodesVisual({ primary, accent, phase }: { primary: string; accent: string; phase: TransitionPhase }) {
  const nodes = [
    { x: '20%', y: '30%' },
    { x: '50%', y: '50%' },
    { x: '75%', y: '35%' },
    { x: '35%', y: '70%' },
    { x: '65%', y: '68%' },
  ]
  return (
    <>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-3 rounded-full"
          style={{ left: n.x, top: n.y, background: i % 2 === 0 ? primary : accent }}
          animate={{
            opacity: phase === 'enter' ? 0 : [0.3, 1, 0.4],
            scale: phase === 'exit' ? [0, 1.8, 1] : phase === 'enter' ? 0 : 1,
            x: phase === 'loading' ? (i % 2 === 0 ? 30 : -30) : 0,
            y: phase === 'loading' ? (i % 2 === 0 ? -20 : 20) : 0,
          }}
          transition={{ duration: 0.9, delay: i * 0.08 }}
        />
      ))}
    </>
  )
}

function FramesVisual({ primary, secondary, phase }: { primary: string; secondary: string; phase: TransitionPhase }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg border-2"
          style={{
            borderColor: i % 2 === 0 ? primary : secondary,
            width: 100 + i * 40,
            height: 60 + i * 24,
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: phase === 'exit' || phase === 'loading' ? -50 - i * 80 : '-50%',
            y: '-50%',
            opacity: phase === 'enter' ? 0 : 0.45,
            rotate: phase === 'loading' ? i * 6 : 0,
          }}
          transition={{ duration: 0.9, delay: i * 0.1 }}
        />
      ))}
    </>
  )
}

function HexVisual({ primary, secondary, phase }: { primary: string; secondary: string; phase: TransitionPhase }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-10 w-10 rotate-[30deg] border"
          style={{ borderColor: i % 2 === 0 ? primary : secondary, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          animate={{
            opacity: phase === 'enter' ? 0 : 0.25,
            scale: phase === 'exit' ? 0.3 : 1.2 + (i % 3) * 0.3,
            rotate: 30 + (phase === 'loading' ? i * 15 : 0),
            x: Math.cos((i / 12) * Math.PI * 2) * (phase === 'loading' ? 140 : 80),
            y: Math.sin((i / 12) * Math.PI * 2) * (phase === 'loading' ? 140 : 80),
          }}
          transition={{ duration: 1, delay: i * 0.04 }}
        />
      ))}
    </div>
  )
}

function LinesVisual({ primary, accent, phase }: { primary: string; accent: string; phase: TransitionPhase }) {
  return (
    <>
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px"
          style={{
            left: `${8 + i * 5.5}%`,
            top: 0,
            height: '100%',
            background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? primary : accent}, transparent)`,
          }}
          animate={{
            opacity: phase === 'enter' ? 0 : [0.1, 0.6, 0.1],
            scaleY: phase === 'exit' || phase === 'loading' ? [0.2, 1, 0.4] : 0,
            y: phase === 'loading' ? ['-10%', '10%', '-10%'] : 0,
          }}
          transition={{ duration: 1.4, delay: i * 0.04 }}
        />
      ))}
    </>
  )
}

function WavesVisual({ primary, secondary, phase }: { primary: string; secondary: string; phase: TransitionPhase }) {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border-2"
          style={{ borderColor: i % 2 === 0 ? primary : secondary }}
          animate={{
            width: phase === 'enter' ? 0 : [60, 200 + i * 100],
            height: phase === 'enter' ? 0 : [60, 200 + i * 100],
            x: '-50%',
            y: '-50%',
            opacity: phase === 'enter' ? 0 : [0.5, 0.1],
          }}
          transition={{ duration: 1.6, delay: i * 0.25 }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 h-1/2 w-0.5 origin-bottom"
        style={{ background: `linear-gradient(to top, transparent, ${primary})` }}
        animate={{ rotate: phase === 'loading' ? 180 : 0, opacity: phase === 'enter' ? 0 : 0.5 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </>
  )
}

export default function TransitionVisual({ destinationKey, phase }: TransitionVisualProps) {
  const variant = getTransitionVariant(destinationKey)

  const visual = (() => {
    switch (variant.particleShape) {
      case 'stars':
        return <StarsVisual primary={variant.primary} secondary={variant.secondary} phase={phase} />
      case 'rings':
        return <RingsVisual primary={variant.primary} secondary={variant.secondary} phase={phase} />
      case 'nodes':
        return <NodesVisual primary={variant.primary} accent={variant.accent} phase={phase} />
      case 'frames':
        return <FramesVisual primary={variant.primary} secondary={variant.secondary} phase={phase} />
      case 'hex':
        return <HexVisual primary={variant.primary} secondary={variant.secondary} phase={phase} />
      case 'lines':
        return <LinesVisual primary={variant.primary} accent={variant.accent} phase={phase} />
      case 'waves':
        return <WavesVisual primary={variant.primary} secondary={variant.secondary} phase={phase} />
    }
  })()

  return (
    <>
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: phase === 'enter' ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${variant.primary}22 0%, transparent 50%), radial-gradient(circle at 20% 80%, ${variant.secondary}18 0%, transparent 45%)`,
        }}
      />
      {visual}
    </>
  )
}
