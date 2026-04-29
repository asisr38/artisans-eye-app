'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSceneStore } from '../state/useSceneStore'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

// Fixed-position canvas. During intro it covers the viewport; once intro
// completes it shrinks (via CSS transform — no WebGL resize) to a logo
// mark in the top-left and stays pinned for the rest of the session.
export default function CanvasOverlay() {
  const introPhase = useSceneStore((s) => s.introPhase)
  const [mounted, setMounted] = useState(false)
  const [vp, setVp] = useState({ w: 1440, h: 900 })

  useEffect(() => {
    setMounted(true)
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!mounted) return null

  const isDone = introPhase === 'done'
  const isMobile = vp.w < 640

  // Logo end-state — small enough to read as an icon, big enough to feel
  // crafted on retina. Tweak per breakpoint.
  const logoSize = isMobile ? 36 : 44
  const logoOffsetX = isMobile ? 12 : 18
  const logoOffsetY = isMobile ? 12 : 18

  // The wrapper is always 100vw × 100svh so WebGL renders at full resolution.
  // When "done", we scale + translate it down to the logo position.
  const scale = isDone ? logoSize / Math.max(vp.w, vp.h) : 1
  const targetCenterX = logoOffsetX + logoSize / 2
  const targetCenterY = logoOffsetY + logoSize / 2
  const tx = isDone ? targetCenterX - vp.w / 2 : 0
  const ty = isDone ? targetCenterY - vp.h / 2 : 0

  return (
    <motion.div
      aria-hidden={isDone}
      className={`fixed inset-0 z-30 ${isDone ? 'pointer-events-none' : ''}`}
      initial={false}
      animate={{ scale, x: tx, y: ty }}
      transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
      style={{ transformOrigin: 'center center' }}
    >
      <HeroCanvas />
    </motion.div>
  )
}
