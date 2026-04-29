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

// Photo pins while bio scrolls past on desktop. Mobile collapses to a single
// column with no pin.
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

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])

  return (
    <section className="border-t border-[var(--hairline)] bg-[var(--color-ink-2)]">
      <div
        ref={ref}
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-24 sm:px-6 md:grid-cols-[minmax(0,1fr)_1.4fr] md:gap-16 md:py-40"
      >
        <div className="md:sticky md:top-24 md:self-start">
          <motion.div
            className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-ink-3)] ring-1 ring-[var(--hairline)]"
            style={reduceMotion ? undefined : { y: photoY }}
          >
            {photoSlot}
          </motion.div>
        </div>

        <div>
          <Reveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] text-[var(--color-cream-3)] sm:text-[11px]">
              {eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display mb-10 text-[clamp(2.25rem,5.4vw,4rem)] leading-[1.05] text-[var(--color-cream)]">
              {name}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mb-12 grid grid-cols-1 gap-y-5 border-y border-[var(--hairline)] py-7 text-sm sm:grid-cols-2 sm:gap-y-4">
              {meta}
            </dl>
          </Reveal>

          <div className="space-y-6 text-[17px] leading-[1.75] text-[var(--color-cream-2)] sm:text-[18px]">
            {bio}
          </div>

          <Reveal delay={0.1}>
            <blockquote className="font-display mt-12 border-l border-[var(--color-bronze)] pl-6 text-[clamp(1.4rem,2.4vw,1.875rem)] italic leading-[1.4] text-[var(--color-cream)]">
              {quote}
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
