'use client'

import { useCallback } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const HeroOverlay = () => {
  const phase = useSceneStore((s) => s.phase)
  const triggerZoom = useSceneStore((s) => s.triggerZoom)
  const setMintPanelOpen = useSceneStore((s) => s.setMintPanelOpen)

  const handleActivate = useCallback(() => {
    if (phase === 'idle') {
      triggerZoom()
      return
    }
    if (phase === 'focused') {
      setMintPanelOpen(true)
    }
  }, [phase, triggerZoom, setMintPanelOpen])

  const isIdle = phase === 'idle'

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-6">
      <button
        type="button"
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleActivate()
        }}
        aria-label={isIdle ? 'Tap to reveal artifact' : 'Mint this artifact'}
        tabIndex={0}
        className={`pointer-events-auto select-none rounded-full px-5 py-3 text-center font-medium text-white shadow-lg transition-all duration-300 ${
          isIdle
            ? 'bg-red-700/80 hover:bg-red-700/90 active:scale-95'
            : 'bg-zinc-800/60'
        } backdrop-blur-md border border-white/10`}
      >
        {isIdle ? 'Tap to Reveal' : 'Mint'}
      </button>
    </div>
  )
}

export default HeroOverlay


