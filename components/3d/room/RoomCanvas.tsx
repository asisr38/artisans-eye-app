'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import * as THREE from 'three'
import RoomShell from './RoomShell'
import ThangkaWall from './ThangkaWall'
import GalleryLights from './GalleryLights'
import FirstPersonRig from './FirstPersonRig'
import InspectHotspot from './InspectHotspot'
import { SPAWN_POSITION } from './constants'

const GLContextEvents = () => {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleLost = (e: Event) => e.preventDefault()
    // onCreated does not re-fire after a context restore — re-apply renderer
    // state that lives outside the scene graph (same pattern as the hero).
    const handleRestored = () => {
      gl.toneMapping = THREE.ACESFilmicToneMapping
      gl.toneMappingExposure = 1.15
    }
    canvas.addEventListener('webglcontextlost', handleLost, false)
    canvas.addEventListener('webglcontextrestored', handleRestored, false)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost, false)
      canvas.removeEventListener('webglcontextrestored', handleRestored, false)
    }
  }, [gl])
  return null
}

// Context-creation failure throws synchronously from <Canvas> and is caught
// by the error boundary in ThangkaRoomExperience, which renders the static
// fallback. NOTE: no failIfMajorPerformanceCaveat here — software-GL
// browsers get the real room (it renders fine); only genuinely broken
// contexts fall back.
export default function RoomCanvas() {
  return (
    <Canvas
      // 'percentage' = PCFShadowMap (PCFSoft is deprecated in three r184).
      shadows="percentage"
      dpr={[1, 1.5]}
      camera={{ position: SPAWN_POSITION, fov: 62, near: 0.05, far: 30 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      onCreated={(state) => {
        state.gl.toneMapping = THREE.ACESFilmicToneMapping
        state.gl.toneMappingExposure = 1.15
        state.gl.setClearColor('#0B0A08', 1)
      }}
    >
      <GLContextEvents />
      <RoomShell />
      <GalleryLights />
      <Suspense fallback={null}>
        <ThangkaWall />
      </Suspense>
      <FirstPersonRig />
      <InspectHotspot />

      {/* Tiny local environment for the frame's speculars — same no-network
          lightformer pattern as the hero, smaller resolution. frames={1}:
          props must stay static. */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[0, 3, 2]}
          scale={[5, 2, 1]}
          color="#ffe9cf"
        />
        <Lightformer
          form="rect"
          intensity={0.4}
          position={[-4, 1.5, 4]}
          scale={[2, 3, 1]}
          color="#e9eff0"
        />
      </Environment>
    </Canvas>
  )
}
