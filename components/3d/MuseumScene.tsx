'use client'

import { Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import EyeModel from './EyeModel'

type MuseumSceneProps = {
  src?: string
}

export const MuseumScene = ({ src = '/artifacts/3d/Museum.glb' }: MuseumSceneProps) => {
  const { scene } = useGLTF(src)

  const museumRoot = useMemo(() => {
    const root = scene.clone(true)
    // Optional: normalize scale if needed
    return root
  }, [scene])

  return (
    <group>
      {/* Place the eye near a wall, looking at a painting */}
      <group position={[0, -0.3, 0]}>
        <EyeModel scaleHint={0.5} />
      </group>
      <primitive object={museumRoot} />
    </group>
  )
}

useGLTF.preload('/artifacts/3d/Museum.glb')

export default MuseumScene


