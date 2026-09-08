'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ThangkaRoomExperience = dynamic(() => import('@/components/3d/room/ThangkaRoomExperience'), {
  ssr: false,
})

export default function RoomPageClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="min-h-svh bg-[var(--color-ink)]" aria-label="Gallery room">
      {mounted && <ThangkaRoomExperience />}
    </section>
  )
}
