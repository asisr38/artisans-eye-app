'use client'

import { useEffect, useMemo, useRef, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type EyeModelProps = {
  src?: string
  scaleHint?: number
  tintColor?: string
  irisColor?: string
  metalness?: number
  roughness?: number
  envIntensity?: number
}

const EyeModelLoader = () => (
  <mesh>
    <sphereGeometry args={[0.5, 32, 32]} />
    <meshStandardMaterial color="#4a5568" metalness={0.1} roughness={0.8} transparent opacity={0.6} />
  </mesh>
)

const EyeModelCore = ({
  src = '/artifacts/3d/eye.glb',
  scaleHint = 0.65,
  tintColor,
  irisColor,
  metalness,
  roughness,
  envIntensity,
}: EyeModelProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(src)
  const { pointer } = useThree()

  const irisRef = useRef<THREE.Object3D | null>(null)
  const irisBaseRef = useRef<THREE.Vector3 | null>(null)
  const pupilRRef = useRef(0.18)
  const mousePointerRef = useRef({ x: 0, y: 0, t: 0 })

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
    pupilRRef.current = Math.min(size.x, size.y) * s * 0.18
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
      // @ts-expect-error - dynamic mesh check
      if (!obj?.isMesh) return
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
          const c = mat.color.clone()
          c.lerp(tint, 0.22)
          mat.color.copy(c)
        }
        if (hasMetal) mat.metalness = THREE.MathUtils.clamp(metalness as number, 0, 1)
        if (hasRough) mat.roughness = THREE.MathUtils.clamp(roughness as number, 0, 0.3)
        if (hasEnv) mat.envMapIntensity = THREE.MathUtils.clamp(envIntensity as number, 0, 5)
        mat.needsUpdate = true
      })
      const objName = (mesh.name || '').toLowerCase()
      if (!irisRef.current && (objName.includes('iris') || objName.includes('eye_iris'))) {
        irisRef.current = mesh
      }
    })

    return root
  }, [centeredScene, tintColor, irisColor, metalness, roughness, envIntensity])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      mousePointerRef.current = { x: nx, y: ny, t: performance.now() }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame((_state, delta) => {
    const g = groupRef.current
    if (!g) return

    // Idle gaze: lerp toward pointer with subtle sin offset.
    const t = performance.now() / 1000
    const idleAmp = 0.01
    const idleX = Math.sin(t) * idleAmp
    const idleY = Math.sin(t * 0.8) * idleAmp
    const px = pointer.x
    const py = pointer.y
    const targetX = py * 0.45
    const targetY = px * 0.7
    const k = 1 - Math.exp(-delta / 0.18)
    g.rotation.x = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(g.rotation.x, targetX + idleX, k),
      -0.4,
      0.4
    )
    g.rotation.y = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(g.rotation.y, targetY + idleY, k),
      -0.45,
      0.45
    )

    // Breathing scale.
    const breath = 1.01 + 0.01 * Math.sin(((2 * Math.PI) / 4) * t)
    g.scale.setScalar(breath)

    // Iris micro-movement toward pointer.
    const irisObj = irisRef.current
    if (!irisObj) return

    const now = performance.now()
    const fresh = now - mousePointerRef.current.t < 400
    const ix = fresh ? mousePointerRef.current.x : 0
    const iy = fresh ? mousePointerRef.current.y : 0
    const tremorAmp = 0.003
    const ipx = ix + tremorAmp * Math.sin(6.1 * t + 0.7)
    const ipy = iy + tremorAmp * Math.sin(7.3 * t + 1.9)

    const moveR = pupilRRef.current * 0.08
    const offX = THREE.MathUtils.clamp(ipx * moveR, -moveR, moveR)
    const offY = THREE.MathUtils.clamp(ipy * moveR, -moveR, moveR)

    if (!irisBaseRef.current) {
      const baseWorld = new THREE.Vector3()
      irisObj.getWorldPosition(baseWorld)
      const baseInGroup = g.worldToLocal(baseWorld.clone())
      baseInGroup.x = 0
      baseInGroup.y = 0
      irisBaseRef.current = baseInGroup
    }

    if (irisBaseRef.current && irisObj.parent) {
      const qWorld = new THREE.Quaternion()
      g.getWorldQuaternion(qWorld)
      const ex = new THREE.Vector3(1, 0, 0).applyQuaternion(qWorld)
      const ey = new THREE.Vector3(0, 1, 0).applyQuaternion(qWorld)
      const baseWorld = g.localToWorld(irisBaseRef.current.clone())
      const targetWorld = baseWorld.clone().addScaledVector(ex, offX).addScaledVector(ey, offY)
      const targetInParent = irisObj.parent.worldToLocal(targetWorld.clone())
      const lerpFactor = 1 - Math.exp(-delta / 0.12)
      irisObj.position.lerp(targetInParent, lerpFactor)
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={customizedScene} />
    </group>
  )
}

useGLTF.preload('/artifacts/3d/eye.glb')

export const EyeModel = (props: EyeModelProps) => (
  <Suspense fallback={<EyeModelLoader />}>
    <EyeModelCore {...props} />
  </Suspense>
)

export default EyeModel
