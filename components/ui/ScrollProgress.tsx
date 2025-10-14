'use client'

import { useEffect, useRef, useState } from 'react'

// A lightweight scroll progress bar that grows with page scroll depth
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const calc = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight || document.body.scrollHeight
      const clientHeight = el.clientHeight
      const denom = Math.max(1, scrollHeight - clientHeight)
      const p = Math.min(1, Math.max(0, scrollTop / denom))
      setProgress(p)
    }
    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        calc()
      })
    }
    calc()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 z-[60] h-[3px] bg-transparent"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
      aria-hidden
    >
      <div
        className="h-full origin-left rounded-r-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 shadow-[0_0_8px_rgba(0,0,0,0.25)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}


