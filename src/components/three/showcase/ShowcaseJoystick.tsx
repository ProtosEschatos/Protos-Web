'use client'

import { useCallback, useRef } from 'react'
import type { TouchInput } from '@/lib/showcase-viewport'

type ShowcaseJoystickProps = {
  touchInput: React.MutableRefObject<TouchInput>
}

const OUTER = 123
const KNOB = 51
const MAX_RADIUS = (OUTER - KNOB) / 2 - 4

export function ShowcaseJoystick({ touchInput }: ShowcaseJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const pointerId = useRef<number | null>(null)

  const reset = useCallback(() => {
    touchInput.current = { active: false, x: 0, y: 0 }
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(-50%, -50%)'
    }
  }, [touchInput])

  const applyPointer = useCallback(
    (clientX: number, clientY: number) => {
      const base = baseRef.current
      if (!base) return

      const rect = base.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      let dx = clientX - cx
      let dy = clientY - cy
      const dist = Math.hypot(dx, dy)

      if (dist > MAX_RADIUS) {
        dx = (dx / dist) * MAX_RADIUS
        dy = (dy / dist) * MAX_RADIUS
      }

      if (knobRef.current) {
        knobRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
      }

      touchInput.current = {
        active: true,
        x: dx / MAX_RADIUS,
        y: dy / MAX_RADIUS,
      }
    },
    [touchInput],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    if (pointerId.current !== null) return
    pointerId.current = e.pointerId
    baseRef.current?.setPointerCapture(e.pointerId)
    applyPointer(e.clientX, e.clientY)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return
    applyPointer(e.clientX, e.clientY)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return
    pointerId.current = null
    baseRef.current?.releasePointerCapture(e.pointerId)
    reset()
  }

  return (
    <div
      ref={baseRef}
      className="fixed left-1/2 z-30 -translate-x-1/2 touch-none select-none md:hidden"
      style={{ width: OUTER, height: OUTER, bottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label="Move character"
      role="application"
    >
      <div className="absolute inset-0 rounded-full border border-white/15 bg-black/45 backdrop-blur-md shadow-[0_0_24px_rgba(255,0,153,0.2)]" />
      <div
        ref={knobRef}
        className="absolute left-1/2 top-1/2 rounded-full border-2 border-[#ff0099]/70 bg-gradient-to-br from-[#ff0099]/90 to-[#00eaff]/80 shadow-lg"
        style={{ width: KNOB, height: KNOB, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  )
}
