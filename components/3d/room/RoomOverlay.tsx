'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { useRoomStore } from '../../state/useRoomStore'

const ease = [0.19, 1, 0.22, 1] as const

type Props = {
  artifactTitle: string
  artifactSubtitle: string
  onInquire: () => void
  onExit: () => void
}

// 2D DOM layer over the room canvas: enter prompt, controls hint, artifact
// label + Inquire CTA (revealed by the inspect hotspot), and an always-
// visible exit control.
export default function RoomOverlay({ artifactTitle, artifactSubtitle, onInquire, onExit }: Props) {
  const entered = useRoomStore((s) => s.entered)
  const inspecting = useRoomStore((s) => s.inspecting)
  const pointerLockFailed = useRoomStore((s) => s.pointerLockFailed)
  const locked = useRoomStore((s) => s.locked)
  const requestLock = useRoomStore((s) => s.requestLock)
  const requestViewPainting = useRoomStore((s) => s.requestViewPainting)

  const isCoarsePointer = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    [],
  )
  const canPointerLock =
    typeof document !== 'undefined' &&
    'onpointerlockchange' in document &&
    !isCoarsePointer &&
    !pointerLockFailed

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Exit — always reachable. */}
      <button
        type="button"
        onClick={onExit}
        className="pointer-events-auto absolute right-4 top-4 z-20 flex min-h-[44px] items-center border border-[var(--hairline-strong)] bg-[rgba(11,10,8,0.6)] px-4 text-[10px] uppercase tracking-[0.32em] text-[var(--color-cream-2)] backdrop-blur transition-colors duration-300 hover:border-[var(--color-cream)] hover:text-[var(--color-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
      >
        Exit room
      </button>

      {/* Controls reference for screen-reader users once inside the room
          (the visible hint only exists on the enter prompt). */}
      {entered && (
        <p className="sr-only">
          Move with W, A, S, D or the arrow keys. Turn with the left and right arrow keys or Q and
          E. The View painting button moves you directly in front of the painting. Press Escape to
          exit the room.
        </p>
      )}

      {/* Enter prompt — covers the room until the visitor starts. */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="enter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease }}
            className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-[rgba(11,10,8,0.72)] px-6 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-cream-3)]">
              The gallery room
            </p>
            <h2 className="font-display max-w-md text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.1] text-[var(--color-cream)]">
              {artifactTitle}
            </h2>
            {canPointerLock ? (
              <button
                type="button"
                onClick={requestLock}
                className="flex min-h-[50px] items-center border border-[var(--color-cream)] bg-[var(--color-cream)] px-8 text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink)] transition-colors duration-500 hover:bg-transparent hover:text-[var(--color-cream)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
              >
                Click to enter
              </button>
            ) : (
              <button
                type="button"
                onClick={() => useRoomStore.getState().setEntered(true)}
                className="flex min-h-[50px] items-center border border-[var(--color-cream)] bg-[var(--color-cream)] px-8 text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink)] transition-colors duration-500 hover:bg-transparent hover:text-[var(--color-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
              >
                Enter the room
              </button>
            )}
            <button
              type="button"
              onClick={requestViewPainting}
              className="pointer-events-auto text-[10px] uppercase tracking-[0.32em] text-[var(--color-cream-2)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
            >
              Or view the painting directly
            </button>
            <p className="max-w-xs text-[12px] leading-relaxed text-[var(--color-cream-2)]">
              {canPointerLock
                ? 'Move with W A S D or arrow keys · look with the mouse · Esc to release'
                : isCoarsePointer
                  ? 'Tap the floor to walk · drag to look around'
                  : 'Move with W A S D or arrows · turn with ← → or Q E'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {entered && pointerLockFailed && !inspecting && (
        <p
          role="status"
          className="absolute bottom-7 left-1/2 w-[min(90vw,420px)] -translate-x-1/2 bg-[rgba(11,10,8,0.8)] px-5 py-3 text-center text-sm text-[var(--color-cream)]"
        >
          Drag to look around. Move with W A S D or arrow keys.
        </p>
      )}

      {/* Paused hint — pointer lock released mid-visit. */}
      <AnimatePresence>
        {entered && canPointerLock && !locked && (
          <motion.button
            key="resume"
            type="button"
            onClick={requestLock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="pointer-events-auto absolute bottom-7 left-1/2 z-10 -translate-x-1/2 border border-[var(--hairline-strong)] bg-[rgba(11,10,8,0.6)] px-5 py-3 text-[10px] uppercase tracking-[0.32em] text-[var(--color-cream-2)] backdrop-blur transition-colors duration-300 hover:text-[var(--color-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
          >
            Click to walk the room
          </motion.button>
        )}
      </AnimatePresence>

      {/* "View painting" — persistent non-walk path once inside. */}
      {entered && !inspecting && (
        <button
          type="button"
          onClick={requestViewPainting}
          className="pointer-events-auto absolute left-4 top-4 z-10 flex min-h-[44px] items-center border border-[var(--hairline-strong)] bg-[rgba(11,10,8,0.6)] px-4 text-[10px] uppercase tracking-[0.32em] text-[var(--color-cream-2)] backdrop-blur transition-colors duration-300 hover:border-[var(--color-cream)] hover:text-[var(--color-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
        >
          View painting
        </button>
      )}

      {/* Artifact label + CTA — revealed within inspect range. */}
      <AnimatePresence>
        {inspecting && (
          <motion.div
            key="label"
            role="status"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.7, ease }}
            className="pointer-events-auto absolute bottom-8 left-1/2 z-10 w-[min(92vw,460px)] -translate-x-1/2 border border-[var(--hairline)] bg-[rgba(11,10,8,0.78)] p-6 text-center backdrop-blur"
          >
            <p className="mb-2 text-[10px] uppercase tracking-[0.42em] text-[var(--color-cream-2)]">
              {artifactSubtitle}
            </p>
            <h3 className="font-display mb-4 text-[22px] leading-tight text-[var(--color-cream)]">
              {artifactTitle}
            </h3>
            <button
              type="button"
              onClick={onInquire}
              className="mx-auto flex min-h-[46px] items-center border border-[var(--color-cream)] bg-[var(--color-cream)] px-6 text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink)] transition-colors duration-500 hover:bg-transparent hover:text-[var(--color-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
            >
              Inquire to purchase
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
