/**
 * Performance monitoring utilities for 3D assets
 */

import React from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
  errorCount: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('.glb') || entry.name.includes('.gltf')) {
          this.recordAssetLoad(entry.name, entry.duration)
        }
      }
    })
    
    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (e) {
      console.warn('Performance Observer not supported')
    }
  }

  recordAssetLoad(assetName: string, loadTime: number): void {
    const existing = this.metrics.get(assetName) || {
      loadTime: 0,
      renderTime: 0,
      errorCount: 0
    }
    
    this.metrics.set(assetName, {
      ...existing,
      loadTime: Math.max(existing.loadTime, loadTime)
    })
  }

  recordRenderTime(componentName: string, renderTime: number): void {
    const existing = this.metrics.get(componentName) || {
      loadTime: 0,
      renderTime: 0,
      errorCount: 0
    }
    
    this.metrics.set(componentName, {
      ...existing,
      renderTime: Math.max(existing.renderTime, renderTime)
    })
  }

  recordError(componentName: string): void {
    const existing = this.metrics.get(componentName) || {
      loadTime: 0,
      renderTime: 0,
      errorCount: 0
    }
    
    this.metrics.set(componentName, {
      ...existing,
      errorCount: existing.errorCount + 1
    })
  }

  getMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics)
  }

  getMetricsForAsset(assetName: string): PerformanceMetrics | undefined {
    return this.metrics.get(assetName)
  }

  clearMetrics(): void {
    this.metrics.clear()
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Hook for React components
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = React.useRef<number>(0)

  const startTiming = () => {
    startTime.current = performance.now()
  }

  const endTiming = () => {
    if (startTime.current > 0) {
      const renderTime = performance.now() - startTime.current
      performanceMonitor.recordRenderTime(componentName, renderTime)
    }
  }

  const recordError = () => {
    performanceMonitor.recordError(componentName)
  }

  return {
    startTiming,
    endTiming,
    recordError
  }
}

