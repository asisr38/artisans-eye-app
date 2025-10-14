'use client'

import { useCallback } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const EyeNav = () => {
  const total = useSceneStore((s) => s.eyes.length)
  const idx = useSceneStore((s) => s.currentEyeIndex)

  if (total <= 1) return null
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-4">
      <div className="pointer-events-auto select-none rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
        {idx + 1} / {total}
      </div>
    </div>
  )
}

export default EyeNav


