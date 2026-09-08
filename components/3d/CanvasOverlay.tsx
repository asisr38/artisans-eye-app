'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSceneStore } from '../state/useSceneStore'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

const SHRINK_DURATION_S = 1.4

type SettledRect = { left: number; top: number; width: number; height: number }

// Fixed-position canvas. During intro it covers the viewport; once intro
// completes it shrinks (via CSS transform — no WebGL resize mid-animation)
// to a logo mark in the top-left. After the shrink finishes we measure the
// element's actual on-screen rect and re-lay it out at that exact size, so
// the GL buffer resizes once and per-frame cost collapses from full-viewport
// to a few thousand pixels. The element identity never changes — the WebGL
// context survives the switch.
export default function CanvasOverlay() {
  const introPhase = useSceneStore((s) => s.introPhase)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [settledRect, setSettledRect] = useState<SettledRect | null>(null)
  const [vp, setVp] = useState({ w: 1440, h: 900 })

  useEffect(() => {
    setMounted(true)
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const isDone = introPhase === 'done'
  const settled = settledRect !== null

  const settle = useCallback(() => {
    const el = wrapperRef.current
    if (!el) return
    // Measuring the post-transform rect (instead of recomputing it from
    // window dimensions) keeps the snap pixel-exact, including on mobile
    // where svh and innerHeight can disagree.
    const r = el.getBoundingClientRect()
    setSettledRect({ left: r.left, top: r.top, width: r.width, height: r.height })
  }, [])

  // Fallback for paths where the shrink never animates (intro skipped on a
  // revisit: `initial={false}` mounts directly at the end state, and
  // onAnimationComplete is not guaranteed to fire). vp in deps: a
  // rotation/resize mid-shrink restarts the animation, so push the fallback
  // out with it.
  useEffect(() => {
    if (!isDone || settled) return
    const timer = setTimeout(settle, SHRINK_DURATION_S * 1000 + 200)
    return () => clearTimeout(timer)
  }, [isDone, settled, vp, settle])

  if (!mounted) return null

  const isMobile = vp.w < 640

  // Logo end-state — small enough to read as an icon, big enough to feel
  // crafted on retina. Tweak per breakpoint.
  const logoSize = isMobile ? 36 : 44
  const logoOffsetX = isMobile ? 12 : 18
  const logoOffsetY = isMobile ? 12 : 18

  // The wrapper is 100vw × 100svh so WebGL renders at full resolution.
  // When "done", we scale + translate it down to the logo position.
  const scale = isDone ? logoSize / Math.max(vp.w, vp.h) : 1
  const targetCenterX = logoOffsetX + logoSize / 2
  const targetCenterY = logoOffsetY + logoSize / 2
  const tx = isDone ? targetCenterX - vp.w / 2 : 0
  const ty = isDone ? targetCenterY - vp.h / 2 : 0

  return (
    <motion.div
      ref={wrapperRef}
      aria-hidden={isDone}
      className={`fixed z-30 ${isDone ? 'pointer-events-none' : ''}`}
      initial={false}
      animate={settled ? { scale: 1, x: 0, y: 0 } : { scale, x: tx, y: ty }}
      transition={
        settled ? { duration: 0 } : { duration: SHRINK_DURATION_S, ease: [0.19, 1, 0.22, 1] }
      }
      style={settled ? { ...settledRect } : { inset: 0, transformOrigin: 'center center' }}
      onAnimationComplete={() => {
        if (isDone && !settled) settle()
      }}
    >
      <HeroCanvas compact={settled} />
    </motion.div>
  )
}
