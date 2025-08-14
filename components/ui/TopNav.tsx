'use client'

import { useCallback, useMemo } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const TopNav = () => {
  const phase = useSceneStore((s) => s.phase)
  const setMintPanelOpen = useSceneStore((s) => s.setMintPanelOpen)
  const triggerZoom = useSceneStore((s) => s.triggerZoom)
  const triggerReveal = useSceneStore((s) => s.triggerReveal)
  const reset = useSceneStore((s) => s.reset)

  const handleShowcase = useCallback(() => reset(), [reset])
  const handlePanorama = useCallback(() => {
    if (phase === 'idle') triggerZoom()
  }, [phase, triggerZoom])
  const handleReveal = useCallback(() => {
    triggerReveal()
  }, [triggerReveal])
  const handleMint = useCallback(() => setMintPanelOpen(true), [setMintPanelOpen])

  const phaseLabel = useMemo(() => {
    if (phase === 'idle') return 'Showcase'
    if (phase === 'zooming') return 'Zooming'
    if (phase === 'focused') return 'Panorama'
    if (phase === 'revealing') return 'Reveal'
    return phase
  }, [phase])

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <div className="mx-auto mt-3 flex w-[min(1024px,96%)] items-center justify-between rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-md">
        <div className="pointer-events-auto select-none pl-2 text-sm font-semibold tracking-wide text-amber-300">
          The Artisan’s Eye
        </div>
        <div className="pointer-events-auto flex items-center gap-1">
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            onClick={handleShowcase}
            aria-label="Go to Showcase"
            tabIndex={0}
          >
            Showcase
          </button>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            onClick={handlePanorama}
            aria-label="Enter Panorama"
            tabIndex={0}
          >
            Panorama
          </button>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            onClick={handleReveal}
            aria-label="Reveal World"
            tabIndex={0}
          >
            Reveal
          </button>
          <button
            type="button"
            className="rounded-full bg-amber-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
            onClick={handleMint}
            aria-label="Open Mint Panel"
            tabIndex={0}
          >
            Mint
          </button>
          <div className="ml-2 hidden rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/80 md:block">
            {phaseLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav


