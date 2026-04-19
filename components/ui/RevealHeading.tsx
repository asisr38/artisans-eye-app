'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3'
}

// Apple-style word-by-word stagger. Each word rises from below with a small
// delay. Whole phrase clips below the baseline until it resolves.
export default function RevealHeading({
  children,
  className,
  delay = 0,
  as = 'h2',
}: Props) {
  const reduceMotion = useReducedMotion()
  const Tag = as

  const words = children.split(' ')

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
