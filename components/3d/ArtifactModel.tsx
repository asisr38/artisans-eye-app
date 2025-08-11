'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type ArtifactModelProps = {
  src: string
}

export const ArtifactModel = ({ src }: ArtifactModelProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(src)

  // Center and scale the imported model to fit nicely in view
  const centeredScene = useMemo(() => {
    const root = scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // Move the model so its center is at the origin
    root.position.sub(center)

    // Scale model to fit into a radius of ~0.7 units
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 1.4 // diameter to fit within
    const scale = maxDim > 0 ? targetSize / maxDim : 1
    root.scale.setScalar(scale)
    return root
  }, [scene])

  useFrame((_s, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.25
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={centeredScene} />
    </group>
  )
}

useGLTF.preload('/artifacts/3_15_2023.glb')

export default ArtifactModel


