'use client'

import { create } from 'zustand'
import * as THREE from 'three'
import { subscribeWithSelector } from 'zustand/middleware'

type SceneState = {
  cameraIdleDistance: number
  cameraTargetPosition: THREE.Vector3
  setCameraTargetPosition: (pos: THREE.Vector3) => void

  eyeScale: number
  setEyeScale: (scale: number) => void
}

export const useSceneStore = create<SceneState>()(subscribeWithSelector((set, get) => ({
  cameraIdleDistance: 3.0,
  cameraTargetPosition: new THREE.Vector3(0, 0, 3),
  setCameraTargetPosition: (pos) => {
    const current = get().cameraTargetPosition
    if (current.equals(pos)) return
    set({ cameraTargetPosition: pos })
  },

  eyeScale: 0.58,
  setEyeScale: (scale) => set({ eyeScale: scale }),
})))
