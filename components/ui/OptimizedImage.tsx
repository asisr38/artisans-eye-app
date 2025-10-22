'use client'

import React from 'react'
import { useOptimizedImage } from '../../utils/imageOptimization'

interface OptimizedImageProps {
  src: string
  webpSrc?: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  webpSrc,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const optimizedSrc = useOptimizedImage(src, webpSrc)

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
      decoding="async"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      style={{ contain: 'content' }}
    />
  )
}

export default OptimizedImage
