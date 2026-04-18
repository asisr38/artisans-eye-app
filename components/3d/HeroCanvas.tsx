'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import CameraRig from './CameraRig'
import { useSceneStore } from '../state/useSceneStore'
import EyeModel from './EyeModel'
import Starfield from './Starfield'
import * as THREE from 'three'

const GLContextEvents = () => {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleLost = (e: Event) => e.preventDefault()
    canvas.addEventListener('webglcontextlost', handleLost, false)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost, false)
    }
  }, [gl])
  return null
}

export const HeroCanvas = () => {
  const eyeScale = useSceneStore((s) => s.eyeScale)
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
        <group position={[0, 0, 0]}>
          <Starfield count={1200} />
        </group>
        <ambientLight intensity={0.2} color={'#ffffff'} />
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
        <pointLight
          color={'#a8c7ff'}
          intensity={0.5}
          position={[-2.5, 1.2, 1.8]}
          distance={12}
          decay={2}
        />
        <spotLight
          color={'#ffd4a8'}
          intensity={0.6}
          position={[-0.4, 0.6, -2.6]}
          angle={0.5}
          penumbra={0.6}
          target-position={[0, 0, 0]}
        />
        <directionalLight color={'#ffffff'} intensity={0.2} position={[0.2, 0.2, -2.2]} />

        <CameraRig>
          <group position={[0, -0.15, 0]}>
            <group rotation={[0, Math.PI, 0]}>
              <EyeModel scaleHint={eyeScale} />
            </group>
          </group>
        </CameraRig>
      </Canvas>
    </div>
  )
}

export default HeroCanvas
