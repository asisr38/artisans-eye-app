'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../state/useSceneStore'

type EyeProps = {
  onActivate?: () => void
}

export const Eye = ({ onActivate }: EyeProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const pupilRef = useRef<THREE.Mesh>(null)
  const irisRef = useRef<THREE.Mesh>(null)
  const scleraRef = useRef<THREE.Mesh>(null)
  const phase = useSceneStore((s) => s.phase)
  const eyeScale = useSceneStore((s) => s.eyeScale)
  const { pointer } = useThree()

  const pupilMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0b0b0b' }),
    []
  )
  const irisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#9d6b1f',
        metalness: 0.15,
        roughness: 0.5,
        emissive: new THREE.Color('#241000'),
        emissiveIntensity: 0.05,
      }),
    []
  )
  const scleraMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f3f3f3',
        roughness: 0.7,
        metalness: 0.0,
      }),
    []
  )

  useFrame((_state, delta) => {
    const group = groupRef.current
    const pupil = pupilRef.current
    const iris = irisRef.current
    if (!group || !pupil || !iris) return

    const t = performance.now() / 1000
    const idleAmp = 0.02
    const idleX = Math.sin(t) * idleAmp
    const idleY = Math.sin(t * 0.8) * idleAmp

    const targetRotX = THREE.MathUtils.lerp(group.rotation.x, idleX + pointer.y * 0.15, 0.075)
    const targetRotY = THREE.MathUtils.lerp(group.rotation.y, idleY + -pointer.x * 0.2, 0.075)
    group.rotation.x = THREE.MathUtils.clamp(targetRotX, -0.35, 0.35)
    group.rotation.y = THREE.MathUtils.clamp(targetRotY, -0.4, 0.4)

    const basePupil = phase === 'focused' ? 0.28 : phase === 'zooming' ? 0.24 : 0.2
    const currentScale = pupil.scale.x || basePupil
    const nextScale = THREE.MathUtils.lerp(currentScale, basePupil, 0.1)
    pupil.scale.setScalar(nextScale)
    iris.rotation.z += delta * 0.02
  })

  return (
    <group
      ref={groupRef}
      onPointerDown={onActivate}
      onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = 'pointer'))}
      onPointerOut={() => (document.body.style.cursor = 'default')}
      scale={eyeScale}
    >
      <mesh ref={scleraRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={scleraMaterial} attach="material" />
      </mesh>

      <mesh ref={irisRef} position={[0, 0, 0.98]}>
        <circleGeometry args={[0.7, 96]} />
        <primitive object={irisMaterial} attach="material" />
      </mesh>

      <mesh ref={pupilRef} position={[0, 0, 0.99]}>
        <circleGeometry args={[0.2, 64]} />
        <primitive object={pupilMaterial} attach="material" />
      </mesh>
    </group>
  )
}

export default Eye


