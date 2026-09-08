'use client'

import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo } from 'react'
import {
  PAINTING_WIDTH,
  PAINTING_HEIGHT,
  PAINTING_CENTER_Y,
  PAINTING_Z,
  PAINTING_GROUP_NAME,
  PAINTING_MESH_NAME,
} from './constants'

type Props = {
  // Swappable artifact image (high-res source in public/artifacts/).
  textureSrc?: string
}

const FRAME_DEPTH = 0.045
const FRAME_BORDER = 0.05

// Framed thangka quad on the focal wall. The texture comes from drei's
// useTexture cache. Clone the texture before configuring it; preserve the
// original photograph colors independently of the architectural lighting.
export default function ThangkaWall({ textureSrc = '/artifacts/thangka-centerpiece.jpg' }: Props) {
  const source = useTexture(textureSrc)
  const texture = useMemo(() => {
    const copy = source.clone()
    copy.colorSpace = THREE.SRGBColorSpace
    copy.anisotropy = 8
    copy.needsUpdate = true
    return copy
  }, [source])
  useEffect(() => () => texture.dispose(), [texture])

  const w = PAINTING_WIDTH
  const h = PAINTING_HEIGHT

  return (
    <group name={PAINTING_GROUP_NAME} position={[0, PAINTING_CENTER_Y, PAINTING_Z]}>
      {/* Frame — four dark moulding bars, slightly proud of the wall. */}
      <group position={[0, 0, FRAME_DEPTH / 2]}>
        <mesh position={[0, h / 2 + FRAME_BORDER / 2, 0]} castShadow>
          <boxGeometry args={[w + FRAME_BORDER * 2, FRAME_BORDER, FRAME_DEPTH]} />
          <meshStandardMaterial color="#241a12" roughness={0.45} metalness={0.25} />
        </mesh>
        <mesh position={[0, -(h / 2 + FRAME_BORDER / 2), 0]} castShadow>
          <boxGeometry args={[w + FRAME_BORDER * 2, FRAME_BORDER, FRAME_DEPTH]} />
          <meshStandardMaterial color="#241a12" roughness={0.45} metalness={0.25} />
        </mesh>
        <mesh position={[-(w / 2 + FRAME_BORDER / 2), 0, 0]} castShadow>
          <boxGeometry args={[FRAME_BORDER, h, FRAME_DEPTH]} />
          <meshStandardMaterial color="#241a12" roughness={0.45} metalness={0.25} />
        </mesh>
        <mesh position={[w / 2 + FRAME_BORDER / 2, 0, 0]} castShadow>
          <boxGeometry args={[FRAME_BORDER, h, FRAME_DEPTH]} />
          <meshStandardMaterial color="#241a12" roughness={0.45} metalness={0.25} />
        </mesh>
      </group>

      {/* The painting itself — named for the rig's tap-to-walk raycast. */}
      <mesh name={PAINTING_MESH_NAME} position={[0, 0, FRAME_DEPTH * 0.6]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

useTexture.preload('/artifacts/thangka-centerpiece.jpg')
