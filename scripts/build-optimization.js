#!/usr/bin/env node

/**
 * Build optimization script for CMS integration
 * Optimizes build process for faster deployment times
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildOptimizer {
  constructor() {
    this.startTime = Date.now();
    this.isCI = process.env.CI === 'true' || process.env.NETLIFY === 'true';
    this.cacheDir = path.join(process.cwd(), '.next', 'cache');
    this.contentDir = path.join(process.cwd(), 'content');
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async checkContentChanges() {
    this.log('Checking for content changes...');
    
    try {
      // Check if this is an incremental build
      if (this.isCI && process.env.CACHED_COMMIT_REF && process.env.COMMIT_REF) {
        const changedFiles = execSync(
          `git diff --name-only ${process.env.CACHED_COMMIT_REF} ${process.env.COMMIT_REF}`,
          { encoding: 'utf8' }
        ).trim().split('\n').filter(Boolean);

        const contentChanged = changedFiles.some(file => 
          file.startsWith('content/') || 
          file.startsWith('public/uploads/') ||
          file.startsWith('src/lib/cms-') ||
          file.startsWith('public/admin/')
        );

        if (!contentChanged) {
          this.log('No content changes detected, optimizing build...');
          return false;
        }

        this.log(`Content changes detected in ${changedFiles.length} files`);
        return true;
      }
    } catch (error) {
      this.log(`Could not check content changes: ${error.message}`, 'warn');
    }

    return true; // Default to full build if we can't determine changes
  }

  async optimizeCache() {
    this.log('Optimizing build cache...');

    try {
      // Ensure cache directory exists
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }

      // Create content hash for cache invalidation
      const contentHash = this.generateContentHash();
      const cacheFile = path.join(this.cacheDir, 'content-hash.json');
      
      let previousHash = null;
      if (fs.existsSync(cacheFile)) {
        try {
          const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
          previousHash = cacheData.hash;
        } catch (error) {
          this.log(`Could not read cache file: ${error.message}`, 'warn');
        }
      }

      // Write new hash with deterministic data
      fs.writeFileSync(cacheFile, JSON.stringify({
        hash: contentHash,
        // Use git commit instead of timestamp for deterministic builds
        commit: process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || 'local',
        buildId: process.env.BUILD_ID || 'local'
      }));

      if (previousHash === contentHash) {
        this.log('Content unchanged, cache can be reused');
        return true;
      } else {
        this.log('Content changed, cache invalidated');
        return false;
      }
    } catch (error) {
      this.log(`Cache optimization failed: ${error.message}`, 'error');
      return false;
    }
  }

  generateContentHash() {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');

    // Hash content directory
    if (fs.existsSync(this.contentDir)) {
      this.hashDirectory(this.contentDir, hash);
    }

    // Hash CMS configuration
    const configFile = path.join(process.cwd(), 'public', 'admin', 'config.yml');
    if (fs.existsSync(configFile)) {
      hash.update(fs.readFileSync(configFile));
    }

    return hash.digest('hex');
  }

  hashDirectory(dir, hash) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        this.hashDirectory(fullPath, hash);
      } else if (file.isFile()) {
        hash.update(file.name);
        hash.update(fs.readFileSync(fullPath));
      }
    }
  }

  async optimizeAssets() {
    this.log('Optimizing assets...');

    try {
      // Run media optimization if needed
      const mediaScript = path.join(process.cwd(), 'scripts', 'optimize-media.js');
      if (fs.existsSync(mediaScript)) {
        execSync('node scripts/optimize-media.js --build-optimization', { 
          stdio: 'inherit',
          timeout: 300000 // 5 minutes timeout
        });
        this.log('Media optimization completed');
      }

      // Clean up old build artifacts
      const outDir = path.join(process.cwd(), 'out');
      if (fs.existsSync(outDir)) {
        const stats = fs.statSync(outDir);
        const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
        
        if (ageInHours > 24) {
          this.log('Cleaning old build artifacts...');
          fs.rmSync(outDir, { recursive: true, force: true });
        }
      }

    } catch (error) {
      this.log(`Asset optimization failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async generateBuildReport() {
    const buildTime = Date.now() - this.startTime;
    const report = {
      buildTime: buildTime,
      // Use git commit for deterministic builds instead of timestamp
      commit: process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || 'local',
      environment: {
        ci: this.isCI,
        nodeVersion: process.version,
        buildId: process.env.BUILD_ID || 'local'
      },
      optimizations: {
        cacheUsed: fs.existsSync(path.join(this.cacheDir, 'content-hash.json')),
        mediaOptimized: fs.existsSync(path.join(process.cwd(), 'scripts', 'optimize-media.js'))
      }
    };

    const reportPath = path.join(process.cwd(), '.next', 'build-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Build completed in ${(buildTime / 1000).toFixed(2)}s`);
    this.log(`Build report saved to ${reportPath}`);
  }

  async run() {
    try {
      this.log('Starting build optimization...');

      // Check for content changes
      const hasContentChanges = await this.checkContentChanges();
      
      // Optimize cache
      await this.optimizeCache();
      
      // Optimize assets
      await this.optimizeAssets();
      
      // Generate build report
      await this.generateBuildReport();
      
      this.log('Build optimization completed successfully');
      
    } catch (error) {
      this.log(`Build optimization failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run optimization if called directly
if (require.main === module) {
  const optimizer = new BuildOptimizer();
  optimizer.run();
}

module.exports = { BuildOptimizer };