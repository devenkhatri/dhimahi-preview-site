#!/usr/bin/env node

/**
 * Build monitoring script for CMS integration
 * Monitors build performance and provides insights
 */

const fs = require('fs');
const path = require('path');

class BuildMonitor {
  constructor() {
    this.reportPath = path.join(process.cwd(), '.next', 'build-report.json');
    this.historyPath = path.join(process.cwd(), '.next', 'build-history.json');
  }

  loadReport() {
    if (!fs.existsSync(this.reportPath)) {
      throw new Error('Build report not found. Run a build first.');
    }

    return JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));
  }

  loadHistory() {
    if (!fs.existsSync(this.historyPath)) {
      return [];
    }

    try {
      return JSON.parse(fs.readFileSync(this.historyPath, 'utf8'));
    } catch (error) {
      console.warn('Could not load build history:', error.message);
      return [];
    }
  }

  saveHistory(history) {
    fs.writeFileSync(this.historyPath, JSON.stringify(history, null, 2));
  }

  addToHistory(report) {
    const history = this.loadHistory();
    
    // Add current report to history
    history.push({
      ...report,
      id: `${report.timestamp}-${report.environment.buildId || 'local'}`
    });

    // Keep only last 50 builds
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }

    this.saveHistory(history);
  }

  analyzePerformance() {
    const report = this.loadReport();
    const history = this.loadHistory();

    console.log('📊 Build Performance Analysis');
    console.log('================================');
    console.log('');

    // Current build info
    console.log('Current Build:');
    console.log(`  Time: ${(report.buildTime / 1000).toFixed(2)}s`);
    console.log(`  Environment: ${report.environment.ci ? 'CI' : 'Local'}`);
    console.log(`  Node Version: ${report.environment.nodeVersion}`);
    console.log(`  Cache Used: ${report.optimizations.cacheUsed ? 'Yes' : 'No'}`);
    console.log(`  Media Optimized: ${report.optimizations.mediaOptimized ? 'Yes' : 'No'}`);
    console.log('');

    if (history.length > 1) {
      // Performance trends
      const recentBuilds = history.slice(-10);
      const avgBuildTime = recentBuilds.reduce((sum, build) => sum + build.buildTime, 0) / recentBuilds.length;
      const fastestBuild = Math.min(...recentBuilds.map(b => b.buildTime));
      const slowestBuild = Math.max(...recentBuilds.map(b => b.buildTime));

      console.log('Performance Trends (Last 10 builds):');
      console.log(`  Average Time: ${(avgBuildTime / 1000).toFixed(2)}s`);
      console.log(`  Fastest: ${(fastestBuild / 1000).toFixed(2)}s`);
      console.log(`  Slowest: ${(slowestBuild / 1000).toFixed(2)}s`);
      console.log('');

      // Performance comparison
      const currentTime = report.buildTime;
      const improvement = ((avgBuildTime - currentTime) / avgBuildTime * 100);
      
      if (improvement > 5) {
        console.log(`🚀 Current build is ${improvement.toFixed(1)}% faster than average!`);
      } else if (improvement < -5) {
        console.log(`⚠️  Current build is ${Math.abs(improvement).toFixed(1)}% slower than average.`);
      } else {
        console.log(`✅ Current build time is within normal range.`);
      }
      console.log('');
    }

    // Optimization recommendations
    this.provideRecommendations(report, history);
  }

  provideRecommendations(report, history) {
    console.log('💡 Optimization Recommendations:');
    console.log('');

    const recommendations = [];

    // Cache recommendations
    if (!report.optimizations.cacheUsed) {
      recommendations.push('Enable build caching for faster subsequent builds');
    }

    // Media optimization recommendations
    if (!report.optimizations.mediaOptimized) {
      recommendations.push('Enable media optimization to reduce bundle size');
    }

    // Performance recommendations based on build time
    if (report.buildTime > 120000) { // > 2 minutes
      recommendations.push('Consider enabling incremental builds for large projects');
      recommendations.push('Review bundle size and consider code splitting');
    }

    // CI-specific recommendations
    if (report.environment.ci) {
      recommendations.push('Use Netlify build cache for faster CI builds');
      recommendations.push('Consider using build plugins for optimization');
    }

    if (recommendations.length === 0) {
      console.log('  ✅ Build is well optimized! No recommendations at this time.');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
    console.log('');
  }

  generateSummary() {
    const report = this.loadReport();
    
    console.log('📋 Build Summary');
    console.log('================');
    console.log('');
    console.log(`Build completed at: ${new Date(report.timestamp).toLocaleString()}`);
    console.log(`Total build time: ${(report.buildTime / 1000).toFixed(2)} seconds`);
    console.log(`Environment: ${report.environment.ci ? 'CI/CD' : 'Local Development'}`);
    console.log('');
    
    // Add to history
    this.addToHistory(report);
    
    console.log('✅ Build monitoring completed.');
  }

  run(command = 'summary') {
    try {
      switch (command) {
        case 'analyze':
          this.analyzePerformance();
          break;
        case 'summary':
        default:
          this.generateSummary();
          break;
      }
    } catch (error) {
      console.error('❌ Build monitoring failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2] || 'summary';
  const monitor = new BuildMonitor();
  monitor.run(command);
}

module.exports = { BuildMonitor };