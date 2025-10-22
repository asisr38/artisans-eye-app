/**
 * Image optimization utilities for serving WebP format when supported
 */

import { useState, useEffect } from 'react'

/**
 * Check if the browser supports WebP format
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Get optimized image URL with WebP fallback
 * @param originalUrl - The original image URL
 * @param webpUrl - Optional WebP version URL (if not provided, will try to convert .jpg/.png to .webp)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (originalUrl: string, webpUrl?: string): string => {
  if (typeof window === 'undefined') return originalUrl
  
  // If WebP is not supported, return original
  if (!supportsWebP()) return originalUrl
  
  // If WebP URL is provided, use it
  if (webpUrl) return webpUrl
  
  // For now, return original URL to avoid 404 errors
  // TODO: Implement proper WebP conversion or provide WebP versions
  return originalUrl
}

/**
 * Preload optimized images for better performance
 * @param urls - Array of image URLs to preload
 */
export const preloadImages = (urls: string[]): void => {
  if (typeof window === 'undefined') return
  
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = getOptimizedImageUrl(url)
    document.head.appendChild(link)
  })
}

/**
 * Hook to get optimized image URL with WebP support and fallback
 */
export const useOptimizedImage = (originalUrl: string, webpUrl?: string): string => {
  const [optimizedUrl, setOptimizedUrl] = useState(originalUrl)
  
  useEffect(() => {
    setOptimizedUrl(getOptimizedImageUrl(originalUrl, webpUrl))
  }, [originalUrl, webpUrl])
  
  return optimizedUrl
}

