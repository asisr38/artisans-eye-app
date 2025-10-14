'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import EyeModel from './EyeModel'

type EyeVisual = {
  tintColor?: string
  irisColor?: string
  metalness?: number
  roughness?: number
  envIntensity?: number
  background?: string
}

type FormEyeCanvasProps = {
  activeKey?: string
  visual?: EyeVisual
  onCaptureRef?: (fn: () => Promise<string>) => void
}

const EyeFocusRig = ({ activeKey, visual }: { activeKey?: string; visual?: EyeVisual }) => {
  const groupRef = useRef<THREE.Group>(null)
  const targetRot = useMemo(() => new THREE.Euler(0, 0, 0), [])

  // Map active field keys to gentle eye directions
  const setTargetByKey = (key?: string) => {
    switch (key) {
      case 'businessName':
        targetRot.set(0.05, -0.25, 0)
        break
      case 'businessDescription':
        targetRot.set(-0.1, 0.1, 0)
        break
      case 'mainGoal':
        targetRot.set(0.15, 0.25, 0)
        break
      case 'threeWords':
        targetRot.set(-0.05, -0.2, 0)
        break
      case 'targetCustomers':
        targetRot.set(0.2, 0.05, 0)
        break
      case 'serviceAreas':
        targetRot.set(0.05, 0.35, 0)
        break
      case 'hasLogoColors':
        targetRot.set(-0.15, 0.15, 0)
        break
      case 'stylePreference':
        targetRot.set(0.05, -0.35, 0)
        break
      case 'theme':
        targetRot.set(0.0, 0.0, 0)
        break
      case 'likedSites':
        targetRot.set(-0.05, -0.1, 0)
        break
      case 'mainServices':
        targetRot.set(0.05, 0.15, 0)
        break
      case 'hasAssets':
        targetRot.set(0.1, -0.15, 0)
        break
      case 'notes':
        targetRot.set(-0.1, 0.2, 0)
        break
      default:
        targetRot.set(0, 0, 0)
        break
    }
  }

  useFrame((_s, delta) => {
    const g = groupRef.current
    setTargetByKey(activeKey)
    if (!g) return
    const lerp = 1.8
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRot.x, Math.min(1, lerp * delta))
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRot.y, Math.min(1, lerp * delta))
  })

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <group rotation={[0, Math.PI, 0]}>
        <EyeModel
          scaleHint={0.7}
          tintColor={visual?.tintColor}
          irisColor={visual?.irisColor}
          metalness={visual?.metalness}
          roughness={visual?.roughness}
          envIntensity={visual?.envIntensity}
        />
      </group>
    </group>
  )
}

export default function FormEyeCanvas({ activeKey, visual, onCaptureRef }: FormEyeCanvasProps) {
  const glRef = useRef<any>(null)

  // Provide capture function to parent: returns data URL
  if (onCaptureRef) {
    onCaptureRef(async () => {
      const gl = glRef.current
      if (!gl) return ''
      const prev = gl.domElement.toDataURL('image/png')
      return prev
    })
  }

  const bg = useMemo(() => new THREE.Color(visual?.background || '#f6f7ff'), [visual?.background])

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      dpr={[1, 1.75]}
      onCreated={(state) => (glRef.current = state.gl)}
    >
      <color attach="background" args={[bg.r, bg.g, bg.b]} />
      <ambientLight intensity={0.6} />
      <directionalLight intensity={1} position={[2, 3, 4]} />
      <EyeFocusRig activeKey={activeKey} visual={visual} />
    </Canvas>
  )
}


