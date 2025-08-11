'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, BakeShadows } from '@react-three/drei'
import ArtifactModel from './ArtifactModel'

type ModelViewerCanvasProps = {
  src: string
}

export const ModelViewerCanvas = ({ src }: ModelViewerCanvasProps) => {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[0.04, 0.04, 0.04]} />
        <ambientLight intensity={0.35} />
        <directionalLight intensity={0.9} position={[3, 3, 5]} />
        <BakeShadows />

        <Suspense fallback={null}>
          <ArtifactModel src={src} />
        </Suspense>

        <OrbitControls enableDamping dampingFactor={0.08} minDistance={1.5} maxDistance={6} />
      </Canvas>
    </div>
  )
}

export default ModelViewerCanvas


