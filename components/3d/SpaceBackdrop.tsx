'use client'

import { useEffect, useRef } from 'react'

const SpaceBackdrop = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let p5Instance: any
    ;(async () => {
      try {
        const p5mod = await import('p5')
        const P5 = (p5mod as any).default || (p5mod as any)

        const sketch = (p: any) => {
          let w = 0
          let h = 0
          let stars: Array<{
            x: number
            y: number
            size: number
            speed: number
            dx: number
            dy: number
            color: [number, number, number, number]
          }> = []

          const initStars = () => {
            stars = []
            const count = Math.floor(40 + Math.random() * 40) // 40–80
            for (let i = 0; i < count; i++) {
              const isCool = Math.random() < 0.4
              stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: 1 + Math.random() * 2.5,
                speed: 0.08 + Math.random() * 0.2,
                dx: (Math.random() - 0.5) * 0.18,
                dy: -0.05 - Math.random() * 0.15, // gentle upward/diagonal drift
                color: isCool ? [150, 150, 255, 26] : [255, 255, 255, 38],
              })
            }
          }

          p.setup = () => {
            const parent = containerRef.current ?? undefined
            const cnv = p.createCanvas(window.innerWidth, window.innerHeight)
            if (parent) cnv.parent(parent)
            p.pixelDensity(1)
            w = p.width
            h = p.height
            initStars()
          }

          p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight)
            w = p.width
            h = p.height
            initStars()
          }

          p.draw = () => {
            p.background(0)
            for (const s of stars) {
              p.noStroke()
              p.fill(s.color[0], s.color[1], s.color[2], s.color[3])
              p.circle(s.x, s.y, s.size)
              s.x += s.dx
              s.y += s.speed + s.dy
              if (s.y < -5) s.y = h + 5
              if (s.x < -5) s.x = w + 5
              if (s.x > w + 5) s.x = -5

              // occasional soft bloom mote
              if (Math.random() < 0.002) {
                const r = 8 + Math.random() * 14
                p.fill(255, 255, 255, 20)
                p.circle(s.x + (Math.random() - 0.5) * 20, s.y + (Math.random() - 0.5) * 20, r)
              }
            }
          }
        }

        p5Instance = new P5(sketch)
      } catch (e) {
        // p5 not available; fail silently
      }
    })()

    return () => {
      try {
        p5Instance?.remove?.()
      } catch {}
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
      aria-hidden
    />
  )
}

export default SpaceBackdrop


