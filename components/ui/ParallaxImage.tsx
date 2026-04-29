'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

type Props = {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  badge?: string
  aspect?: string
  className?: string
}

// Slow scroll-linked drift. Gallery-mounted feel — the artifact hangs in
// place; the viewport moves around it.
export default function ParallaxImage({
  src,
  alt,
  priority,
  sizes,
  badge,
  aspect = 'aspect-[3/4]',
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.0, 1.05])

  return (
    <div
      ref={ref}
      className={`relative ${aspect} w-full max-w-2xl overflow-hidden bg-[var(--color-ink-2)] ring-1 ring-[var(--hairline)] ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y, scale }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </motion.div>

      {/* Gallery vignette — subtler than the previous radial. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_70%,rgba(0,0,0,0.35)_100%)]"
      />

      {badge && (
        <span className="absolute left-4 top-4 border border-[var(--hairline-strong)] bg-[var(--color-ink)]/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-[var(--color-cream-2)] backdrop-blur-sm">
          {badge}
        </span>
      )}
    </div>
  )
}
