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
console.log('🚀 Starting Next.js development server...');

// Start development server
execSync('next dev', { stdio: 'inherit' });