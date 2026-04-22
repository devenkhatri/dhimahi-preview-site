import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

// Determine if we should use static export
const isStaticBuild = process.env.NODE_ENV === 'production' || 
                     process.env.NODE_ENV === 'preview' ||
                     process.env.NEXT_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  
  // Make builds more deterministic
  generateBuildId: async () => {
    // Use git commit hash for consistent build IDs
    try {
      const gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      return gitHash.substring(0, 8);
    } catch {
      // Fallback to timestamp for non-git environments
      return process.env.BUILD_ID || 'local-build';
    }
  },
  
  // Static export configuration
  ...(isStaticBuild && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),

  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Disable features that cause non-deterministic builds
  poweredByHeader: false,

  // Rewrites for CMS admin
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/admin/',
        destination: '/admin/index.html',
      },
    ];
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // CMS content processing
  env: {
    CMS_CONTENT_PATH: './content',
    CMS_MEDIA_PATH: './public/uploads',
    // Use a deterministic build timestamp based on git commit or fixed value
    BUILD_TIMESTAMP: process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  },
};

export default nextConfig;