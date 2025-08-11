'use client'

import { useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../state/useSceneStore'
import { easing } from 'maath'

type CameraRigProps = {
  children?: React.ReactNode
}

export const CameraRig = ({ children }: CameraRigProps) => {
  const { camera, viewport } = useThree()
  const phase = useSceneStore((s) => s.phase)
  const cameraTargetPosition = useSceneStore((s) => s.cameraTargetPosition)
  const setPhase = useSceneStore((s) => s.setPhase)

  const target = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (phase !== 'idle') return
    camera.position.set(0, 0, 3)
    camera.lookAt(0, 0, 0)
  }, [camera, phase])

  useFrame((_state, delta) => {
    const isMobile = viewport.width < 6
    const lerpSpeed = isMobile ? 1.5 : 2.0

    if (phase !== 'focused') {
      target.copy(cameraTargetPosition)
      easing.damp3(
        camera.position as unknown as THREE.Vector3,
        target as unknown as THREE.Vector3,
        lerpSpeed,
        delta
      )
      camera.lookAt(0, 0, 0)
    }

    if (phase === 'zooming') {
      const distance = camera.position.distanceTo(target)
      if (distance < 0.02) setPhase('focused')
    }
  })

  return <>{children}</>
}

export default CameraRig


