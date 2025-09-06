#!/usr/bin/env node

/**
 * Disable Git hooks that cause build artifacts to change
 * Use this during development to prevent unnecessary builds
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(process.cwd(), '.git', 'hooks');

function disableGitHooks() {
  console.log('🔧 Disabling Git hooks to prevent build artifact changes...');

  if (!fs.existsSync(HOOKS_DIR)) {
    console.log('⚠️  Git hooks directory not found.');
    return;
  }

  const hooks = ['pre-commit', 'post-commit'];
  
  hooks.forEach(hook => {
    const hookPath = path.join(HOOKS_DIR, hook);
    const disabledPath = path.join(HOOKS_DIR, `${hook}.disabled`);
    
    if (fs.existsSync(hookPath)) {
      try {
        // Rename hook to disable it
        fs.renameSync(hookPath, disabledPath);
        console.log(`✅ Disabled ${hook} hook`);
      } catch (error) {
        console.error(`❌ Failed to disable ${hook} hook:`, error.message);
      }
    } else {
      console.log(`ℹ️  ${hook} hook not found or already disabled`);
    }
  });

  console.log('🎉 Git hooks disabled!');
  console.log('');
  console.log('To re-enable hooks, run: npm run setup:hooks');
}

function enableGitHooks() {
  console.log('🔧 Re-enabling Git hooks...');

  if (!fs.existsSync(HOOKS_DIR)) {
    console.log('⚠️  Git hooks directory not found.');
    return;
  }

  const hooks = ['pre-commit', 'post-commit'];
  
  hooks.forEach(hook => {
    const hookPath = path.join(HOOKS_DIR, hook);
    const disabledPath = path.join(HOOKS_DIR, `${hook}.disabled`);
    
    if (fs.existsSync(disabledPath)) {
      try {
        // Rename disabled hook back to active
        fs.renameSync(disabledPath, hookPath);
        
        // Make executable (Unix systems)
        if (process.platform !== 'win32') {
          fs.chmodSync(hookPath, '755');
        }
        
        console.log(`✅ Enabled ${hook} hook`);
      } catch (error) {
        console.error(`❌ Failed to enable ${hook} hook:`, error.message);
      }
    } else {
      console.log(`ℹ️  ${hook} hook not found in disabled state`);
    }
  });

  console.log('🎉 Git hooks re-enabled!');
}

// Check command line arguments
const command = process.argv[2];

if (command === 'enable') {
  enableGitHooks();
} else if (command === 'disable') {
  disableGitHooks();
} else {
  // Default to disable for development
  disableGitHooks();
}

module.exports = { disableGitHooks, enableGitHooks };