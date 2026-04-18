'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const HeroCanvas = dynamic(() => import('../3d/HeroCanvas'), { ssr: false })

export const HeroRoot = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-black text-white" suppressHydrationWarning>
      <HeroCanvas />
    </section>
  )
}

export default HeroRoot
