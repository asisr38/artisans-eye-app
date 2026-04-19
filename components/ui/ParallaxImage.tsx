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
  className?: string
}

// Slow upward parallax + slight zoom-out as it scrolls past. Matches the
// Apple product-page feel where the hero image feels anchored to the page
// rather than riding with the viewport.
export default function ParallaxImage({
  src,
  alt,
  priority,
  sizes,
  badge,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08])

  return (
    <div
      ref={ref}
      className={`relative aspect-[4/5] w-full max-w-2xl overflow-hidden rounded-sm bg-black ring-1 ring-white/5 ${className}`}
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

      {/* gentle vignette to sell the premium edit */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]"
      />

      {badge && (
        <span className="absolute left-3 top-3 rounded bg-amber-400/90 px-2 py-1 font-mono text-[10px] font-semibold tracking-wide text-black">
          {badge}
        </span>
      )}
    </div>
  )
}
