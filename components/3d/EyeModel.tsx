'use client'

import type React from 'react'
import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
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

// Loading fallback component
const EyeModelLoader = () => (
  <mesh>
    <sphereGeometry args={[0.5, 32, 32]} />
    <meshStandardMaterial 
      color="#4a5568" 
      metalness={0.1} 
      roughness={0.8}
      transparent
      opacity={0.6}
    />
  </mesh>
)

const EyeModelCore = ({
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
  const [, setHovering] = useState(false)
  const dragStart = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)

  const scaleAndFront = useRef<{ scale: number; frontZ: number; pupilR: number } | null>(null)

  // Iris tracking refs
  const irisRef = useRef<THREE.Object3D | null>(null)
  const touchPointerRef = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 })
  const mousePointerRef = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 })
  const orientationRef = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 })
  const irisBaseInGroupRef = useRef<THREE.Vector3 | null>(null)

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
        mesh.castShadow = true
        mesh.receiveShadow = true
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
        // Capture a reference to the iris mesh for tracking
        const objName = (mesh.name || '').toLowerCase()
        if (!irisRef.current && (objName.includes('iris') || objName.includes('eye_iris'))) {
          irisRef.current = mesh
        }
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
        // Prefer most recent global inputs within last 200ms
        const now = performance.now()
        const useTouch = now - touchPointerRef.current.t < 200
        const useMouse = now - mousePointerRef.current.t < 200
        const px = useTouch ? touchPointerRef.current.x : useMouse ? mousePointerRef.current.x : pointer.x
        const py = useTouch ? touchPointerRef.current.y : useMouse ? mousePointerRef.current.y : pointer.y
        const targetX = py * 0.55
        const targetY = px * 0.8
        const nextX = THREE.MathUtils.lerp(g.rotation.x, targetX + idleX, 0.12)
        const nextY = THREE.MathUtils.lerp(g.rotation.y, targetY + idleY, 0.12)
        g.rotation.x = THREE.MathUtils.clamp(nextX, -0.45, 0.45)
        g.rotation.y = THREE.MathUtils.clamp(nextY, -0.5, 0.5)
      }
    } else {
      // Track last rotation for velocity on release
      lastRotation.current = { rx: g.rotation.x, ry: g.rotation.y }
    }

    // Gentle breathing scale (4s period, scales between 1.0 and 1.02)
    {
      const tSec = performance.now() / 1000
      const breathScale = 1.01 + 0.01 * Math.sin(((2 * Math.PI) / 4) * tSec)
      g.scale.setScalar(breathScale)
    }

    // Subtle iris tracking towards pointer/touch within ±10% radius of pupil
    const irisObj = irisRef.current
    if (irisObj) {
      const now = performance.now()
      // Prefer touch-derived pointer for mobile if recent
      let px = 0
      let py = 0
      if (now - orientationRef.current.t < 200) {
        px = orientationRef.current.x
        py = orientationRef.current.y
      } else if (now - touchPointerRef.current.t < 200) {
        px = touchPointerRef.current.x
        py = touchPointerRef.current.y
      } else if (now - mousePointerRef.current.t < 300) {
        px = mousePointerRef.current.x
        py = mousePointerRef.current.y
      } else {
        // Stale/no input: drift to center
        px = 0
        py = 0
      }

      // Tiny natural jitter (microsaccades)
      const tSec = now / 1000
      const tremorAmp = 0.003 // within suggested 0.002–0.005
      px += tremorAmp * Math.sin(6.1 * tSec + 0.7)
      py += tremorAmp * Math.sin(7.3 * tSec + 1.9)

      // Keep under 10% of pupil radius for realism (use ~8%)
      const moveRadius = (scaleAndFront.current ? scaleAndFront.current.pupilR : 0.18) * 0.08
      const offsetX = THREE.MathUtils.clamp(px * moveRadius, -moveRadius, moveRadius)
      const offsetY = THREE.MathUtils.clamp(py * moveRadius, -moveRadius, moveRadius)

      // Initialize base position in group space once (center X/Y for forward-facing default)
      if (!irisBaseInGroupRef.current && g) {
        const baseWorld = new THREE.Vector3()
        irisObj.getWorldPosition(baseWorld)
        const baseInGroup = g.worldToLocal(baseWorld.clone())
        baseInGroup.x = 0
        baseInGroup.y = 0
        irisBaseInGroupRef.current = baseInGroup
      }

      if (irisBaseInGroupRef.current && g && irisObj.parent) {
        // Use group's world-space basis to avoid axis quirks causing asymmetry
        const qWorld = new THREE.Quaternion()
        g.getWorldQuaternion(qWorld)
        const ex = new THREE.Vector3(1, 0, 0).applyQuaternion(qWorld)
        const ey = new THREE.Vector3(0, 1, 0).applyQuaternion(qWorld)
        const baseWorld = g.localToWorld(irisBaseInGroupRef.current.clone())
        const targetWorld = baseWorld.clone()
          .addScaledVector(ex, offsetX)
          .addScaledVector(ey, offsetY)
        const targetInParent = irisObj.parent.worldToLocal(targetWorld.clone())
        // Slower smoothing for organic motion (~120ms time constant)
        const lerpFactor = 1 - Math.exp(-delta / 0.12)
        irisObj.position.lerp(targetInParent, lerpFactor)
      }
    }
  })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      mousePointerRef.current = { x: nx, y: ny, t: performance.now() }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      // Map gamma (left/right tilt ~ -90..90) to x, beta (front/back tilt ~ -180..180) to y
      const gamma = e.gamma ?? 0 // left/right
      const beta = e.beta ?? 0 // front/back
      const nx = THREE.MathUtils.clamp(gamma / 45, -1, 1)
      const ny = THREE.MathUtils.clamp(-beta / 45, -1, 1)
      orientationRef.current = { x: nx, y: ny, t: performance.now() }
    }
    window.addEventListener('deviceorientation', onDeviceOrientation)
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return
      const t = e.touches[0]
      const nx = (t.clientX / window.innerWidth) * 2 - 1
      const ny = -((t.clientY / window.innerHeight) * 2 - 1)
      touchPointerRef.current = { x: nx, y: ny, t: performance.now() }
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('deviceorientation', onDeviceOrientation)
      window.removeEventListener('touchmove', onTouchMove)
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
      {/* Invisible pupil hotspot to trigger zoom when tapped */}
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

// Preload the main eye model for better performance
useGLTF.preload('/artifacts/3d/eye.glb')

// Main EyeModel component with Suspense wrapper
export const EyeModel = (props: EyeModelProps) => (
  <Suspense fallback={<EyeModelLoader />}>
    <EyeModelCore {...props} />
  </Suspense>
)

export default EyeModel


