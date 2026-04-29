'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Thangka360Viewer from './Thangka360Viewer'

const PanoramaRoom = dynamic(() => import('./PanoramaRoom'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-black" />,
})

type Props = {
  artworkSrc: string
  textureSrc: string
  panoramaSrc: string
  alt: string
  priority?: boolean
}

export default function ThangkaExperience({
  artworkSrc,
  textureSrc,
  panoramaSrc,
  alt,
  priority,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <Thangka360Viewer
        src={artworkSrc}
        textureSrc={textureSrc}
        alt={alt}
        priority={priority}
        onEnter={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="360 museum room with thangka centerpiece"
        >
          <PanoramaRoom src={panoramaSrc} />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-2xl leading-none text-white/85 backdrop-blur transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close 360 room"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
