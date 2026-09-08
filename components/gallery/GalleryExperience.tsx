'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Component, useCallback, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { track } from '@vercel/analytics'
import type { GalleryView } from './GalleryCanvas'

const GalleryCanvas = dynamic(() => import('./GalleryCanvas'), { ssr: false })
class SceneBoundary extends Component<
  { children: ReactNode; onFailed: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFailed()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function GalleryExperience() {
  const [view, setView] = useState<GalleryView>('room')
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const reducedMotion = useReducedMotion()
  const handleReady = useCallback(() => setReady(true), [])
  const handleFailed = useCallback(() => setFailed(true), [])
  function changeView(next: GalleryView) {
    setView(next)
    track('gallery_view_selected', { view: next })
  }
  return (
    <div className="gallery-experience">
      <div
        className="gallery-stage"
        role="region"
        aria-label="Interactive gallery with an Avalokiteshvara thangka"
      >
        <Image
          src="/artifacts/gallery-preview.png"
          alt="A thangka displayed between timber screens in a warm plaster gallery"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 70vw"
          className="gallery-poster"
        />
        {!failed && (
          <div
            className={`gallery-webgl ${ready ? 'is-ready' : ''}`}
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
            aria-hidden="true"
          >
            <SceneBoundary onFailed={handleFailed}>
              <GalleryCanvas
                view={view}
                reducedMotion={!!reducedMotion}
                onReady={handleReady}
                onFailed={handleFailed}
              />
            </SceneBoundary>
          </div>
        )}
        <div className="gallery-corner-label">
          <span className="live-dot" />
          {failed ? 'Gallery preview' : 'The Bhaktapur room'}
        </div>
        <a className="gallery-study-link" href="#study">
          Study the painting <span aria-hidden="true">↗</span>
        </a>
        <p className="gallery-hint" aria-live="polite">
          {failed
            ? 'Explore the painting in the image study below.'
            : !ready
              ? 'Preparing the room…'
              : interactive
                ? 'Drag to look around. Use the views below to reset.'
                : 'A quiet place to look a little longer.'}
        </p>
      </div>
      <div className="gallery-toolbar">
        <div className="view-switch" aria-label="Gallery camera views">
          <button
            disabled={!ready || failed}
            aria-pressed={view === 'room'}
            onClick={() => changeView('room')}
          >
            01 <span>The room</span>
          </button>
          <button
            disabled={!ready || failed}
            aria-pressed={view === 'work'}
            onClick={() => changeView('work')}
          >
            02 <span>The work</span>
          </button>
        </div>
        <button
          className="explore-toggle"
          disabled={!ready || failed}
          aria-pressed={interactive}
          onClick={() => {
            setInteractive(!interactive)
            track('gallery_explore_toggle', { active: !interactive })
          }}
        >
          {interactive ? 'Finish exploring' : 'Drag to explore'}{' '}
          <span aria-hidden="true">{interactive ? '×' : '↔'}</span>
        </button>
      </div>
    </div>
  )
}
