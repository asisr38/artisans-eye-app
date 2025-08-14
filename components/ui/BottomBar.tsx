'use client'

import { useCallback } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const BottomBar = () => {
  const nextEye = useSceneStore((s) => s.nextEye)
  const prevEye = useSceneStore((s) => s.prevEye)
  const setMintPanelOpen = useSceneStore((s) => s.setMintPanelOpen)

  const handlePrev = useCallback(() => prevEye(), [prevEye])
  const handleNext = useCallback(() => nextEye(), [nextEye])
  const handleMint = useCallback(() => setMintPanelOpen(true), [setMintPanelOpen])

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
      <div className="mx-auto mb-3 flex w-[min(700px,96%)] items-center justify-between rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-md">
        <button
          type="button"
          className="pointer-events-auto rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
          onClick={handlePrev}
          aria-label="Previous Eye"
        >
          Prev
        </button>
        <button
          type="button"
          className="pointer-events-auto rounded-full bg-amber-600/90 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-500"
          onClick={handleMint}
          aria-label="Open Mint Panel"
        >
          Mint
        </button>
        <button
          type="button"
          className="pointer-events-auto rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
          onClick={handleNext}
          aria-label="Next Eye"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default BottomBar


