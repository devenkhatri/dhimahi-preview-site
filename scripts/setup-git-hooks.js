#!/usr/bin/env node

/**
 * Setup Git hooks for CMS content management
 * This script configures Git hooks to validate content and trigger builds
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOOKS_DIR = path.join(process.cwd(), '.git', 'hooks');
const SOURCE_HOOKS_DIR = path.join(process.cwd(), '.githooks');

function setupGitHooks() {
  console.log('🔧 Setting up Git hooks for CMS integration...');

  // Check if .git directory exists
  if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
    console.log('⚠️  Not a Git repository, skipping Git hooks setup.');
    return;
  }

  // Ensure hooks directory exists
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }

  // Copy hooks from .githooks to .git/hooks
  const hooks = ['pre-commit', 'post-commit'];
  
  hooks.forEach(hook => {
    const sourcePath = path.join(SOURCE_HOOKS_DIR, hook);
    const targetPath = path.join(HOOKS_DIR, hook);
    
    if (fs.existsSync(sourcePath)) {
      try {
        // Copy hook file
        fs.copyFileSync(sourcePath, targetPath);
        
        // Make executable (Unix systems)
        if (process.platform !== 'win32') {
          fs.chmodSync(targetPath, '755');
        }
        
        console.log(`✅ Installed ${hook} hook`);
      } catch (error) {
        console.error(`❌ Failed to install ${hook} hook:`, error.message);
      }
    } else {
      console.log(`⚠️  Source hook ${hook} not found, skipping.`);
    }
  });

  // Configure Git to use hooks
  try {
    execSync('git config core.hooksPath .git/hooks', { stdio: 'pipe' });
    console.log('✅ Git hooks path configured');
  } catch (error) {
    console.log('⚠️  Could not configure Git hooks path:', error.message);
  }

  console.log('🎉 Git hooks setup completed!');
  console.log('');
  console.log('Configured hooks:');
  console.log('  - pre-commit: Validates CMS content before commits');
  console.log('  - post-commit: Processes content changes after commits');
  console.log('');
  console.log('To manually trigger validation: npm run validate:content');
}

// Run setup if called directly
if (require.main === module) {
  setupGitHooks();
}

module.exports = { setupGitHooks };