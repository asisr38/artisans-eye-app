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
  const videoEl = useRef<HTMLVideoElement | null>(null)
  const material = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.BackSide }), [])
  const { camera, gl } = useThree()

  useEffect(() => {
    // Cleanup any previous resources before loading new
    if (texture.current) {
      texture.current.dispose()
      texture.current = null
    }
    if (videoEl.current) {
      try {
        videoEl.current.pause()
      } catch {}
      videoEl.current.src = ''
      videoEl.current.load()
      videoEl.current = null
    }
    material.map = null
    material.needsUpdate = true

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
      videoEl.current = video
      return () => {
        video.removeEventListener('canplay', onCanPlay)
        try {
          video.pause()
        } catch {}
        video.src = ''
        video.load()
        if (texture.current) {
          texture.current.dispose()
          texture.current = null
        }
      }
    }

    const loader = new THREE.TextureLoader()
    let isDisposed = false
    loader.load(src, (tex: THREE.Texture) => {
      if (isDisposed) {
        tex.dispose()
        return
      }
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      texture.current = tex
      material.map = tex
      material.needsUpdate = true
    })
    return () => {
      isDisposed = true
      if (texture.current) {
        texture.current.dispose()
        texture.current = null
      }
    }
  }, [src, material])

  // Dispose material on unmount
  useEffect(() => {
    return () => {
      try {
        if (material.map) {
          material.map.dispose()
          material.map = null
        }
        material.dispose()
      } catch {}
    }
  }, [material])

  // Wheel and pinch-to-zoom that adjusts camera FOV (panorama-friendly)
  useEffect(() => {
    const element = gl.domElement
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const pc = camera as THREE.PerspectiveCamera
      if (!(pc as unknown as { isPerspectiveCamera?: boolean }).isPerspectiveCamera) return
      const fov = clamp(pc.fov + Math.sign(e.deltaY) * 2.5, 35, 95)
      pc.fov = fov
      pc.updateProjectionMatrix()
    }

    let prevDist = 0
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      if (prevDist !== 0) {
        const delta = prevDist - dist
        const pc = camera as THREE.PerspectiveCamera
        if (!(pc as unknown as { isPerspectiveCamera?: boolean }).isPerspectiveCamera) return
        const fov = clamp(pc.fov + delta * 0.05, 35, 95)
        pc.fov = fov
        pc.updateProjectionMatrix()
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


