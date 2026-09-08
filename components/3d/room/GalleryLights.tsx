'use client'

import { useMemo } from 'react'
import { Object3D } from 'three'
import { PAINTING_CENTER_Y, PAINTING_Z } from './constants'

/** Shared gallery lighting: skylight, neutral fill, and a restrained art light.
 * Only the skylight casts a shadow, keeping the mobile budget at one map.
 */
export default function GalleryLights() {
  const daylightTarget = useMemo(() => new Object3D(), [])
  const artworkTarget = useMemo(() => new Object3D(), [])
  return (
    <group>
      <primitive object={daylightTarget} position={[0, 0.2, -1.4]} />
      <primitive object={artworkTarget} position={[0, PAINTING_CENTER_Y, PAINTING_Z]} />
      <ambientLight intensity={0.65} color="#eee3d1" />
      <hemisphereLight intensity={2.0} color="#f3eee3" groundColor="#685443" />
      <directionalLight
        position={[0.4, 6, 0.7]}
        target={daylightTarget}
        intensity={3.4}
        color="#fff1d9"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-normalBias={0.025}
        shadow-bias={-0.0002}
      />
      <spotLight
        position={[0, 3.14, -2.55]}
        target={artworkTarget}
        intensity={7}
        angle={0.75}
        penumbra={1}
        distance={6}
        color="#ffe5c1"
      />
      <pointLight position={[0, 2.7, 3.3]} intensity={8} distance={12} color="#e9eff0" />
      <pointLight position={[0, 3.2, 0.55]} intensity={5} distance={8} color="#f4e7d5" />
    </group>
  )
}
