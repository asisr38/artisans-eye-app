'use client'

import Image from 'next/image'
import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { track } from '@vercel/analytics'
import RoomCanvas from './RoomCanvas'
import RoomOverlay from './RoomOverlay'
import { useRoomStore } from '../../state/useRoomStore'

const ARTIFACT_TITLE = 'Thousand-Armed Avalokiteshvara Thangka'
const ARTIFACT_SUBTITLE = 'Thangka · Kathmandu Valley'
const FALLBACK_IMAGE = '/artifacts/thangka-centerpiece.jpg'

// <Canvas> throws synchronously when a WebGL context cannot be created —
// catch it and show the static fallback instead of a dead screen.
class CanvasErrorBoundary extends Component<
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFail()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function StaticFallback({ onInquire }: { onInquire: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="relative aspect-[2/3] w-[min(60vw,320px)] overflow-hidden border border-[var(--hairline)]">
        <Image
          src={FALLBACK_IMAGE}
          alt={ARTIFACT_TITLE}
          fill
          sizes="320px"
          className="object-cover"
        />
      </div>
      <p className="text-[9px] uppercase tracking-[0.42em] text-[var(--color-cream-3)]">
        {ARTIFACT_SUBTITLE}
      </p>
      <h2 className="font-display max-w-md text-[clamp(1.6rem,4vw,2.2rem)] leading-[1.1] text-[var(--color-cream)]">
        {ARTIFACT_TITLE}
      </h2>
      <button
        type="button"
        onClick={onInquire}
        className="flex min-h-[46px] items-center border border-[var(--color-cream)] bg-[var(--color-cream)] px-6 text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink)] transition-colors duration-500 hover:bg-transparent hover:text-[var(--color-cream)]"
      >
        Inquire to purchase
      </button>
    </div>
  )
}

type Props = {
  // Overlay mode (hero entry): provided — closes back to the page.
  // Route mode (/room): omitted — exit navigates home.
  onClose?: () => void
}

// Self-contained walkable room (AE-101). Mounted two ways: as a lazy
// full-screen overlay from the hero's "View artifact" CTA, and at /room
// (noindex) for isolated evaluation.
export default function ThangkaRoomExperience({ onClose }: Props) {
  const [webglFailed, setWebglFailed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // WebGL preflight — cheaper than letting the whole canvas tree mount and
  // throw. No failIfMajorPerformanceCaveat: software GL renders this room.
  const webglSupported = useMemo(() => {
    if (typeof document === 'undefined') return false
    try {
      const c = document.createElement('canvas')
      return !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      return false
    }
  }, [])

  // Move focus into the experience on open so keyboard users aren't left on
  // the (now obscured) trigger.
  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  // Minimal Tab trap for the overlay mode — aria-modal alone doesn't trap in
  // most AT/browser combinations. /room (no onClose) is a full page and
  // doesn't need one.
  const handleTrapKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!onClose || e.key !== 'Tab') return
    const root = rootRef.current
    if (!root) return
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === root)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // Fresh discrete state per visit + analytics lifecycle.
  useEffect(() => {
    useRoomStore.setState({ entered: false, inspecting: false, locked: false })
    const openedAt = performance.now()
    track('room_opened')

    const unsubEntered = useRoomStore.subscribe(
      (s) => s.entered,
      (entered) => {
        if (entered) track('room_entered')
      },
    )
    let inspectTracked = false
    const unsubInspect = useRoomStore.subscribe(
      (s) => s.inspecting,
      (inspecting) => {
        if (inspecting && !inspectTracked) {
          inspectTracked = true
          track('room_inspect_reached')
        }
      },
    )

    return () => {
      unsubEntered()
      unsubInspect()
      track('room_exited', {
        seconds: Math.round((performance.now() - openedAt) / 1000),
      })
    }
  }, [])

  // Lock page scroll while the room owns the screen.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const handleExit = useCallback(() => {
    if (onClose) onClose()
    else window.location.assign('/')
  }, [onClose])

  // Escape exits the room — but only when pointer lock isn't holding it
  // (the browser consumes the first Esc to release the lock).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.pointerLockElement) handleExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleExit])

  const handleInquire = () => {
    track('room_inquire_click')
    if (onClose) {
      onClose()
      requestAnimationFrame(() => {
        document.getElementById('inquire')?.scrollIntoView({ behavior: 'smooth' })
      })
    } else {
      window.location.assign('/#inquire')
    }
  }

  const showFallback = !webglSupported || webglFailed

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      // Dialog semantics only in overlay mode; at /room the experience IS
      // the page, not a dialog that appeared unprompted.
      role={onClose ? 'dialog' : undefined}
      aria-modal={onClose ? 'true' : undefined}
      aria-label={`Gallery room — ${ARTIFACT_TITLE}`}
      onKeyDown={handleTrapKeyDown}
      className="fixed inset-0 z-[1000] bg-[var(--color-ink)] focus:outline-none"
    >
      {showFallback ? (
        <>
          <StaticFallback onInquire={handleInquire} />
          <button
            type="button"
            onClick={handleExit}
            className="absolute right-4 top-4 flex min-h-[44px] items-center border border-[var(--hairline-strong)] px-4 text-[10px] uppercase tracking-[0.32em] text-[var(--color-cream-2)] transition-colors duration-300 hover:text-[var(--color-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
          >
            Exit room
          </button>
        </>
      ) : (
        <>
          {/* The canvas is purely presentational — the accessible content
              lives in RoomOverlay. */}
          <div className="absolute inset-0" aria-hidden="true">
            <CanvasErrorBoundary onFail={() => setWebglFailed(true)}>
              <RoomCanvas />
            </CanvasErrorBoundary>
          </div>
          <RoomOverlay
            artifactTitle={ARTIFACT_TITLE}
            artifactSubtitle={ARTIFACT_SUBTITLE}
            onInquire={handleInquire}
            onExit={handleExit}
          />
        </>
      )}
    </div>
  )
}
