'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], .magnetic-btn')) {
        cursor.classList.add('cursor-hover')
        follower.classList.add('follower-hover')
      }
    }

    const onMouseOut = () => {
      cursor.classList.remove('cursor-hover')
      follower.classList.remove('follower-hover')
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.15
      followerY += (mouseY - followerY) * 0.15
      follower.style.left = `${followerX}px`
      follower.style.top = `${followerY}px`
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-[var(--primary)] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background] duration-200 hidden lg:block [&.cursor-hover]:w-4 [&.cursor-hover]:h-4 [&.cursor-hover]:bg-[var(--primary)]/50"
      />
      <div
        ref={followerRef}
        className="fixed w-10 h-10 border border-[var(--primary)]/40 rounded-full pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-300 hidden lg:block [&.follower-hover]:w-16 [&.follower-hover]:h-16 [&.follower-hover]:border-[var(--primary)]/80"
      />
    </>
  )
}
