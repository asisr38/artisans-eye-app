'use client'

import { useEffect, useRef } from 'react'

const StarfieldBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let p5Instance: any
    ;(async () => {
      try {
        const p5mod = await import('p5')
        const P5 = (p5mod as any).default || (p5mod as any)

        const sketch = (p: any) => {
          type Star = { x: number; y: number; size: number; tw: number; baseA: number }
          type Shooting = { x: number; y: number; len: number; speed: number; alpha: number }
          let stars: Star[] = []
          let shooting: Shooting[] = []
          let lastSpawn = 0
          let nextInterval = 5000 + Math.random() * 5000 // 5–10s

          p.setup = () => {
            const parent = containerRef.current ?? undefined
            const cnv = p.createCanvas(window.innerWidth, window.innerHeight)
            if (parent) cnv.parent(parent)
            p.pixelDensity(1)
            initStars()
          }

          const initStars = () => {
            stars = []
            const count = 140 + Math.floor(Math.random() * 40) // ~140–180 (<=200)
            for (let i = 0; i < count; i++) {
              stars.push({
                x: Math.random() * p.width,
                y: Math.random() * p.height,
                size: 0.5 + Math.random() * 1.8,
                tw: 0.4 + Math.random() * 1.2,
                baseA: 120 + Math.random() * 40,
              })
            }
          }

          p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight)
            initStars()
          }

          p.draw = () => {
            p.background(0)
            const t = p.millis()
            p.noStroke()
            for (const s of stars) {
              const a = s.baseA + Math.sin((t * 0.0012) * s.tw) * 35
              p.fill(255, 255, 255, a)
              p.circle(s.x, s.y, s.size)
            }

            // Spawn shooting star on interval
            if (t - lastSpawn > nextInterval) {
              lastSpawn = t
              nextInterval = 5000 + Math.random() * 5000
              shooting.push({
                x: Math.random() * p.width * 0.6,
                y: Math.random() * p.height * 0.5,
                len: 80 + Math.random() * 120,
                speed: 6 + Math.random() * 5,
                alpha: 255,
              })
            }

            for (let i = shooting.length - 1; i >= 0; i--) {
              const s = shooting[i]
              p.stroke(255, s.alpha)
              p.strokeWeight(2)
              p.line(s.x, s.y, s.x - s.len, s.y + s.len / 4)
              s.x += s.speed
              s.y -= s.speed / 3
              s.alpha -= 6
              if (s.alpha <= 0) shooting.splice(i, 1)
            }
          }
        }

        p5Instance = new P5(sketch)
      } catch (e) {
        // fail silently if p5 is unavailable
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
      id="starfield"
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
      aria-hidden
    />
  )
}

export default StarfieldBackground


