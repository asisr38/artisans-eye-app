'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type StarfieldProps = {
  count?: number
  minRadius?: number
  maxRadius?: number
}

const Starfield = ({ count = 1200, minRadius = 20, maxRadius = 60 }: StarfieldProps) => {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = THREE.MathUtils.randFloat(minRadius, maxRadius)
      const theta = Math.random() * Math.PI * 2 // 0..2PI
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2)) // 0..PI using inverse transform
      const sinPhi = Math.sin(phi)
      pos[i * 3] = r * sinPhi * Math.cos(theta)
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count, minRadius, maxRadius])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02
    }
    if (materialRef.current) {
      // subtle global twinkle
      materialRef.current.opacity = 0.7 + Math.sin(t * 2) * 0.1
    }
  })

  return (
    <points ref={pointsRef} frustumCulled>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={0xbfd6ff}
        size={0.06}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default Starfield


