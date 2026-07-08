'use client'

import { useEffect, useRef } from 'react'

/** Selectors that switch the cursor into its interactive (expanded) state. */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, .magnetic-btn, [data-cursor="hover"]'

export default function CustomCursor() {
  const coreRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    if (!mql.matches) return

    const core = coreRef.current
    const ring = ringRef.current
    if (!core || !ring) return

    const root = document.documentElement
    root.classList.add('cursor-none')

    // The desktop `zoom: 1.15` on <html> scales fixed px coordinates, so raw
    // clientX/Y drift from the pointer. Measure the applied zoom and divide.
    let zoom = 1
    const measureZoom = () => {
      const probe = document.createElement('div')
      probe.style.cssText =
        'position:fixed;left:0;top:0;width:100px;height:0;visibility:hidden;pointer-events:none;'
      document.body.appendChild(probe)
      const width = probe.getBoundingClientRect().width
      probe.remove()
      zoom = width > 0 ? width / 100 : 1
    }
    measureZoom()

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let visible = false

    const setVisible = (next: boolean) => {
      if (visible === next) return
      visible = next
      core.style.opacity = next ? '1' : '0'
      ring.style.opacity = next ? '1' : '0'
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX / zoom
      mouseY = e.clientY / zoom
      core.style.left = `${mouseX}px`
      core.style.top = `${mouseY}px`
      setVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest?.(INTERACTIVE)) {
        core.classList.add('is-hover')
        ring.classList.add('is-hover')
      }
    }

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest?.(INTERACTIVE)) {
        core.classList.remove('is-hover')
        ring.classList.remove('is-hover')
      }
    }

    const onDown = () => {
      core.classList.add('is-down')
      ring.classList.add('is-down')
    }
    const onUp = () => {
      core.classList.remove('is-down')
      ring.classList.remove('is-down')
    }
    const onLeaveWindow = () => setVisible(false)

    let raf = 0
    const animate = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    window.addEventListener('resize', measureZoom)

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('cursor-none')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      window.removeEventListener('resize', measureZoom)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={coreRef} className="cursor-core" aria-hidden="true" />
    </>
  )
}
