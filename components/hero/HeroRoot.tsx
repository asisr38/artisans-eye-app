'use client'

import HeroOverlay from '../ui/HeroOverlay'
import HeroCanvas from '../3d/HeroCanvas'
import MintPanel from '../ui/MintPanel'
import EyeNav from '../ui/EyeNav'
import SwipeLayer from '../ui/SwipeLayer'

export const HeroRoot = () => {
  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-black text-white">
      <SwipeLayer />
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/0 to-black/60" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-center p-4">
        <h1 className="select-none text-center text-lg font-semibold tracking-wide text-amber-300">
          The Artisan’s Eye
        </h1>
      </div>
      <HeroOverlay />
      <EyeNav />
      <MintPanel />
    </section>
  )
}

export default HeroRoot


