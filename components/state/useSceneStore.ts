'use client'

import { create } from 'zustand'
import * as THREE from 'three'
import { subscribeWithSelector } from 'zustand/middleware'

export type ScenePhase = 'idle' | 'zooming' | 'focused'
export type MintPhase = 'idle' | 'preparing' | 'minting' | 'success' | 'error'
export type FlowStep = 'showcase' | 'zoom' | 'panorama' | 'worldReveal'

type SceneState = {
  phase: ScenePhase
  setPhase: (next: ScenePhase) => void

  cameraIdleDistance: number
  cameraTargetPosition: THREE.Vector3
  setCameraTargetPosition: (pos: THREE.Vector3) => void

  triggerZoom: () => void
  reset: () => void

  artifactSrc: string
  setArtifactSrc: (url: string) => void

  eyeScale: number
  setEyeScale: (scale: number) => void

  mintPhase: MintPhase
  setMintPhase: (next: MintPhase) => void
  isMintPanelOpen: boolean
  setMintPanelOpen: (open: boolean) => void

  flowStep: FlowStep
  setFlowStep: (next: FlowStep) => void

  eyes: { eyeSrc: string; artifactSrc: string; panoramaSrc?: string }[]
  currentEyeIndex: number
  nextEye: () => void
  prevEye: () => void
}

export const useSceneStore = create<SceneState>()(subscribeWithSelector((set, get) => ({
  phase: 'idle',
  setPhase: (next) => {
    if (get().phase === next) return
    set({ phase: next })
  },

  cameraIdleDistance: 3.0,
  cameraTargetPosition: new THREE.Vector3(0, 0, 3),
  setCameraTargetPosition: (pos) => {
    const current = get().cameraTargetPosition
    if (current.equals(pos)) return
    set({ cameraTargetPosition: pos })
  },

  triggerZoom: () => {
    const scale = get().eyeScale
    const pupilZ = 0.99 * scale
    const zoomZ = Math.max(0.2, pupilZ - 0.06)
    const zoomTarget = new THREE.Vector3(0, 0, zoomZ)
    set({ phase: 'zooming', cameraTargetPosition: zoomTarget })
  },

  reset: () =>
    set({
      phase: 'idle',
      cameraTargetPosition: new THREE.Vector3(0, 0, 3),
    }),

  artifactSrc: '/artifacts/IMG_0447.JPG',
  setArtifactSrc: (url) => set({ artifactSrc: url }),

  eyeScale: 0.65,
  setEyeScale: (scale) => set({ eyeScale: scale }),

  mintPhase: 'idle',
  setMintPhase: (next) => set({ mintPhase: next }),
  isMintPanelOpen: false,
  setMintPanelOpen: (open) => set({ isMintPanelOpen: open }),

  flowStep: 'showcase',
  setFlowStep: (next) => set({ flowStep: next }),

  eyes: [
    { eyeSrc: '/artifacts/eye.glb', artifactSrc: '/artifacts/IMG_0447.JPG' },
    { eyeSrc: '/artifacts/eye.glb', artifactSrc: '/artifacts/IMG_0480.JPG' },
  ],
  currentEyeIndex: 0,
  nextEye: () => set((s) => ({ currentEyeIndex: (s.currentEyeIndex + 1) % s.eyes.length })),
  prevEye: () => set((s) => ({ currentEyeIndex: (s.currentEyeIndex - 1 + s.eyes.length) % s.eyes.length })),
})))


