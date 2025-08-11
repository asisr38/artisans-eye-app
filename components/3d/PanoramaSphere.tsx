'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

type PanoramaSphereProps = {
  src: string
  radius?: number
}

export const PanoramaSphere = ({ src, radius = 10 }: PanoramaSphereProps) => {
  const texture = useRef<THREE.Texture | null>(null)
  const material = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.BackSide }), [])
  const { camera, gl } = useThree()

  useEffect(() => {
    const isVideo = /\.(mp4|webm|insv)$/i.test(src)
    if (isVideo) {
      const video = document.createElement('video')
      video.src = src
      video.crossOrigin = 'anonymous'
      video.loop = true
      video.muted = true
      video.playsInline = true
      const onCanPlay = () => {
        void video.play().catch(() => {})
        const tex = new THREE.VideoTexture(video)
        tex.colorSpace = THREE.SRGBColorSpace
        texture.current = tex
        material.map = tex
        material.needsUpdate = true
      }
      video.addEventListener('canplay', onCanPlay)
      return () => {
        video.removeEventListener('canplay', onCanPlay)
        video.pause()
      }
    } else {
      const loader = new THREE.TextureLoader()
      loader.load(src, (tex: THREE.Texture) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.wrapS = THREE.ClampToEdgeWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        texture.current = tex
        material.map = tex
        material.needsUpdate = true
      })
    }
  }, [src, material])

  // Wheel and pinch-to-zoom that adjusts camera FOV (panorama-friendly)
  useEffect(() => {
    const element = gl.domElement
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const fov = clamp(camera.fov + Math.sign(e.deltaY) * 2.5, 35, 95)
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    let prevDist = 0
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      if (prevDist !== 0) {
        const delta = prevDist - dist
        const fov = clamp(camera.fov + delta * 0.05, 35, 95)
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
      prevDist = dist
    }
    const onTouchEnd = () => {
      prevDist = 0
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd)
    return () => {
      element.removeEventListener('wheel', onWheel)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
    }
  }, [camera, gl])

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

export default PanoramaSphere


