import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
  eslint: {
    // Avoid blocking production builds on lint errors; CI can enforce separately
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep type checking on, but do not emit; Next already type-checks in build step
    ignoreBuildErrors: false,
  },
  images: {
    // No remote patterns yet; add if needed for external images
    unoptimized: true,
  },
  compiler: {
    removeConsole: isProd ? { exclude: ['error'] } : false,
  },
  experimental: {
    // Intentionally empty for production stability
  },
  webpack: (config) => {
    // Silence video texture warnings in some host environments
    config.module.parser = {
      ...config.module.parser,
      javascript: {
        ...((config.module as any).parser?.javascript || {}),
        url: 'relative',
      },
    }
    return config
  },
}

export default nextConfig
