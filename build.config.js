/**
 * Build configuration for CMS integration
 * Centralizes build settings and optimization parameters
 */

const path = require('path');

const buildConfig = {
  // Content paths
  paths: {
    content: './content',
    uploads: './public/uploads',
    admin: './public/admin',
    cache: './.next/cache',
    output: './out'
  },

  // Build optimization settings
  optimization: {
    // Enable incremental builds based on content changes
    incremental: true,
    
    // Cache settings
    cache: {
      enabled: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      contentHashFile: '.next/cache/content-hash.json'
    },

    // Media optimization
    media: {
      enabled: true,
      formats: ['webp', 'avif'],
      quality: 85,
      progressive: true
    },

    // Bundle optimization
    bundle: {
      splitChunks: true,
      minify: true,
      treeshake: true
    }
  },

  // CMS-specific settings
  cms: {
    // Collections to validate during build
    collections: [
      'homepage',
      'pages',
      'services',
      'case-studies',
      'insights',
      'settings'
    ],

    // Required fields validation
    validation: {
      strict: process.env.NODE_ENV === 'production',
      failOnMissing: true,
      failOnInvalid: true
    },

    // Preview settings
    preview: {
      enabled: true,
      templates: [
        'homepage-preview.js',
        'service-preview.js',
        'case-study-preview.js',
        'insight-preview.js',
        'pages-preview.js',
        'settings-preview.js'
      ]
    }
  },

  // Environment-specific settings
  environments: {
    development: {
      optimization: {
        incremental: false,
        cache: { enabled: false }
      },
      cms: {
        validation: { strict: false }
      }
    },

    preview: {
      optimization: {
        incremental: true,
        cache: { enabled: true }
      },
      cms: {
        validation: { strict: false }
      }
    },

    production: {
      optimization: {
        incremental: true,
        cache: { enabled: true }
      },
      cms: {
        validation: { strict: true }
      }
    }
  },

  // Build hooks
  hooks: {
    preBuild: [
      'validate:content',
      'optimize:media'
    ],
    
    postBuild: [
      'build:report'
    ]
  }
};

// Apply environment-specific overrides
function getConfig(env = process.env.NODE_ENV || 'development') {
  const config = { ...buildConfig };
  
  if (config.environments[env]) {
    // Deep merge environment-specific settings
    const envConfig = config.environments[env];
    
    if (envConfig.optimization) {
      config.optimization = { ...config.optimization, ...envConfig.optimization };
    }
    
    if (envConfig.cms) {
      config.cms = { ...config.cms, ...envConfig.cms };
    }
  }
  
  return config;
}

module.exports = {
  buildConfig,
  getConfig
};