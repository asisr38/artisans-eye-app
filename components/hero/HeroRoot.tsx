'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const HeroCanvas = dynamic(() => import('../3d/HeroCanvas'), { ssr: false })

export const HeroRoot = () => {
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()
  useEffect(() => setMounted(true), [])

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      }

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <section
      className="relative h-svh w-full overflow-hidden bg-black text-white"
      suppressHydrationWarning
    >
      {mounted && <HeroCanvas />}

      {/* Wordmark — top-left, persistent brand cue. PR 3 will make the eye
          itself collapse into this slot as an intro animation. */}
      <motion.div
        className="pointer-events-none absolute left-6 top-6 z-10"
        {...fade}
      >
        <span className="text-[13px] font-light tracking-[0.3em] text-white/80">
          THE ARTISAN&rsquo;S EYE
        </span>
      </motion.div>

      {/* Scroll cue — tells the visitor the page continues below the hero. */}
      <motion.a
        href="#artifact"
        aria-label="Scroll to artifact"
        className="group absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-white/50 transition-colors hover:text-white/90 focus-visible:text-white focus-visible:outline-none"
        {...fadeUp}
      >
        <span className="flex flex-col items-center gap-3 text-[10px] tracking-[0.35em]">
          SCROLL
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-bounce transition-transform group-hover:translate-y-0.5"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </motion.a>
    </section>
  )
}

export default HeroRoot
