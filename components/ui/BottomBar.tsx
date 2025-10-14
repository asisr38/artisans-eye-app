'use client'

import { useSceneStore } from '../state/useSceneStore'

export const BottomBar = () => {
  const total = useSceneStore((s) => s.eyes.length)
  const idx = useSceneStore((s) => s.currentEyeIndex)

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
      <div className="mx-auto mb-3 flex w-[min(700px,96%)] items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-md">
        {total > 1 && (
          <div className="pointer-events-auto select-none rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            {idx + 1} / {total}
          </div>
        )}
      </div>
    </div>
  )
}

export default BottomBar


