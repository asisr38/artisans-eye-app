'use client'

import HeroOverlay from '../ui/HeroOverlay'
import dynamic from 'next/dynamic'
import EyeNav from '../ui/EyeNav'
import SwipeLayer from '../ui/SwipeLayer'
import TopNav from '../ui/TopNav'
import BottomBar from '../ui/BottomBar'
import { useEffect, useState } from 'react'

const HeroCanvas = dynamic(() => import('../3d/HeroCanvas'), { ssr: false })

export const HeroRoot = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    // Prevent initial scroll on mobile while on the hero screen
    const hadNoScroll = document.body.classList.contains('no-scroll')
    document.body.classList.add('no-scroll')
    return () => {
      if (!hadNoScroll) document.body.classList.remove('no-scroll')
    }
  }, [])
  if (!mounted) return null
  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-black text-white" suppressHydrationWarning>
      <SwipeLayer />
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/0 to-black/60" />
      <TopNav />
      <HeroOverlay />
      <EyeNav />
      <BottomBar />
    </section>
  )
}

export default HeroRoot


