'use client'

import { Canvas } from '@react-three/fiber'
import { CameraControls, Environment, Lightformer } from '@react-three/drei'
import { Suspense, useEffect, useRef, type ComponentRef } from 'react'
import { ACESFilmicToneMapping } from 'three'
import GalleryModel from './GalleryModel'
import ThangkaWall from '../3d/room/ThangkaWall'
import GalleryLights from '../3d/room/GalleryLights'

export type GalleryView = 'room' | 'work'

function Camera({ view, reducedMotion }: { view: GalleryView; reducedMotion: boolean }) {
  const controls = useRef<ComponentRef<typeof CameraControls>>(null)
  useEffect(() => {
    if (view === 'room')
      void controls.current?.setLookAt(1.75, 1.78, 2.9, 0, 1.55, -3.7, !reducedMotion)
    else void controls.current?.setLookAt(0, 1.62, -1.65, 0, 1.62, -3.8, !reducedMotion)
  }, [view, reducedMotion])
  return (
    <CameraControls
      ref={controls}
      makeDefault
      enabled
      minDistance={1.7}
      maxDistance={7.6}
      minAzimuthAngle={-0.37}
      maxAzimuthAngle={0.37}
      minPolarAngle={1.25}
      maxPolarAngle={1.7}
      smoothTime={0.6}
      mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }}
      touches={{ one: 64, two: 0, three: 0 }}
    />
  )
}

export default function GalleryCanvas({
  view,
  reducedMotion,
  onReady,
  onFailed,
}: {
  view: GalleryView
  reducedMotion: boolean
  onReady: () => void
  onFailed: () => void
}) {
  return (
    <Canvas
      frameloop="demand"
      shadows="percentage"
      dpr={[1, 1.5]}
      camera={{ position: [1.75, 1.78, 2.9], fov: 50, near: 0.05, far: 35 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.15
        gl.domElement.addEventListener('webglcontextlost', onFailed, { once: true })
      }}
    >
      <color attach="background" args={['#c4b9a4']} />
      <GalleryLights />
      <Environment resolution={64} frames={1}>
        <Lightformer
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 7, 1]}
          intensity={0.8}
          color="#f4ecdd"
        />
      </Environment>
      <Suspense fallback={null}>
        <GalleryModel />
        <ThangkaWall />
        <Ready onReady={onReady} />
      </Suspense>
      <Camera view={view} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady])
  return null
}
