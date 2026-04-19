'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const HeroCanvas = dynamic(() => import('../3d/HeroCanvas'), { ssr: false })

export const HeroRoot = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section
      className="relative h-svh w-full overflow-hidden bg-black text-white"
      suppressHydrationWarning
    >
      {mounted && <HeroCanvas />}

      {/* Wordmark — top-left, persistent brand cue. PR 3 will make the eye
          itself collapse into this slot as an intro animation. */}
      <div className="pointer-events-none absolute left-6 top-6 z-10">
        <span className="text-sm font-light tracking-[0.2em] text-white/80">
          THE ARTISAN&rsquo;S EYE
        </span>
      </div>

      {/* Scroll cue — tells the visitor the page continues below the hero. */}
      <a
        href="#artifact"
        aria-label="Scroll to artifact"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50 transition-colors hover:text-white/90 focus-visible:text-white focus-visible:outline-none"
      >
        <span className="flex flex-col items-center gap-2 text-[10px] tracking-[0.3em]">
          SCROLL
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-bounce"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </section>
  )
}

export default HeroRoot
