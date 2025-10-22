'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import CameraRig from './CameraRig'
import { useSceneStore } from '../state/useSceneStore'
import { OrbitControls } from '@react-three/drei'
import { EyeModel, MuseumScene, PanoramaSphere } from './LazyLoaded3D'
import Starfield from './Starfield'
import * as THREE from 'three'

const GLContextEvents = () => {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleLost = (e: Event) => e.preventDefault()
    const handleRestored = () => {}
    canvas.addEventListener('webglcontextlost', handleLost, false)
    canvas.addEventListener('webglcontextrestored', handleRestored, false)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost, false)
      canvas.removeEventListener('webglcontextrestored', handleRestored, false)
    }
  }, [gl])
  return null
}

export const HeroCanvas = () => {
  const phase = useSceneStore((s) => s.phase)
  const triggerZoom = useSceneStore((s) => s.triggerZoom)
  const artifactSrc = useSceneStore((s) => s.artifactSrc)
  const eyes = useSceneStore((s) => s.eyes)
  const currentEyeIndex = useSceneStore((s) => s.currentEyeIndex)
  const eyeScale = useSceneStore((s) => s.eyeScale)
  const museumSrc = useSceneStore((s) => s.museumSrc)
  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 45 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={(state) => {
          state.gl.toneMapping = THREE.ACESFilmicToneMapping
          state.gl.toneMappingExposure = 1.2
          state.gl.shadowMap.enabled = true
          state.gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
      >
        <GLContextEvents />
        <color attach="background" args={[0, 0, 0]} />
        {/* Stars rendered far behind the eye */}
        <group position={[0, 0, 0]}>
          <Starfield count={1200} />
        </group>
        {/* Ambient to unify brightness */}
        <ambientLight intensity={0.2} color={'#ffffff'} />
        {/* Key light: 45° above/right */}
        <directionalLight
          color={'#ffffff'}
          intensity={1.4}
          position={[2.5, 3.5, 3.0]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-radius={3}
          shadow-bias={-0.0005}
        />
        {/* Fill light: opposite side, slightly cool */}
        <pointLight
          color={'#a8c7ff'}
          intensity={0.5}
          position={[-2.5, 1.2, 1.8]}
          distance={12}
          decay={2}
        />
        {/* Rim light: warm accent from behind */}
        <spotLight
          color={'#ffd4a8'}
          intensity={0.6}
          position={[-0.4, 0.6, -2.6]}
          angle={0.5}
          penumbra={0.6}
          target-position={[0, 0, 0]}
        />
        {/* Subtle white rim to separate from black void */}
        <directionalLight color={'#ffffff'} intensity={0.2} position={[0.2, 0.2, -2.2]} />

        <CameraRig>
          {phase === 'idle' && (
            <group position={[0, -0.15, 0]}>
              <group rotation={[0, Math.PI, 0]}>
                <EyeModel
                  src={eyes[currentEyeIndex]?.eyeSrc || '/artifacts/3d/eye.glb'}
                  scaleHint={eyeScale}
                  onActivate={triggerZoom}
                />
              </group>
            </group>
          )}
          {phase === 'focused' && (
            <group>
              <PanoramaSphere src={artifactSrc} />
            </group>
          )}
          {phase === 'revealing' && (
            <group>
              <MuseumScene src={museumSrc} />
            </group>
          )}
        </CameraRig>

        <OrbitControls
          enabled={phase === 'focused' || phase === 'revealing'}
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          enableZoom={phase !== 'focused'}
          minDistance={phase === 'revealing' ? 2 : 0.6}
          maxDistance={phase === 'revealing' ? 10 : 4}
        />
      </Canvas>
    </div>
  )
}

export default HeroCanvas


