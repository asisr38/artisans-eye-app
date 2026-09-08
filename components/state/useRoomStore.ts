'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Discrete room state only. Per-frame data (player position, velocity, look
// angles) lives in refs inside FirstPersonRig — never here.
type RoomState = {
  // Experience has started: pointer lock engaged, first touch/keyboard
  // movement, or "View painting" chosen.
  entered: boolean
  setEntered: (v: boolean) => void

  // Player is within inspect range of the painting.
  inspecting: boolean
  setInspecting: (v: boolean) => void

  // Monotonic counter — incremented by the "View painting" button; the rig
  // watches it and eases the camera to the inspect transform.
  viewPaintingRequest: number
  requestViewPainting: () => void

  // Pointer lock plumbing: the overlay's "Click to enter" button lives in
  // the DOM tree, the controls live in the canvas tree — bridge via a
  // counter the rig subscribes to synchronously, and mirror the lock state back for the HUD.
  pointerLockFailed: boolean
  setPointerLockFailed: (v: boolean) => void
  locked: boolean
  setLocked: (v: boolean) => void
  lockRequest: number
  requestLock: () => void
}

export const useRoomStore = create<RoomState>()(
  subscribeWithSelector((set, get) => ({
    entered: false,
    setEntered: (v) => {
      if (get().entered === v) return
      set({ entered: v })
    },

    inspecting: false,
    setInspecting: (v) => {
      if (get().inspecting === v) return
      set({ inspecting: v })
    },

    viewPaintingRequest: 0,
    requestViewPainting: () =>
      set({ viewPaintingRequest: get().viewPaintingRequest + 1, entered: true }),

    pointerLockFailed: false,
    setPointerLockFailed: (v) => set({ pointerLockFailed: v }),
    locked: false,
    setLocked: (v) => {
      if (get().locked === v) return
      set({ locked: v })
    },
    lockRequest: 0,
    requestLock: () => set({ lockRequest: get().lockRequest + 1 }),
  })),
)
