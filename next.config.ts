import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Socket.IO server runs via a custom server, not Next.js route handlers.
  // Exclude these packages from the Next.js server bundle.
  serverExternalPackages: ['socket.io'],
}

export default nextConfig
