'use client'

import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type EyeModelProps = {
  src?: string
  scaleHint?: number
  onActivate?: () => void
  tintColor?: string
  irisColor?: string
  metalness?: number
  roughness?: number
  envIntensity?: number
}

export const EyeModel = ({
  src = '/artifacts/3d/eye.glb',
  scaleHint = 0.65,
  onActivate,
  tintColor,
  irisColor,
  metalness,
  roughness,
  envIntensity,
}: EyeModelProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(src)
  const { pointer } = useThree()
  const [isDragging, setDragging] = useState(false)
  const [isHovering, setHovering] = useState(false)
  const dragStart = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)

  const scaleAndFront = useRef<{ scale: number; frontZ: number; pupilR: number } | null>(null)

  // Drag inertia
  const rotationVelocity = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 })
  const lastRotation = useRef<{ rx: number; ry: number } | null>(null)

  // No saccades/blinks to avoid flicker

  const centeredScene = useMemo(() => {
    const root = scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    root.position.sub(center)
    const maxDim = Math.max(size.x, size.y, size.z)
    const target = 2.0 * scaleHint
    const s = maxDim > 0 ? target / maxDim : 1
    root.scale.setScalar(s)
    // Approximate front surface Z and pupil radius based on scaled bounds
    const frontZ = (size.z * s) / 2
    const pupilR = (Math.min(size.x, size.y) * s) * 0.18
    scaleAndFront.current = { scale: s, frontZ, pupilR }
    return root
  }, [scene, scaleHint])

  const customizedScene = useMemo(() => {
    const root = centeredScene.clone(true)
    const tint = tintColor ? new THREE.Color(tintColor) : null
    const iris = irisColor ? new THREE.Color(irisColor) : null
    const hasMetal = typeof metalness === 'number'
    const hasRough = typeof roughness === 'number'
    const hasEnv = typeof envIntensity === 'number'

    root.traverse((obj) => {
      // @ts-expect-error - dynamic check for mesh
      if (obj && obj.isMesh) {
        const mesh = obj as THREE.Mesh
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial
          if (!mat || !('color' in mat)) return
          const name = (mat.name || mesh.name || '').toLowerCase()
          if (iris && (name.includes('iris') || name.includes('eye_iris'))) {
            mat.color.copy(iris)
          } else if (tint) {
            // Gentle overall tint without destroying base albedo
            const c = mat.color.clone()
            c.lerp(tint, 0.22)
            mat.color.copy(c)
          }
          if (hasMetal) mat.metalness = THREE.MathUtils.clamp(metalness as number, 0, 1)
          if (hasRough) mat.roughness = THREE.MathUtils.clamp(roughness as number, 0, 0.3) // Lower max roughness for shinier appearance
          if (hasEnv) mat.envMapIntensity = THREE.MathUtils.clamp(envIntensity as number, 0, 5)
          mat.needsUpdate = true
        })
      }
    })

    return root
  }, [centeredScene, tintColor, irisColor, metalness, roughness, envIntensity])

  useFrame((_state, delta) => {
    const g = groupRef.current
    if (!g) return

    const rotationFriction = 6.5

    if (!isDragging) {
      // Inertia continuation after drag
      if (Math.abs(rotationVelocity.current.vx) > 0.0005 || Math.abs(rotationVelocity.current.vy) > 0.0005) {
        g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + rotationVelocity.current.vx, -0.6, 0.6)
        g.rotation.y = THREE.MathUtils.clamp(g.rotation.y + rotationVelocity.current.vy, -Math.PI, Math.PI)
        const decay = Math.exp(-rotationFriction * delta)
        rotationVelocity.current.vx *= decay
        rotationVelocity.current.vy *= decay
      } else {
        // Idle gaze with subtle following of pointer and micro noise
        const t = performance.now() / 1000
        const idleAmp = 0.01
        const idleX = Math.sin(t) * idleAmp
        const idleY = Math.sin(t * 0.8) * idleAmp
        const targetX = isHovering ? pointer.y * 0.35 : 0
        const targetY = isHovering ? -pointer.x * 0.5 : 0
        const nextX = THREE.MathUtils.lerp(g.rotation.x, targetX + idleX, 0.12)
        const nextY = THREE.MathUtils.lerp(g.rotation.y, targetY + idleY, 0.12)
        g.rotation.x = THREE.MathUtils.clamp(nextX, -0.45, 0.45)
        g.rotation.y = THREE.MathUtils.clamp(nextY, -0.5, 0.5)
      }
    } else {
      // Track last rotation for velocity on release
      lastRotation.current = { rx: g.rotation.x, ry: g.rotation.y }
    }
  })

  useEffect(() => {
    return () => {
      try {
        document.body.style.cursor = 'default'
      } catch {}
    }
  }, [])

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      onPointerOver={(e) => (e.stopPropagation(), setHovering(true), (document.body.style.cursor = 'pointer'))}
      onPointerOut={() => (setHovering(false), (document.body.style.cursor = 'default'))}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setDragging(true)
        const g = groupRef.current
        if (!g) return
        const cx = e.clientX ?? e.nativeEvent.clientX ?? 0
        const cy = e.clientY ?? e.nativeEvent.clientY ?? 0
        dragStart.current = { x: cx, y: cy, rx: g.rotation.x, ry: g.rotation.y }
        rotationVelocity.current.vx = 0
        rotationVelocity.current.vy = 0
        lastRotation.current = { rx: g.rotation.x, ry: g.rotation.y }
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        if (!isDragging || !dragStart.current) return
        const g = groupRef.current
        if (!g) return
        const cx = e.clientX ?? e.nativeEvent.clientX ?? dragStart.current.x
        const cy = e.clientY ?? e.nativeEvent.clientY ?? dragStart.current.y
        const dx = (cx - dragStart.current.x) / 200
        const dy = (cy - dragStart.current.y) / 200
        g.rotation.y = THREE.MathUtils.clamp(dragStart.current.ry + dx, -Math.PI, Math.PI)
        // Invert vertical so dragging up looks up
        g.rotation.x = THREE.MathUtils.clamp(dragStart.current.rx - dy, -0.6, 0.6)
        // Estimate velocity based on recent rotation change
        if (lastRotation.current) {
          rotationVelocity.current.vx = THREE.MathUtils.clamp(g.rotation.x - lastRotation.current.rx, -0.2, 0.2)
          rotationVelocity.current.vy = THREE.MathUtils.clamp(g.rotation.y - lastRotation.current.ry, -0.2, 0.2)
        }
        lastRotation.current = { rx: g.rotation.x, ry: g.rotation.y }
      }}
      onPointerUp={() => {
        setDragging(false)
        dragStart.current = null
      }}
    >
      <primitive object={customizedScene} />
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

      {/* Glint removed per request */}
    </group>
  )
}

useGLTF.preload('/artifacts/3d/eye.glb')
useGLTF.preload('/artifacts/3d/eye.gltf')

export default EyeModel


