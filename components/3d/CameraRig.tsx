'use client'

import { useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../state/useSceneStore'
import { easing } from 'maath'

type CameraRigProps = {
  children?: React.ReactNode
}

export const CameraRig = ({ children }: CameraRigProps) => {
  const { camera, viewport } = useThree()
  const cameraTargetPosition = useSceneStore((s) => s.cameraTargetPosition)

  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame((_state, delta) => {
    const isMobile = viewport.width < 6
    const lerpSpeed = isMobile ? 1.5 : 2.0
    target.copy(cameraTargetPosition)
    easing.damp3(
      camera.position as unknown as THREE.Vector3,
      target as unknown as THREE.Vector3,
      lerpSpeed,
      delta
    )
    camera.lookAt(0, 0, 0)
  })

  return <>{children}</>
}

export default CameraRig
