'use client'

import HeroOverlay from '../ui/HeroOverlay'
import HeroCanvas from '../3d/HeroCanvas'
import MintPanel from '../ui/MintPanel'
import EyeNav from '../ui/EyeNav'
import SwipeLayer from '../ui/SwipeLayer'
import TopNav from '../ui/TopNav'
import BottomBar from '../ui/BottomBar'

export const HeroRoot = () => {
  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-black text-white">
      <SwipeLayer />
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/0 to-black/60" />
      <TopNav />
      <HeroOverlay />
      <EyeNav />
      <MintPanel />
      <BottomBar />
    </section>
  )
}

export default HeroRoot


