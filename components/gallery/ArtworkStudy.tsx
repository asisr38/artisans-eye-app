'use client'

import Image from 'next/image'
import { useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { track } from '@vercel/analytics'

const notes = [
  {
    title: 'The whole composition',
    copy: 'Follow the symmetry from the eleven faces to the radiating hands. Begin with the whole, then move closer.',
    scale: 1,
    y: 0,
  },
  {
    title: 'Eleven faces',
    copy: 'The stacked faces are one of the defining features of this form of Avalokiteshvara. Look closely at the changes in color and expression.',
    scale: 2.8,
    y: 0.16,
  },
  {
    title: 'Hands at the heart',
    copy: 'At the center of the surrounding movement, the joined hands form a point of stillness.',
    scale: 3,
    y: 0.03,
  },
]
const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n))

export default function ArtworkStudy() {
  const stage = useRef<HTMLDivElement>(null)
  const points = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef(0)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [note, setNote] = useState(0)
  function bounded(x: number, y: number, scale = zoom) {
    const r = stage.current?.getBoundingClientRect()
    return {
      x: clamp(x, (-(r?.width ?? 0) * (scale - 1)) / 2, ((r?.width ?? 0) * (scale - 1)) / 2),
      y: clamp(y, (-(r?.height ?? 0) * (scale - 1)) / 2, ((r?.height ?? 0) * (scale - 1)) / 2),
    }
  }
  function changeZoom(next: number) {
    const z = clamp(next, 1, 4)
    setZoom(z)
    setPan((p) => bounded(p.x, p.y, z))
  }
  function selectNote(i: number) {
    const n = notes[i]
    setNote(i)
    setZoom(n.scale)
    setPan({ x: 0, y: (stage.current?.clientHeight ?? 0) * n.y * n.scale })
    track('artwork_detail_selected', { detail: i })
  }
  function down(e: PointerEvent<HTMLDivElement>) {
    if (zoom === 1) return
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    e.currentTarget.setPointerCapture(e.pointerId)
    if (points.current.size === 2) {
      const [a, b] = [...points.current.values()]
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y)
    }
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    const prev = points.current.get(e.pointerId)
    if (!prev) return
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (points.current.size === 2) {
      const [a, b] = [...points.current.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      if (pinch.current > 0) changeZoom((zoom * d) / pinch.current)
      pinch.current = d
    } else setPan((p) => bounded(p.x + e.clientX - prev.x, p.y + e.clientY - prev.y))
  }
  function up(e: PointerEvent<HTMLDivElement>) {
    points.current.delete(e.pointerId)
    pinch.current = 0
  }
  function keys(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      changeZoom(zoom + 0.5)
    }
    if (e.key === '-') {
      e.preventDefault()
      changeZoom(zoom - 0.5)
    }
    if (e.key === 'Home' || e.key === 'Escape') {
      e.preventDefault()
      selectNote(0)
    }
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [40, 0],
      ArrowRight: [-40, 0],
      ArrowUp: [0, 40],
      ArrowDown: [0, -40],
    }
    if (delta[e.key] && zoom > 1) {
      e.preventDefault()
      const [x, y] = delta[e.key]
      setPan((p) => bounded(p.x + x, p.y + y))
    }
  }
  return (
    <div className="study-layout">
      <div className="study-image-column">
        <div
          ref={stage}
          className={`study-stage ${zoom > 1 ? 'is-zoomed' : ''}`}
          tabIndex={0}
          role="region"
          aria-label="Painting image study. Plus and minus zoom. Arrow keys pan when zoomed. Home resets."
          onKeyDown={keys}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onLostPointerCapture={up}
        >
          <div
            className="study-image"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <Image
              src="/artifacts/thangka-centerpiece.jpg"
              alt="The photographed Avalokiteshvara thangka, with gold linework, radiating arms and a red brocade border"
              fill
              loading="eager"
              sizes="(max-width: 900px) 90vw, 48vw"
              draggable={false}
            />
          </div>
        </div>
        <div className="study-controls">
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <div>
            <button
              aria-label="Zoom out"
              disabled={zoom <= 1}
              onClick={() => changeZoom(zoom - 0.5)}
            >
              −
            </button>
            <button onClick={() => selectNote(0)}>Reset</button>
            <button
              aria-label="Zoom in"
              disabled={zoom >= 4}
              onClick={() => {
                changeZoom(zoom + 0.5)
                track('artwork_zoom')
              }}
            >
              +
            </button>
          </div>
        </div>
        <p className="study-caption">
          Original photograph. Zoom reveals the available image detail.
        </p>
      </div>
      <div className="study-copy">
        <span className="section-number">01 / Look closely</span>
        <h2>
          There is more
          <br /> in every detail.
        </h2>
        <p>
          A painting asks for time. Move from the whole composition to the faces, hands, and lines
          that hold it together.
        </p>
        <div className="detail-notes">
          {notes.map((n, i) => (
            <div key={n.title} className={note === i ? 'detail-note is-active' : 'detail-note'}>
              <button aria-expanded={note === i} onClick={() => selectNote(i)}>
                <span>0{i + 1}</span>
                {n.title}
                <span aria-hidden="true">{note === i ? '−' : '+'}</span>
              </button>
              {note === i && <p>{n.copy}</p>}
            </div>
          ))}
        </div>
        <a href="#inquire" className="text-link">
          Ask about this piece <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  )
}
