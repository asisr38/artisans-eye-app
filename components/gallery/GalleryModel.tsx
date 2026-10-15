'use client'

import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Mesh } from 'three'

export default function GalleryModel() {
  const { scene } = useGLTF('/artifacts/3d/bhaktapur-gallery.glb?v=4', '/draco/')
  const instance = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    return clone
  }, [scene])
  return <primitive object={instance} dispose={null} />
}
