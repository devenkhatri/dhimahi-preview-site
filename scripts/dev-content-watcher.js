#!/usr/bin/env node

const chokidar = require('chokidar');
const path = require('path');

// Watch content directory for changes
const contentDir = path.join(process.cwd(), 'content');

console.log('🔍 Watching content directory for changes...');

const watcher = chokidar.watch(contentDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('change', (filePath) => {
    console.log(`📝 Content file changed: ${path.relative(process.cwd(), filePath)}`);
    console.log('💡 Tip: Refresh your browser to see the changes');
  })
  .on('add', (filePath) => {
    console.log(`➕ Content file added: ${path.relative(process.cwd(), filePath)}`);
  })
  .on('unlink', (filePath) => {
    console.log(`🗑️  Content file removed: ${path.relative(process.cwd(), filePath)}`);
  })
  .on('error', (error) => {
    console.error('❌ Watcher error:', error);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping content watcher...');
  watcher.close();
  process.exit(0);
});