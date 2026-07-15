'use client'

import '@/lib/three/patch-three-clock'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Canvas, type CanvasProps } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { isWebGLAvailable } from '@/lib/showcase/webgl'

function WebGLContextGuard({
  onContextLost,
  onContextRestored,
}: {
  onContextLost: () => void
  onContextRestored: () => void
}) {
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement

    const handleLost = (event: Event) => {
      event.preventDefault()
      onContextLost()
    }

    const handleRestored = () => {
      onContextRestored()
    }

    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', handleRestored)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', handleRestored)
    }
  }, [gl, onContextLost, onContextRestored])

  return null
}

type SafeCanvasProps = CanvasProps & {
  fallback?: React.ReactNode
  mountKey?: number
  onContextLost?: () => void
  onContextRestored?: () => void
}

export function SafeCanvas({
  children,
  fallback = null,
  mountKey = 0,
  onContextLost,
  onContextRestored,
  dpr = [1, 1.5],
  gl,
  ...canvasProps
}: SafeCanvasProps) {
  const supported = useMemo(() => isWebGLAvailable(), [])
  const [contextLost, setContextLost] = useState(false)

  const handleLost = useCallback(() => {
    setContextLost(true)
    onContextLost?.()
  }, [onContextLost])

  const handleRestored = useCallback(() => {
    setContextLost(false)
    onContextRestored?.()
  }, [onContextRestored])

  if (!supported) {
    return <>{fallback}</>
  }

  if (contextLost) {
    if (fallback) {
      return <>{fallback}</>
    }
    return null
  }

  return (
    <Canvas
      key={mountKey}
      frameloop="always"
      dpr={dpr}
      className="pointer-events-none"
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        ...gl,
      }}
      {...canvasProps}
    >
      <WebGLContextGuard onContextLost={handleLost} onContextRestored={handleRestored} />
      {children}
    </Canvas>
  )
}
