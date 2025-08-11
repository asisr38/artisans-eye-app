'use client'

import { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type EyeModelProps = {
  src?: string
  scaleHint?: number
  onActivate?: () => void
}

export const EyeModel = ({ src = '/artifacts/3d/eye.glb', scaleHint = 0.65, onActivate }: EyeModelProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(src)
  const { pointer } = useThree()
  const [isDragging, setDragging] = useState(false)
  const dragStart = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)

  const scaleAndFront = useRef<{ scale: number; frontZ: number; pupilR: number } | null>(null)

  const centeredScene = useMemo(() => {
    const root = scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    root.position.sub(center)
    const maxDim = Math.max(size.x, size.y, size.z)
    const target = 2.0 * scaleHint // keep roughly similar to eye size
    const s = maxDim > 0 ? target / maxDim : 1
    root.scale.setScalar(s)
    // Approximate front surface Z and pupil radius based on scaled bounds
    const frontZ = (size.z * s) / 2
    const pupilR = (Math.min(size.x, size.y) * s) * 0.18
    scaleAndFront.current = { scale: s, frontZ, pupilR }
    return root
  }, [scene, scaleHint])

  useFrame((_s, delta) => {
    const g = groupRef.current
    if (!g) return
    if (!isDragging) {
      const t = performance.now() / 1000
      const idleAmp = 0.02
      const idleX = Math.sin(t) * idleAmp
      const idleY = Math.sin(t * 0.8) * idleAmp
      const nextX = THREE.MathUtils.lerp(g.rotation.x, idleX + pointer.y * 0.1, 0.06)
      const nextY = THREE.MathUtils.lerp(g.rotation.y, idleY + -pointer.x * 0.12, 0.06)
      g.rotation.x = THREE.MathUtils.clamp(nextX, -0.3, 0.3)
      g.rotation.y = THREE.MathUtils.clamp(nextY, -0.35, 0.35)
    }
  })

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = 'pointer'))}
      onPointerOut={() => (document.body.style.cursor = 'default')}
      onPointerDownCapture={(e) => {
        e.stopPropagation()
        setDragging(true)
        const g = groupRef.current
        if (!g) return
        dragStart.current = { x: e.clientX, y: e.clientY, rx: g.rotation.x, ry: g.rotation.y }
      }}
      onPointerMove={(e) => {
        if (!isDragging || !dragStart.current) return
        const g = groupRef.current
        if (!g) return
        const dx = (e.clientX - dragStart.current.x) / 200
        const dy = (e.clientY - dragStart.current.y) / 200
        g.rotation.y = THREE.MathUtils.clamp(dragStart.current.ry + dx, -Math.PI, Math.PI)
        g.rotation.x = THREE.MathUtils.clamp(dragStart.current.rx + dy, -0.6, 0.6)
      }}
      onPointerUpCapture={() => {
        setDragging(false)
        dragStart.current = null
      }}
    >
      <primitive object={centeredScene} />
      {/* Invisible pupil hotspot to trigger zoom only when tapped */}
      <mesh
        position={[0, 0, scaleAndFront.current ? scaleAndFront.current.frontZ * 0.96 : 0.9]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onActivate?.()
        }}
        visible={false}
      >
        <circleGeometry args={[scaleAndFront.current ? scaleAndFront.current.pupilR : 0.18, 64]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/artifacts/eye.glb')
useGLTF.preload('/artifacts/eye.gltf')

export default EyeModel


