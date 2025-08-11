'use client'

import { useEffect, useRef } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const SwipeLayer = () => {
  const phase = useSceneStore((s) => s.phase)
  const nextEye = useSceneStore((s) => s.nextEye)
  const prevEye = useSceneStore((s) => s.prevEye)
  const startRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (phase !== 'idle') return
      const t = e.touches[0]
      startRef.current = { x: t.clientX, y: t.clientY }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (phase !== 'idle' || !startRef.current) return
      const t = e.touches[0]
      const dx = t.clientX - startRef.current.x
      const dy = t.clientY - startRef.current.y
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextEye()
        else prevEye()
        startRef.current = null
      }
    }
    const onTouchEnd = () => {
      startRef.current = null
    }
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [phase, nextEye, prevEye])

  return null
}

export default SwipeLayer


