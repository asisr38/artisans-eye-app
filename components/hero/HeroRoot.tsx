'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useSceneStore } from '../state/useSceneStore'

const CanvasOverlay = dynamic(() => import('../3d/CanvasOverlay'), { ssr: false })

const INTRO_DURATION_MS = 3500
const SESSION_KEY = 'artisans-eye-intro-played'

const ease = [0.19, 1, 0.22, 1] as const

export const HeroRoot = () => {
  const introPhase = useSceneStore((s) => s.introPhase)
  const setIntroPhase = useSceneStore((s) => s.setIntroPhase)
  const reduceMotion = useReducedMotion()

  // Decide whether to play the intro on mount.
  useEffect(() => {
    let cancelled = false

    const skipImmediately = () => {
      setIntroPhase('done')
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {}
    }

    let played = false
    try {
      played = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {}

    if (played || reduceMotion) {
      skipImmediately()
      return
    }

    document.body.classList.add('intro-locked')

    const timer = setTimeout(() => {
      if (cancelled) return
      setIntroPhase('done')
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {}
      document.body.classList.remove('intro-locked')
    }, INTRO_DURATION_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
      document.body.classList.remove('intro-locked')
    }
  }, [reduceMotion, setIntroPhase])

  const handleSkip = () => {
    setIntroPhase('done')
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {}
    document.body.classList.remove('intro-locked')
  }

  const isPlaying = introPhase === 'playing'

  return (
    <>
      <CanvasOverlay />

      <section
        className="relative min-h-[92svh] w-full overflow-hidden bg-[var(--color-ink)]"
        aria-label="The Artisan's Eye"
      >
        {/* Product hero — replaces the empty post-intro viewport. */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              key="product-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay: 0.15, ease }}
              className="absolute inset-0 z-10"
            >
              <Image
                src="/artifacts/thangka-centerpiece.jpg"
                alt="Black-and-gold Thousand-Armed Avalokiteshvara thangka mounted in red brocade"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[54%_48%] opacity-72"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,10,8,0.92)_0%,rgba(11,10,8,0.62)_38%,rgba(11,10,8,0.18)_72%,rgba(11,10,8,0.36)_100%),linear-gradient(180deg,rgba(11,10,8,0.20)_0%,rgba(11,10,8,0.12)_48%,rgba(11,10,8,0.88)_100%)]"
              />

              <div className="relative z-10 flex min-h-[92svh] items-end px-5 pb-20 pt-28 sm:px-8 sm:pb-24 lg:px-14">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.45, ease }}
                  className="max-w-2xl"
                >
                  <p className="mb-5 text-[10px] uppercase tracking-[0.42em] text-[var(--color-cream-3)] sm:text-[11px]">
                    Eleven-headed Avalokiteshvara thangka
                  </p>
                  <h1 className="font-display max-w-xl text-[clamp(3rem,8vw,6.6rem)] leading-[0.94] text-[var(--color-cream)]">
                    A thousand hands of compassion
                  </h1>
                  <p className="mt-7 max-w-lg text-[16px] leading-[1.7] text-[var(--color-cream-2)] sm:text-[18px]">
                    A black-and-gold meditation painting where the bodhisattva
                    of compassion emerges through luminous gold linework, red
                    brocade, and a field of attentive hands.
                  </p>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#artifact"
                      className="flex min-h-[50px] items-center justify-center border border-[var(--color-cream)] bg-[var(--color-cream)] px-7 text-center text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink)] transition-colors duration-500 hover:bg-transparent hover:text-[var(--color-cream)]"
                    >
                      View artifact
                    </a>
                    <a
                      href="#inquire"
                      className="flex min-h-[50px] items-center justify-center border border-[var(--hairline-strong)] px-7 text-center text-[11px] uppercase tracking-[0.3em] text-[var(--color-cream-2)] transition-colors duration-500 hover:border-[var(--color-cream)] hover:text-[var(--color-cream)]"
                    >
                      Inquire
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wordmark — appears once intro settles, sits beside the logo mark. */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease }}
              className="pointer-events-none fixed left-[68px] top-[22px] z-40 hidden select-none sm:left-[76px] sm:top-[26px] sm:block"
            >
              <span className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-cream-2)]">
                The Artisan&rsquo;s Eye
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip control — only during intro. */}
        {isPlaying && (
          <motion.button
            key="skip"
            type="button"
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="fixed right-5 top-5 z-50 min-h-[44px] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[var(--color-cream-2)] transition-colors duration-500 hover:text-[var(--color-cream)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)] sm:right-6 sm:top-6"
            aria-label="Skip intro animation"
          >
            Skip
          </motion.button>
        )}

        {/* Scroll cue — appears once intro completes. */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.a
              key="scroll-cue"
              href="#artifact"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease }}
              aria-label="Scroll to artifact"
              className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 text-[var(--color-cream-3)] transition-colors duration-500 hover:text-[var(--color-cream)] focus-visible:text-[var(--color-cream)] focus-visible:outline-none"
            >
              <span className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.42em]">
                Scroll
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="animate-bounce"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </motion.a>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

export default HeroRoot
