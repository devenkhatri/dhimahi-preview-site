#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning development environment...');

// Clean build artifacts
const cleanPaths = ['.next', 'out', 'node_modules/.cache'];
cleanPaths.forEach(cleanPath => {
  if (fs.existsSync(cleanPath)) {
    console.log(`Removing ${cleanPath}...`);
    execSync(`rm -rf ${cleanPath}`, { stdio: 'inherit' });
  }
});

// Ensure content directory exists
const contentDir = path.join(process.cwd(), 'content');
if (!fs.existsSync(contentDir)) {
  console.log('Creating content directory...');
  fs.mkdirSync(contentDir, { recursive: true });
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('✅ Development environment ready!');
console.log('🚀 Starting Next.js development server with content watching...');

// Start development server with content watching
const { spawn } = require('child_process');

// Start Next.js dev server
const nextProcess = spawn('next', ['dev'], { 
  stdio: ['inherit', 'inherit', 'inherit'],
  shell: true 
});

// Start content watcher if chokidar is available
try {
  const chokidar = require('chokidar');
  
  console.log('🔍 Starting content file watcher...');
  
  const contentWatcher = chokidar.watch('content/**/*.{yml,yaml,md}', {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true
  });

  contentWatcher
    .on('change', (filePath) => {
      console.log(`\n📝 Content file changed: ${filePath}`);
      console.log('💡 Refresh your browser to see the changes\n');
    })
    .on('add', (filePath) => {
      console.log(`\n➕ Content file added: ${filePath}\n`);
    })
    .on('unlink', (filePath) => {
      console.log(`\n🗑️  Content file removed: ${filePath}\n`);
    });

  // Cleanup on exit
  const cleanup = () => {
    console.log('\n👋 Shutting down...');
    try {
      contentWatcher.close();
    } catch (e) {
      // Ignore cleanup errors
    }
    try {
      nextProcess.kill('SIGINT');
    } catch (e) {
      // Ignore cleanup errors
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

} catch (error) {
  console.log('⚠️  Content watcher not available');
  console.log('💡 Content changes will require manual browser refresh');
}

// Handle Next.js process exit
nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});