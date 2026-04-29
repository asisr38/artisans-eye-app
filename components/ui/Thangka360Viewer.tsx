'use client'

import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { KeyboardEvent, PointerEvent } from 'react'
import { useRef, useState } from 'react'

type Props = {
  src: string
  textureSrc: string
  alt: string
  priority?: boolean
  onEnter?: () => void
}

export default function Thangka360Viewer({
  src,
  textureSrc,
  alt,
  priority,
  onEnter,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(false)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const sheenX = useMotionValue(50)

  const smoothX = useSpring(rotateX, { stiffness: 140, damping: 24, mass: 0.7 })
  const smoothY = useSpring(rotateY, { stiffness: 140, damping: 24, mass: 0.7 })
  const smoothSheen = useSpring(sheenX, { stiffness: 120, damping: 26, mass: 0.7 })
  const sheenGradient = useTransform(
    smoothSheen,
    (x) =>
      `linear-gradient(105deg, transparent 0%, transparent ${x - 18}%, rgba(255,239,196,0.22) ${x}%, transparent ${x + 18}%, transparent 100%)`,
  )

  function updateOrbit(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return

    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const clampedX = Math.max(0, Math.min(1, x))
    const clampedY = Math.max(0, Math.min(1, y))

    rotateY.set((clampedX - 0.5) * 42)
    rotateX.set((0.5 - clampedY) * 10)
    sheenX.set(clampedX * 100)
  }

  function resetOrbit() {
    if (active || reduceMotion) return
    rotateX.set(0)
    rotateY.set(0)
    sheenX.set(50)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!onEnter) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onEnter()
    }
  }

  return (
    <div
      ref={stageRef}
      className={`relative mx-auto flex aspect-[4/5] w-full max-w-5xl touch-none items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-[#070708] shadow-2xl shadow-black/50 md:aspect-[16/10] ${
        onEnter ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300/80' : ''
      }`}
      onPointerDown={(event) => {
        setActive(true)
        pointerStartRef.current = { x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
        updateOrbit(event)
      }}
      onPointerMove={updateOrbit}
      onPointerUp={(event) => {
        setActive(false)
        const start = pointerStartRef.current
        pointerStartRef.current = null

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }

        if (onEnter && start) {
          const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y)
          if (moved < 8) onEnter()
        }
      }}
      onPointerCancel={() => {
        setActive(false)
        pointerStartRef.current = null
      }}
      onPointerLeave={resetOrbit}
      onKeyDown={handleKeyDown}
      role={onEnter ? 'button' : 'img'}
      tabIndex={onEnter ? 0 : undefined}
      aria-label={onEnter ? `${alt}. Open 360 room view.` : alt}
    >
      <Image
        src={textureSrc}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover opacity-20 blur-xl scale-110 saturate-75"
        aria-hidden
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,128,0.14),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.07),transparent_24%,rgba(0,0,0,0.55)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-[8%] bottom-[9%] h-[18%] rounded-full bg-black/65 blur-3xl"
      />

      <motion.div
        className="relative z-10 aspect-[2/3] h-[84%] max-h-[780px] origin-center [transform-style:preserve-3d]"
        style={{
          rotateX: smoothX,
          rotateY: smoothY,
          transformPerspective: 1200,
        }}
      >
        <div className="absolute -inset-3 bg-black/35 blur-2xl" />
        <div className="absolute -right-2 top-3 h-[calc(100%-1.5rem)] w-3 rounded-r-sm bg-gradient-to-r from-[#201714] to-[#5f4637] [transform:rotateY(82deg)_translateZ(5px)]" />

        <div className="relative h-full overflow-hidden rounded-sm bg-black ring-1 ring-amber-200/25">
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 768px) 82vw, 520px"
            className="object-cover"
            draggable={false}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-45 mix-blend-screen"
            style={{ background: sheenGradient }}
          />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-sm border border-white/15 bg-black/45 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/90 backdrop-blur">
        360° Artifact
      </div>
    </div>
  )
}
