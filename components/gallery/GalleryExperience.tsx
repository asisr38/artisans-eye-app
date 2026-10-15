'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { track } from '@vercel/analytics'
import { chapters } from './journey'

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
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const reducedMotion = useReducedMotion()
  const index = Math.round(progress)
  const chapter = chapters[index]
  const handleReady = useCallback(() => setReady(true), [])
  const handleFailed = useCallback(() => setFailed(true), [])

  useEffect(() => {
    let scheduled = 0
    const update = () => {
      scheduled = 0
      if (!section.current || !stage.current) return
      const travel = section.current.offsetHeight - stage.current.offsetHeight
      setProgress(
        Math.max(
          0,
          Math.min(2, (-section.current.getBoundingClientRect().top / Math.max(1, travel)) * 2),
        ),
      )
    }
    const schedule = () => {
      if (!scheduled) scheduled = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(scheduled)
    }
  }, [])

  function visit(next: number) {
    if (!section.current || !stage.current) return
    const top = window.scrollY + section.current.getBoundingClientRect().top
    const travel = section.current.offsetHeight - stage.current.offsetHeight
    window.scrollTo({
      top: top + (next / 2) * travel,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
    track('gallery_chapter_selected', { chapter: chapters[next].label })
  }

  return (
    <section ref={section} className="house-journey" aria-label="A house for art: guided gallery">
      <div ref={stage} className="house-sticky">
        <div
          className="house-scene"
          role="region"
          aria-label="Interactive Bhaktapur house with a thangka and planted courtyard"
        >
          <Image
            src="/artifacts/gallery-preview.png?v=4"
            alt="A sunlit timber gallery opening onto a planted courtyard, with an Avalokiteshvara thangka on its focal wall"
            fill
            preload
            sizes="100vw"
            className="gallery-poster"
          />
          {!failed && (
            <div className={`gallery-webgl ${ready ? 'is-ready' : ''}`} aria-hidden="true">
              <SceneBoundary onFailed={handleFailed}>
                <GalleryCanvas
                  progress={progress}
                  reducedMotion={!!reducedMotion}
                  onReady={handleReady}
                  onFailed={handleFailed}
                />
              </SceneBoundary>
            </div>
          )}
          <div className="house-topline">
            <span>The Artisan’s Eye / Bhaktapur study</span>
            <a href="/room">
              Walk freely <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="house-scroll-hint" aria-live="polite">
            {failed
              ? 'Gallery preview · the photograph study is available below'
              : !ready
                ? 'Preparing the house…'
                : reducedMotion
                  ? 'Scroll or choose a view'
                  : index === 2
                    ? 'Continue scrolling to the details'
                    : 'Scroll to move closer'}
          </p>
        </div>
        <div className="house-caption">
          <span className="house-chapter-number">
            0{index + 1} / {chapter.label}
          </span>
          <h1>{chapter.title}</h1>
          <p>{chapter.description}</p>
          <a href="#study" className="text-link">
            {index === 2 ? 'Study the details' : 'Go straight to the painting'}{' '}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <nav className="house-controls" aria-label="Guided gallery chapters">
          <button
            className="house-step"
            aria-label="Previous gallery view"
            disabled={index === 0}
            onClick={() => visit(index - 1)}
          >
            ←
          </button>
          <div className="house-chapters">
            {chapters.map((item, i) => (
              <button
                key={item.label}
                aria-current={index === i ? 'step' : undefined}
                onClick={() => visit(i)}
              >
                <span>0{i + 1}</span> {item.label}
              </button>
            ))}
            <a href="#study">
              <span>04</span> Details
            </a>
          </div>
          {index < 2 ? (
            <button
              className="house-step"
              aria-label="Next gallery view"
              onClick={() => visit(index + 1)}
            >
              →
            </button>
          ) : (
            <a className="house-step" href="#study" aria-label="Continue to painting details">
              ↘
            </a>
          )}
        </nav>
      </div>
    </section>
  )
}
