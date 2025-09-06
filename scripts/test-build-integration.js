#!/usr/bin/env node

/**
 * Test script for build process integration
 * Validates that all build optimization features work correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildIntegrationTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, level = 'info') {
    const prefix = level === 'error' ? '❌' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  test(name, testFn) {
    try {
      this.log(`Testing: ${name}...`);
      testFn();
      this.testResults.passed++;
      this.testResults.tests.push({ name, status: 'passed' });
      this.log(`${name} - PASSED`, 'success');
    } catch (error) {
      this.testResults.failed++;
      this.testResults.tests.push({ name, status: 'failed', error: error.message });
      this.log(`${name} - FAILED: ${error.message}`, 'error');
    }
  }

  testNextConfigUpdates() {
    const configPath = path.join(process.cwd(), 'next.config.mjs');
    const config = fs.readFileSync(configPath, 'utf8');
    
    if (!config.includes('CMS_CONTENT_PATH')) {
      throw new Error('CMS_CONTENT_PATH environment variable not found in next.config.mjs');
    }
    
    if (!config.includes('ContentValidation')) {
      throw new Error('Content validation plugin not found in webpack config');
    }
    
    if (!config.includes('@/content')) {
      throw new Error('Content alias not configured in webpack');
    }
  }

  testGitHooksSetup() {
    const preCommitPath = path.join(process.cwd(), '.githooks', 'pre-commit');
    const postCommitPath = path.join(process.cwd(), '.githooks', 'post-commit');
    
    if (!fs.existsSync(preCommitPath)) {
      throw new Error('Pre-commit hook file not found');
    }
    
    if (!fs.existsSync(postCommitPath)) {
      throw new Error('Post-commit hook file not found');
    }
    
    // Check if hooks are executable
    const preCommitStats = fs.statSync(preCommitPath);
    const postCommitStats = fs.statSync(postCommitPath);
    
    if (!(preCommitStats.mode & parseInt('100', 8))) {
      throw new Error('Pre-commit hook is not executable');
    }
    
    if (!(postCommitStats.mode & parseInt('100', 8))) {
      throw new Error('Post-commit hook is not executable');
    }
  }

  testNetlifyConfiguration() {
    const netlifyPath = path.join(process.cwd(), 'netlify.toml');
    const config = fs.readFileSync(netlifyPath, 'utf8');
    
    if (!config.includes('cms:build')) {
      throw new Error('CMS build command not configured in netlify.toml');
    }
    
    if (!config.includes('CMS_CONTENT_PATH')) {
      throw new Error('CMS environment variables not configured');
    }
    
    if (!config.includes('build.ignore')) {
      throw new Error('Build ignore rules not configured');
    }
  }

  testBuildScripts() {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredScripts = [
      'cms:build',
      'cms:build:fast',
      'build:optimized',
      'setup:hooks',
      'build:monitor',
      'build:analyze'
    ];
    
    requiredScripts.forEach(script => {
      if (!packageJson.scripts[script]) {
        throw new Error(`Required script '${script}' not found in package.json`);
      }
    });
  }

  testBuildOptimizationScript() {
    const scriptPath = path.join(process.cwd(), 'scripts', 'build-optimization.js');
    
    if (!fs.existsSync(scriptPath)) {
      throw new Error('Build optimization script not found');
    }
    
    // Test that the script can be required without errors
    try {
      require(scriptPath);
    } catch (error) {
      throw new Error(`Build optimization script has syntax errors: ${error.message}`);
    }
  }

  testBuildMonitorScript() {
    const scriptPath = path.join(process.cwd(), 'scripts', 'build-monitor.js');
    
    if (!fs.existsSync(scriptPath)) {
      throw new Error('Build monitor script not found');
    }
    
    // Test that the script can be required without errors
    try {
      require(scriptPath);
    } catch (error) {
      throw new Error(`Build monitor script has syntax errors: ${error.message}`);
    }
  }

  testBuildConfigFile() {
    const configPath = path.join(process.cwd(), 'build.config.js');
    
    if (!fs.existsSync(configPath)) {
      throw new Error('Build configuration file not found');
    }
    
    try {
      const config = require(configPath);
      
      if (!config.buildConfig) {
        throw new Error('buildConfig export not found');
      }
      
      if (!config.getConfig) {
        throw new Error('getConfig function not found');
      }
      
      // Test configuration loading
      const devConfig = config.getConfig('development');
      const prodConfig = config.getConfig('production');
      
      if (!devConfig.paths || !prodConfig.paths) {
        throw new Error('Configuration paths not properly defined');
      }
      
    } catch (error) {
      throw new Error(`Build config file error: ${error.message}`);
    }
  }

  testContentValidationIntegration() {
    const scriptPath = path.join(process.cwd(), 'scripts', 'validate-cms-build.js');
    const script = fs.readFileSync(scriptPath, 'utf8');
    
    if (!script.includes('--ci')) {
      throw new Error('CI flag support not found in validation script');
    }
    
    if (!script.includes('--build')) {
      throw new Error('Build flag support not found in validation script');
    }
    
    if (!script.includes('--pre-commit')) {
      throw new Error('Pre-commit flag support not found in validation script');
    }
  }

  testDirectoryStructure() {
    const requiredDirs = [
      '.githooks',
      'scripts',
      'content',
      'public/admin'
    ];
    
    requiredDirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`Required directory '${dir}' not found`);
      }
    });
  }

  async runAllTests() {
    this.log('🧪 Starting Build Integration Tests...\n');

    this.test('Next.js Configuration Updates', () => this.testNextConfigUpdates());
    this.test('Git Hooks Setup', () => this.testGitHooksSetup());
    this.test('Netlify Configuration', () => this.testNetlifyConfiguration());
    this.test('Build Scripts Configuration', () => this.testBuildScripts());
    this.test('Build Optimization Script', () => this.testBuildOptimizationScript());
    this.test('Build Monitor Script', () => this.testBuildMonitorScript());
    this.test('Build Configuration File', () => this.testBuildConfigFile());
    this.test('Content Validation Integration', () => this.testContentValidationIntegration());
    this.test('Directory Structure', () => this.testDirectoryStructure());

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('🧪 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total tests: ${this.testResults.passed + this.testResults.failed}`);
    console.log(`Passed: ${this.testResults.passed}`);
    console.log(`Failed: ${this.testResults.failed}`);
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ SOME TESTS FAILED');
      console.log('Failed tests:');
      this.testResults.tests
        .filter(test => test.status === 'failed')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
      process.exit(1);
    } else {
      console.log('\n✅ ALL TESTS PASSED');
      console.log('Build integration is properly configured!');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new BuildIntegrationTest();
  tester.runAllTests();
}

module.exports = { BuildIntegrationTest };