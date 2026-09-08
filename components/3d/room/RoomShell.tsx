'use client'

import { Suspense } from 'react'
import GalleryModel from '../../gallery/GalleryModel'
import { ROOM_WIDTH, ROOM_DEPTH, FLOOR_MESH_NAME } from './constants'

export default function RoomShell() {
  return (
    <group>
      <Suspense fallback={null}>
        <GalleryModel />
      </Suspense>
      {/* Dedicated interaction surface keeps tap-to-walk independent of GLB names. */}
      <mesh name={FLOOR_MESH_NAME} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
