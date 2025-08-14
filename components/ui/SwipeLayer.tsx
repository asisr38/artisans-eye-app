'use client'

import { useEffect, useRef } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const SwipeLayer = () => {
  const phase = useSceneStore((s) => s.phase)
  const nextEye = useSceneStore((s) => s.nextEye)
  const prevEye = useSceneStore((s) => s.prevEye)
  const startRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onTouchStartListener: EventListener = (ev) => {
      const e = ev as TouchEvent
      if (phase !== 'idle') return
      const t = e.touches[0]
      startRef.current = { x: t.clientX, y: t.clientY }
    }
    const onTouchMoveListener: EventListener = (ev) => {
      const e = ev as TouchEvent
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
    const onTouchEndListener: EventListener = () => {
      startRef.current = null
    }
    const el = document
    el.addEventListener('touchstart', onTouchStartListener, { passive: true })
    el.addEventListener('touchmove', onTouchMoveListener, { passive: true })
    el.addEventListener('touchend', onTouchEndListener)
    return () => {
      el.removeEventListener('touchstart', onTouchStartListener)
      el.removeEventListener('touchmove', onTouchMoveListener)
      el.removeEventListener('touchend', onTouchEndListener)
    }
  }, [phase, nextEye, prevEye])

  return null
}

export default SwipeLayer


