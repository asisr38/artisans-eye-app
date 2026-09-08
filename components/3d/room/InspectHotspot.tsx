'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRoomStore } from '../../state/useRoomStore'
import { INSPECT_ENTER_DISTANCE, INSPECT_EXIT_DISTANCE, PAINTING_Z } from './constants'

// Proximity trigger: within ~1.8m of the painting the overlay reveals the
// artifact label + Inquire CTA. Deliberately does NOT move the camera for
// walking users (yanking a pointer-locked camera is disorienting) — the
// camera ease belongs to the "View painting" path only.
export default function InspectHotspot() {
  const { camera } = useThree()
  const setInspecting = useRoomStore((s) => s.setInspecting)
  const insideRef = useRef(false)

  useFrame(() => {
    // The rig pins camera.y to eye height, so horizontal distance suffices.
    const dist = Math.hypot(camera.position.x, camera.position.z - PAINTING_Z)

    // Hysteresis so the overlay doesn't flicker at the threshold.
    if (!insideRef.current && dist < INSPECT_ENTER_DISTANCE) {
      insideRef.current = true
      setInspecting(true)
    } else if (insideRef.current && dist > INSPECT_EXIT_DISTANCE) {
      insideRef.current = false
      setInspecting(false)
    }
  })

  return null
}
