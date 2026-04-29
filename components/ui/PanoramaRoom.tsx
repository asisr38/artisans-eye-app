'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import * as THREE from 'three'

type Props = {
  src: string
}

function RoomSphere({ src }: Props) {
  const texture = useLoader(THREE.TextureLoader, src)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true
  }, [texture])

  return (
    <mesh rotation={[0, Math.PI / 2, 0]}>
      <sphereGeometry args={[500, 96, 48]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  )
}

export default function PanoramaRoom({ src }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 0.1], fov: 76, near: 0.1, far: 1000 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
        gl.setClearColor('#050505', 1)
      }}
    >
      <Suspense fallback={null}>
        <RoomSphere src={src} />
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom={false}
        rotateSpeed={-0.35}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.78}
      />
    </Canvas>
  )
}
