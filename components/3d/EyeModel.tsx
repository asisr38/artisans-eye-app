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
}

export const EyeModel = ({ src = '/artifacts/3d/eye.glb', scaleHint = 0.65, onActivate }: EyeModelProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(src)
  const { pointer } = useThree()
  const [isDragging, setDragging] = useState(false)
  const dragStart = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)

  const scaleAndFront = useRef<{ scale: number; frontZ: number; pupilR: number } | null>(null)

  // Drag inertia
  const rotationVelocity = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 })
  const lastRotation = useRef<{ rx: number; ry: number } | null>(null)

  // Saccades (quick micro eye jumps)
  const saccade = useRef<{ targetX: number; targetY: number; startT: number; dur: number; active: boolean }>({ targetX: 0, targetY: 0, startT: 0, dur: 0.12, active: false })
  const nextSaccadeAt = useRef<number>(performance.now() + 1800 + Math.random() * 1400)

  // Blinks
  const blink = useRef<{ startT: number; dur: number; active: boolean }>({ startT: 0, dur: 0.14, active: false })
  const nextBlinkAt = useRef<number>(performance.now() + 2600 + Math.random() * 2400)

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

  useFrame((_state, delta) => {
    const g = groupRef.current
    if (!g) return

    const nowMs = performance.now()
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
        const t = nowMs / 1000
        const idleAmp = 0.02
        const idleX = Math.sin(t) * idleAmp
        const idleY = Math.sin(t * 0.8) * idleAmp
        // Saccade scheduling
        if (!saccade.current.active && nowMs > nextSaccadeAt.current) {
          saccade.current.active = true
          saccade.current.startT = t
          saccade.current.dur = 0.1 + Math.random() * 0.06
          const sx = (Math.random() - 0.5) * 0.18
          const sy = (Math.random() - 0.5) * 0.14
          saccade.current.targetX = THREE.MathUtils.clamp(g.rotation.x + sy, -0.35, 0.35)
          saccade.current.targetY = THREE.MathUtils.clamp(g.rotation.y + sx, -0.35, 0.35)
          nextSaccadeAt.current = nowMs + 1400 + Math.random() * 2000
        }
        if (saccade.current.active) {
          const p = Math.min(1, (t - saccade.current.startT) / saccade.current.dur)
          const k = 1 - Math.pow(1 - p, 3)
          const nx = THREE.MathUtils.lerp(g.rotation.x, saccade.current.targetX, k)
          const ny = THREE.MathUtils.lerp(g.rotation.y, saccade.current.targetY, k)
          g.rotation.x = THREE.MathUtils.clamp(nx, -0.35, 0.35)
          g.rotation.y = THREE.MathUtils.clamp(ny, -0.35, 0.35)
          if (p >= 1) saccade.current.active = false
        } else {
          const nextX = THREE.MathUtils.lerp(g.rotation.x, idleX + pointer.y * 0.1, 0.06)
          const nextY = THREE.MathUtils.lerp(g.rotation.y, idleY + -pointer.x * 0.12, 0.06)
          g.rotation.x = THREE.MathUtils.clamp(nextX, -0.3, 0.3)
          g.rotation.y = THREE.MathUtils.clamp(nextY, -0.35, 0.35)
        }
      }
    } else {
      // Track last rotation for velocity on release
      lastRotation.current = { rx: g.rotation.x, ry: g.rotation.y }
    }

    // Blink scheduling
    if (!blink.current.active && nowMs > nextBlinkAt.current) {
      blink.current.active = true
      blink.current.startT = nowMs / 1000
      blink.current.dur = 0.12 + Math.random() * 0.06
      // Next blink can be a double-blink occasionally
      const gap = 1800 + Math.random() * 2600
      nextBlinkAt.current = nowMs + gap
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
      onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = 'pointer'))}
      onPointerOut={() => (document.body.style.cursor = 'default')}
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
        g.rotation.x = THREE.MathUtils.clamp(dragStart.current.rx + dy, -0.6, 0.6)
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

      {/* Eyelids for blink animation */}
      {scaleAndFront.current && (
        <group>
          <BlinkLids
            frontZ={scaleAndFront.current.frontZ}
            pupilR={scaleAndFront.current.pupilR}
            blinkRef={blink}
          />
          <CornealGlint
            frontZ={scaleAndFront.current.frontZ}
            pupilR={scaleAndFront.current.pupilR}
            groupRef={groupRef}
          />
        </group>
      )}
    </group>
  )
}

useGLTF.preload('/artifacts/3d/eye.glb')
useGLTF.preload('/artifacts/3d/eye.gltf')

type BlinkLidsProps = {
  frontZ: number
  pupilR: number
  blinkRef: React.MutableRefObject<{ startT: number; dur: number; active: boolean }>
}

const BlinkLids = ({ frontZ, pupilR, blinkRef }: BlinkLidsProps) => {
  const upperRef = useRef<THREE.Mesh>(null)
  const lowerRef = useRef<THREE.Mesh>(null)
  useFrame(() => {
    const blink = blinkRef.current
    const t = performance.now() / 1000
    let k = 0
    if (blink.active) {
      const p = Math.min(1, (t - blink.startT) / blink.dur)
      // Ease-in-out close/open in a single cycle
      const phase = p < 0.5 ? (p / 0.5) : (1 - (p - 0.5) / 0.5)
      k = Math.pow(phase, 0.9)
      if (p >= 1) blink.active = false
    }
    const cover = THREE.MathUtils.clamp(k, 0, 1) * pupilR * 1.6
    if (upperRef.current) upperRef.current.position.y = cover
    if (lowerRef.current) lowerRef.current.position.y = -cover
  })
  const width = pupilR * 2.6
  const height = pupilR * 1.8
  const common: { renderOrder: number } = { renderOrder: 999 }
  return (
    <group>
      <mesh ref={upperRef} position={[0, 0, frontZ * 0.97]} {...common}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#0b0b0b" transparent opacity={0.9} depthTest={false} />
      </mesh>
      <mesh ref={lowerRef} position={[0, 0, frontZ * 0.97]} {...common}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#0b0b0b" transparent opacity={0.9} depthTest={false} />
      </mesh>
    </group>
  )
}

type CornealGlintProps = {
  frontZ: number
  pupilR: number
  groupRef: React.RefObject<THREE.Group | null>
}

const CornealGlint = ({ frontZ, pupilR, groupRef }: CornealGlintProps) => {
  const glintRef = useRef<THREE.Sprite>(null)
  useFrame(() => {
    const g = groupRef.current
    const s = glintRef.current
    if (!g || !s) return
    // Offset glint opposite to rotation to simulate light reflection
    const ox = THREE.MathUtils.clamp(-g.rotation.y * 0.25, -0.18, 0.18)
    const oy = THREE.MathUtils.clamp(-g.rotation.x * 0.25, -0.15, 0.15)
    s.position.set(ox, oy, frontZ * 0.99)
  })
  const spriteMaterial = useMemo(() => {
    const m = new THREE.SpriteMaterial({ color: new THREE.Color('#ffffff') })
    m.opacity = 0.9
    m.depthTest = false
    m.blending = THREE.AdditiveBlending
    return m
  }, [])
  return (
    <sprite ref={glintRef} material={spriteMaterial} scale={[pupilR * 0.35, pupilR * 0.35, 1]} />
  )
}

export default EyeModel


