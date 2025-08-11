import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // No remote patterns yet; add if needed for external images
    unoptimized: true,
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
