'use client'

import { useCallback } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const HeroOverlay = () => {
  const phase = useSceneStore((s) => s.phase)
  const triggerZoom = useSceneStore((s) => s.triggerZoom)
  const setMintPanelOpen = useSceneStore((s) => s.setMintPanelOpen)
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
    if (phase === 'revealing') {
      setMintPanelOpen(true)
    }
  }, [phase, triggerZoom, triggerReveal, setMintPanelOpen])

  const isIdle = phase === 'idle'

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-6">
      <button
        type="button"
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleActivate()
        }}
        aria-label={isIdle ? 'Tap to reveal artifact' : phase === 'focused' ? 'Reveal the world' : 'Mint this artifact'}
        tabIndex={0}
        className={`pointer-events-auto select-none rounded-full px-6 py-3.5 text-center text-base font-semibold text-white shadow-lg transition-all duration-300 ${
          isIdle
            ? 'bg-red-700/85 hover:bg-red-700 active:scale-95'
            : 'bg-amber-600/90 hover:bg-amber-500'
        } backdrop-blur-md border border-white/10`}
      >
        {isIdle ? 'Tap to Reveal' : phase === 'focused' ? 'Reveal World' : 'Mint This Artifact'}
      </button>
    </div>
  )
}

export default HeroOverlay


