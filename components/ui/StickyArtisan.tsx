'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import Reveal from './Reveal'

type Props = {
  photoSlot: ReactNode
  eyebrow: string
  name: ReactNode
  meta: ReactNode
  bio: ReactNode
  quote: ReactNode
}

// Apple-style: photo pins while bio scrolls past it. Desktop only — on mobile
// the column collapses and the pin is disabled (sticky just sits).
export default function StickyArtisan({
  photoSlot,
  eyebrow,
  name,
  meta,
  bio,
  quote,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // photo drifts up slightly as bio scrolls past
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])

  return (
    <section className="border-t border-white/5 bg-[#0A0A0D]">
      <div
        ref={ref}
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[minmax(0,1fr)_1.4fr] md:py-32"
      >
        <div className="md:sticky md:top-24 md:self-start">
          <motion.div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-white/[0.03] ring-1 ring-white/5"
            style={reduceMotion ? undefined : { y: photoY }}
          >
            {photoSlot}
          </motion.div>
        </div>

        <div>
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
              {eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mb-8 text-4xl font-semibold tracking-[-0.02em] text-white md:text-5xl">
              {name}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mb-10 grid grid-cols-2 gap-y-4 border-y border-white/10 py-6 text-sm">
              {meta}
            </dl>
          </Reveal>

          <div className="space-y-5 text-[17px] leading-relaxed text-white/75">
            {bio}
          </div>

          <Reveal delay={0.1}>
            <blockquote className="mt-10 border-l-2 border-amber-400/60 pl-6 text-xl italic leading-relaxed text-white/90">
              {quote}
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
