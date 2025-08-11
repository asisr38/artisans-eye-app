'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

type ArtifactProps = {
  textureUrl: string
}

export const Artifact = ({ textureUrl }: ArtifactProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])

  useFrame((_s, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.1
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} position={[0, 0, 0.4]}> 
        <circleGeometry args={[0.55, 72]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  )
}

export default Artifact


