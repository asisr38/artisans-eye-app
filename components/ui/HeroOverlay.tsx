'use client'

import { useCallback } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const HeroOverlay = () => {
  const phase = useSceneStore((s) => s.phase)
  const triggerZoom = useSceneStore((s) => s.triggerZoom)
  const triggerReveal = useSceneStore((s) => s.triggerReveal)

  const handleActivate = useCallback(() => {
    if (phase === 'idle') {
      triggerZoom()
      return
    }
    if (phase === 'focused') {
      triggerReveal()
      return
    }
  }, [phase, triggerZoom, triggerReveal])

  const isIdle = phase === 'idle'

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-6">
      {/* Simple 2D headline for home page */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 select-none text-center text-white">
        <h1 className="text-2xl font-bold tracking-tight md:text-4xl">The Artisan’s Eye</h1>
        <p className="mt-1 text-sm text-white/80 md:text-base">Explore artifacts through an attentive gaze.</p>
      </div>
      <button
        type="button"
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleActivate()
        }}
        aria-label={isIdle ? 'Tap to reveal artifact' : 'Reveal the world'}
        tabIndex={0}
        className={`pointer-events-auto select-none rounded-full px-6 py-3.5 text-center text-base font-semibold text-white shadow-lg transition-all duration-300 ${
          isIdle
            ? 'bg-red-700/85 hover:bg-red-700 active:scale-95'
            : 'bg-amber-600/90 hover:bg-amber-500'
        } backdrop-blur-md border border-white/10`}
      >
        {isIdle ? 'Tap to Reveal' : 'Reveal World'}
      </button>
    </div>
  )
}

export default HeroOverlay


