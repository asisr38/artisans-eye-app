'use client'

import { useCallback } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const EyeNav = () => {
  const nextEye = useSceneStore((s) => s.nextEye)
  const idx = useSceneStore((s) => s.currentEyeIndex)
  const total = useSceneStore((s) => s.eyes.length)

  const handleNext = useCallback(() => nextEye(), [nextEye])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-4">
      <div className="pointer-events-auto select-none rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
        {idx + 1} / {total}
      </div>
      <button
        type="button"
        className="pointer-events-auto rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
        onClick={handleNext}
        aria-label="Next Eye"
      >
        Next
      </button>
    </div>
  )
}

export default EyeNav


