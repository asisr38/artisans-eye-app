'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type RotatorProps = {
  children: React.ReactNode
  speed?: number
  enabled?: boolean
}

export const Rotator = ({ children, speed = 0.15, enabled = true }: RotatorProps) => {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_s, delta) => {
    if (!enabled || !groupRef.current) return
    groupRef.current.rotation.y += delta * speed
  })
  return <group ref={groupRef}>{children}</group>
}

export default Rotator


