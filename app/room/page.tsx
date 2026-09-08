import type { Metadata } from 'next'
import RoomPageClient from './RoomPageClient'

// AE-101: isolated evaluation route for the walkable thangka room. Not
// indexed — the inquiry hypothesis test on / is the canonical page.
export const metadata: Metadata = {
  title: 'Gallery Room — The Artisan’s Eye',
  robots: { index: false, follow: false },
}

export default function RoomPage() {
  return <RoomPageClient />
}
