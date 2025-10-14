import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // No remote patterns yet; add if needed for external images
    unoptimized: true,
  },
  experimental: {
    // Allow dev access from phone over LAN; add your device IP(s) here
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      // Example: replace with your LAN IP(s)
      'http://192.168.0.0:3000',
      'http://192.168.1.0:3000',
    ],
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
