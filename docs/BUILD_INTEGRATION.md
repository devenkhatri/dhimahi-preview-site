# Build Process Integration Documentation

This document describes the build process integration for Decap CMS, including optimization features, Git hooks, and deployment configuration.

## Overview

The build integration provides:
- Automated content validation before builds
- Build optimization for faster deployment times
- Git hooks for content change detection
- Netlify-specific configuration for CMS integration
- Performance monitoring and reporting

## Configuration Files

### Next.js Configuration (`next.config.mjs`)

Enhanced with CMS-specific features:
- Content path aliases (`@/content`, `@/cms`)
- Content validation during build
- Webpack optimizations for CMS bundles
- Development file watching for content changes

### Netlify Configuration (`netlify.toml`)

Optimized for CMS builds:
- CMS-specific build commands
- Environment variables for content processing
- Build optimization settings
- Cache headers for media assets
- Build ignore rules for incremental builds

### Build Configuration (`build.config.js`)

Centralized build settings:
- Content paths and validation rules
- Optimization parameters
- Environment-specific overrides
- CMS collection definitions

## Scripts

### Build Optimization (`scripts/build-optimization.js`)

Features:
- Content change detection
- Build cache management
- Asset optimization
- Performance reporting

Usage:
```bash
npm run build:optimized
```

### Build Monitoring (`scripts/build-monitor.js`)

Features:
- Build performance analysis
- Historical build tracking
- Optimization recommendations
- Build time trends

Usage:
```bash
npm run build:monitor        # Summary
npm run build:analyze        # Detailed analysis
```

### Git Hooks Setup (`scripts/setup-git-hooks.js`)

Configures Git hooks for:
- Pre-commit content validation
- Post-commit change detection
- Build trigger optimization

Usage:
```bash
npm run setup:hooks
```

## Git Hooks

### Pre-commit Hook (`.githooks/pre-commit`)

Validates:
- CMS content integrity
- Media file optimization
- Schema compliance

### Post-commit Hook (`.githooks/post-commit`)

Processes:
- Content change detection
- Build trigger optimization
- Development workflow support

## Build Commands

### Development
```bash
npm run dev                   # Development server
npm run cms:dev              # CMS development mode
```

### Production Builds
```bash
npm run cms:build            # Full CMS build with optimization
npm run cms:build:fast       # Fast build for CI environments
npm run build:optimized     # Optimized build with caching
```

### Validation and Testing
```bash
npm run validate:content     # Full content validation
npm run validate:content:ci  # CI-optimized validation
npm run test:build-integration  # Test build configuration
```

### Monitoring and Analysis
```bash
npm run build:monitor        # Build performance summary
npm run build:analyze        # Detailed performance analysis
npm run build:report         # View latest build report
```

## Environment Variables

### Build Environment
- `NODE_ENV`: Build environment (development/production/preview)
- `CI`: CI environment detection
- `NETLIFY`: Netlify environment detection

### CMS Configuration
- `CMS_CONTENT_PATH`: Content directory path (default: ./content)
- `CMS_MEDIA_PATH`: Media uploads path (default: ./public/uploads)
- `BUILD_TIMESTAMP`: Build timestamp for cache busting

### Netlify-specific
- `CACHED_COMMIT_REF`: Previous build commit (for incremental builds)
- `COMMIT_REF`: Current build commit
- `BUILD_ID`: Unique build identifier

## Performance Optimizations

### Build Cache
- Content hash-based cache invalidation
- Incremental builds based on content changes
- Webpack bundle optimization

### Asset Optimization
- Automatic image optimization
- Media file compression
- Bundle splitting for CMS components

### Deployment Optimization
- Build ignore rules for unchanged content
- CDN cache headers for static assets
- Progressive build strategies

## Monitoring and Reporting

### Build Reports
Generated at `.next/build-report.json`:
```json
{
  "buildTime": 15000,
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": {
    "ci": true,
    "nodeVersion": "v20.0.0",
    "buildId": "build-123"
  },
  "optimizations": {
    "cacheUsed": true,
    "mediaOptimized": true
  }
}
```

### Performance Metrics
- Build time tracking
- Cache hit rates
- Asset optimization statistics
- Historical performance trends

## Troubleshooting

### Common Issues

1. **Build Validation Failures**
   ```bash
   npm run validate:content
   # Fix content issues and retry
   ```

2. **Cache Issues**
   ```bash
   # Clear build cache
   rm -rf .next/cache
   npm run build:optimized
   ```

3. **Git Hooks Not Working**
   ```bash
   npm run setup:hooks
   # Ensure hooks are executable
   chmod +x .git/hooks/*
   ```

4. **Slow Build Times**
   ```bash
   npm run build:analyze
   # Review optimization recommendations
   ```

### Debug Mode

Enable verbose logging:
```bash
DEBUG=build:* npm run cms:build
```

### CI/CD Debugging

For Netlify builds:
1. Check build logs for validation errors
2. Verify environment variables are set
3. Review build ignore rules
4. Check content change detection

## Best Practices

### Content Management
- Validate content before committing
- Use structured data for consistency
- Optimize images before uploading
- Follow naming conventions

### Build Optimization
- Enable incremental builds for large sites
- Use build cache for faster deployments
- Monitor build performance regularly
- Keep dependencies updated

### Development Workflow
- Set up Git hooks for automatic validation
- Use preview deployments for content testing
- Monitor build reports for performance issues
- Follow semantic versioning for content changes

## Integration Testing

Run the full integration test suite:
```bash
npm run test:build-integration
```

This validates:
- Configuration file integrity
- Script functionality
- Git hooks setup
- Directory structure
- Build process integration

## Support

For issues with build integration:
1. Run integration tests to identify problems
2. Check build reports for performance issues
3. Review Git hooks for validation errors
4. Consult Netlify build logs for deployment issues