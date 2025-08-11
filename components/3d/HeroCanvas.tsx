'use client'

import { Canvas } from '@react-three/fiber'
import { Eye } from './Eye'
import CameraRig from './CameraRig'
import { useSceneStore } from '../state/useSceneStore'
import Artifact from './Artifact'
import ArtifactModel from './ArtifactModel'
import { OrbitControls } from '@react-three/drei'
import EyeModel from './EyeModel'

export const HeroCanvas = () => {
  const phase = useSceneStore((s) => s.phase)
  const triggerZoom = useSceneStore((s) => s.triggerZoom)
  const artifactSrc = useSceneStore((s) => s.artifactSrc)
  const eyes = useSceneStore((s) => s.eyes)
  const currentEyeIndex = useSceneStore((s) => s.currentEyeIndex)
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
        onCreated={({ gl }) => {
          const canvas = gl.domElement
          const handleLost = (e: Event) => e.preventDefault()
          const handleRestored = () => {}
          canvas.addEventListener('webglcontextlost', handleLost, false)
          canvas.addEventListener('webglcontextrestored', handleRestored, false)
        }}
      >
        <color attach="background" args={[0.04, 0.04, 0.04]} />
        <ambientLight intensity={0.45} />
        <directionalLight intensity={0.9} position={[2, 3, 4]} />

        <CameraRig>
          {phase !== 'focused' && (
            <group position={[0, -0.15, 0]}>
              <EyeModel src={eyes[currentEyeIndex]?.eyeSrc} onActivate={phase === 'idle' ? triggerZoom : undefined} />
            </group>
          )}
          {phase === 'focused' && (
            <group>
              <Artifact textureUrl={artifactSrc} />
            </group>
          )}
        </CameraRig>

        <OrbitControls
          enabled={phase === 'focused'}
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          minDistance={0.6}
          maxDistance={4}
        />
      </Canvas>
    </div>
  )
}

export default HeroCanvas


