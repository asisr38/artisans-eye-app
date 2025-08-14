'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import CameraRig from './CameraRig'
import { useSceneStore } from '../state/useSceneStore'
import PanoramaSphere from './PanoramaSphere'
import { OrbitControls } from '@react-three/drei'
import EyeModel from './EyeModel'
import Rotator from './Rotator'
import MuseumScene from './MuseumScene'

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
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: true,
        }}
      >
        <GLContextEvents />
        <color attach="background" args={[0.04, 0.04, 0.04]} />
        <ambientLight intensity={0.45} />
        <directionalLight intensity={0.9} position={[2, 3, 4]} />

        <CameraRig>
          {phase !== 'focused' && (
            <group position={[0, -0.15, 0]}>
              <Rotator enabled={phase==='idle'} speed={0.08}>
                <EyeModel
                  src={eyes[currentEyeIndex]?.eyeSrc || '/artifacts/3d/eye.glb'}
                  scaleHint={eyeScale}
                  onActivate={phase === 'idle' ? triggerZoom : undefined}
                />
              </Rotator>
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


