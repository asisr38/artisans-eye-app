'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
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
    // onCreated does not re-fire after a context restore — re-apply renderer
    // state that lives outside the scene graph.
    const handleRestored = () => {
      gl.toneMapping = THREE.ACESFilmicToneMapping
      gl.toneMappingExposure = 1.2
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

type HeroCanvasProps = {
  // True once the intro has shrunk to the persistent logo mark — drops the
  // starfield and bumps DPR so the tiny canvas stays crisp and cheap.
  compact?: boolean
}

export const HeroCanvas = ({ compact = false }: HeroCanvasProps) => {
  const eyeScale = useSceneStore((s) => s.eyeScale)
  const setCameraTargetPosition = useSceneStore((s) => s.setCameraTargetPosition)

  // Once the canvas settles into the logo mark, dolly in so the eye fills
  // the mark instead of floating tiny at hero-framing distance.
  useEffect(() => {
    if (compact) setCameraTargetPosition(new THREE.Vector3(0, -0.12, 1.55))
  }, [compact, setCameraTargetPosition])

  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        dpr={compact ? 2 : [1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={(state) => {
          state.gl.toneMapping = THREE.ACESFilmicToneMapping
          state.gl.toneMappingExposure = 1.2
        }}
      >
        <GLContextEvents />
        {/* Opaque black during intro/shrink (it covers the page); transparent
            once settled so the logo mark is just the floating eye. */}
        {!compact && <color attach="background" args={[0, 0, 0]} />}
        {!compact && (
          <group position={[0, 0, 0]}>
            <Starfield count={1200} />
          </group>
        )}
        <ambientLight intensity={0.15} color={'#ffffff'} />
        <directionalLight color={'#ffffff'} intensity={1.4} position={[2.5, 3.5, 3.0]} />
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

        {/* Local lightformer environment — gives the wet cornea something to
            reflect without fetching an HDR over the network. frames={1} bakes
            the cubemap once at mount: Lightformer props must stay static, or
            switch to frames={Infinity} if they ever become reactive. */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={2}
            position={[3, 3, 4]}
            scale={[4, 4, 1]}
            color="#fff7ea"
          />
          <Lightformer
            form="rect"
            intensity={0.8}
            position={[-4, 1, 2]}
            scale={[3, 6, 1]}
            color="#a8c7ff"
          />
          <Lightformer
            form="rect"
            intensity={0.5}
            position={[0, -3, -4]}
            scale={[6, 2, 1]}
            color="#ffd4a8"
          />
        </Environment>

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
