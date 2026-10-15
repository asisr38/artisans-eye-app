'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { ACESFilmicToneMapping } from 'three'
import GalleryModel from './GalleryModel'
import ThangkaWall from '../3d/room/ThangkaWall'
import { journeyFrame } from './journey'
import GalleryLights from '../3d/room/GalleryLights'

function Camera({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const { camera, size, invalidate } = useThree()
  useEffect(() => {
    const frame = journeyFrame(progress, reducedMotion)
    camera.position.set(...frame.position)
    camera.lookAt(...frame.target)
    if ('fov' in camera) {
      // Three cameras are imperative scene objects owned by this Canvas.
      // eslint-disable-next-line react-hooks/immutability
      camera.fov = frame.fov + (size.width / size.height < 0.85 ? 13 : 0)
      camera.updateProjectionMatrix()
    }
    invalidate()
  }, [camera, size.width, size.height, progress, reducedMotion, invalidate])
  return null
}

export default function GalleryCanvas({
  progress,
  reducedMotion,
  onReady,
  onFailed,
}: {
  progress: number
  reducedMotion: boolean
  onReady: () => void
  onFailed: () => void
}) {
  return (
    <Canvas
      frameloop="demand"
      shadows="percentage"
      dpr={[1, 1.5]}
      camera={{ position: [-1.9, 1.72, 3.1], fov: 60, near: 0.05, far: 35 }}
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
      <Camera progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady])
  return null
}
