import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
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
}

export default nextConfig
