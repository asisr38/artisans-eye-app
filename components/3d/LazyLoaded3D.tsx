'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Lazy load 3D components to improve initial page load
const EyeModel = dynamic(() => import('../3d/EyeModel'), { 
  ssr: false,
  loading: () => <EyeModelLoader />
})

const MuseumScene = dynamic(() => import('../3d/MuseumScene'), { 
  ssr: false,
  loading: () => <MuseumSceneLoader />
})

const PanoramaSphere = dynamic(() => import('../3d/PanoramaSphere'), { 
  ssr: false,
  loading: () => <PanoramaSphereLoader />
})

// Loading fallback components
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

const MuseumSceneLoader = () => (
  <mesh>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial 
      color="#2d3748" 
      metalness={0.2} 
      roughness={0.7}
      transparent
      opacity={0.5}
    />
  </mesh>
)

const PanoramaSphereLoader = () => (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial 
      color="#1a202c" 
      metalness={0.1} 
      roughness={0.9}
      transparent
      opacity={0.4}
    />
  </mesh>
)

// Export lazy-loaded components
export { EyeModel, MuseumScene, PanoramaSphere }
export { EyeModelLoader, MuseumSceneLoader, PanoramaSphereLoader }
