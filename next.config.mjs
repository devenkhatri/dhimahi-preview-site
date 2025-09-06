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
    optimizePackageImports: ["lucide-react"]
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
  swcMinify: true,
  poweredByHeader: false,
  
  // Rewrites for CMS admin
  async rewrites() {
    return [
      {
        source: '/admin',
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
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // CMS content processing optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/content': join(process.cwd(), 'content'),
      '@/cms': join(process.cwd(), 'src/lib/cms-content'),
    };

    // Development optimizations
    if (dev) {
      // Enhanced file watching - include content directory
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
        ],
        poll: 1000,
        aggregateTimeout: 300,
      };
      
      // Disable chunk splitting in development to prevent loading issues
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
          },
        },
      };
    } else if (!isServer) {
      // Production chunk splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            cms: {
              test: /[\\/]src[\\/]lib[\\/]cms-/,
              name: 'cms',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };

      // Add content validation during build
      const contentValidationPath = join(process.cwd(), 'scripts/validate-cms-build.js');
      if (existsSync(contentValidationPath)) {
        config.plugins.push({
          apply: (compiler) => {
            compiler.hooks.beforeCompile.tapAsync('ContentValidation', (params, callback) => {
              try {
                execSync('node scripts/validate-cms-build.js --build', { stdio: 'inherit' });
                callback();
              } catch (error) {
                callback(error);
              }
            });
          },
        });
      }
    }
    
    return config;
  },
};

export default nextConfig;
