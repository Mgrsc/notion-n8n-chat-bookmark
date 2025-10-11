/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Turbopack 优化
    turbo: {},

    // 优化包导入
    optimizePackageImports: ['lucide-react']
  },

  // 编译器优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false
  },

  // TypeScript 严格模式
  typescript: {
    ignoreBuildErrors: false
  },

  eslint: {
    ignoreDuringBuilds: false
  },

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60
  }
}

export default nextConfig
