#!/usr/bin/env node

/**
 * Media optimization script for Decap CMS
 * Optimizes images in the uploads folder and generates responsive variants
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];
const QUALITY_SETTINGS = {
  high: 90,
  medium: 75,
  low: 60
};

const RESPONSIVE_BREAKPOINTS = [640, 768, 1024, 1280, 1536, 1920];

/**
 * Check if sharp is available for image processing
 */
function checkSharpAvailability() {
  try {
    require.resolve('sharp');
    return true;
  } catch (error) {
    console.warn('Sharp not available. Install with: npm install sharp');
    return false;
  }
}

/**
 * Get all image files in uploads directory
 */
async function getImageFiles(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await getImageFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_FORMATS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Get image metadata
 */
async function getImageMetadata(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const relativePath = path.relative(UPLOADS_DIR, filePath);
    const category = relativePath.split(path.sep)[0] || 'general';
    
    return {
      path: filePath,
      relativePath,
      category,
      size: stats.size,
      lastModified: stats.mtime,
      extension: path.extname(filePath).toLowerCase()
    };
  } catch (error) {
    console.error(`Error getting metadata for ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Optimize image using sharp (if available)
 */
async function optimizeWithSharp(inputPath, outputPath, options = {}) {
  const sharp = require('sharp');
  const { width, height, quality = 85, format } = options;
  
  let pipeline = sharp(inputPath);
  
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality });
  } else if (format === 'avif') {
    pipeline = pipeline.avif({ quality });
  } else if (format === 'jpeg' || format === 'jpg') {
    pipeline = pipeline.jpeg({ quality, progressive: true });
  } else if (format === 'png') {
    pipeline = pipeline.png({ quality, progressive: true });
  }
  
  await pipeline.toFile(outputPath);
}

/**
 * Generate responsive variants for an image
 */
async function generateResponsiveVariants(imagePath, metadata) {
  if (!checkSharpAvailability()) {
    console.log(`Skipping responsive variants for ${metadata.relativePath} (Sharp not available)`);
    return [];
  }
  
  const sharp = require('sharp');
  const variants = [];
  
  try {
    // Get original dimensions
    const imageInfo = await sharp(imagePath).metadata();
    const originalWidth = imageInfo.width;
    const originalHeight = imageInfo.height;
    
    if (!originalWidth || !originalHeight) {
      console.warn(`Could not get dimensions for ${metadata.relativePath}`);
      return variants;
    }
    
    const baseName = path.basename(imagePath, metadata.extension);
    const dirName = path.dirname(imagePath);
    
    // Generate WebP variants
    for (const breakpoint of RESPONSIVE_BREAKPOINTS) {
      if (breakpoint >= originalWidth) continue;
      
      const outputPath = path.join(dirName, `${baseName}-${breakpoint}w.webp`);
      
      try {
        await optimizeWithSharp(imagePath, outputPath, {
          width: breakpoint,
          quality: QUALITY_SETTINGS.medium,
          format: 'webp'
        });
        
        variants.push({
          path: outputPath,
          width: breakpoint,
          format: 'webp'
        });
        
        console.log(`Generated WebP variant: ${path.relative(UPLOADS_DIR, outputPath)}`);
      } catch (error) {
        console.error(`Failed to generate WebP variant for ${breakpoint}w:`, error.message);
      }
    }
    
    // Generate AVIF variant for the original size (if not too large)
    if (originalWidth <= 1920) {
      const avifPath = path.join(dirName, `${baseName}.avif`);
      
      try {
        await optimizeWithSharp(imagePath, avifPath, {
          quality: QUALITY_SETTINGS.medium,
          format: 'avif'
        });
        
        variants.push({
          path: avifPath,
          width: originalWidth,
          format: 'avif'
        });
        
        console.log(`Generated AVIF variant: ${path.relative(UPLOADS_DIR, avifPath)}`);
      } catch (error) {
        console.error(`Failed to generate AVIF variant:`, error.message);
      }
    }
    
  } catch (error) {
    console.error(`Error processing ${metadata.relativePath}:`, error.message);
  }
  
  return variants;
}

/**
 * Validate image files
 */
async function validateImages(imageFiles) {
  const issues = [];
  
  for (const filePath of imageFiles) {
    const metadata = await getImageMetadata(filePath);
    if (!metadata) continue;
    
    // Check file size (warn if > 2MB)
    const sizeMB = metadata.size / (1024 * 1024);
    if (sizeMB > 2) {
      issues.push({
        type: 'large-file',
        path: metadata.relativePath,
        size: sizeMB.toFixed(2) + 'MB',
        suggestion: 'Consider compressing this image'
      });
    }
    
    // Check filename
    const filename = path.basename(filePath);
    if (filename.length > 100) {
      issues.push({
        type: 'long-filename',
        path: metadata.relativePath,
        suggestion: 'Use shorter, descriptive filenames'
      });
    }
    
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      issues.push({
        type: 'invalid-characters',
        path: metadata.relativePath,
        suggestion: 'Use only letters, numbers, dots, hyphens, and underscores in filenames'
      });
    }
  }
  
  return issues;
}

/**
 * Generate media manifest
 */
async function generateMediaManifest(imageFiles) {
  const manifest = {
    generated: new Date().toISOString(),
    totalFiles: imageFiles.length,
    categories: {},
    files: []
  };
  
  for (const filePath of imageFiles) {
    const metadata = await getImageMetadata(filePath);
    if (!metadata) continue;
    
    // Update category stats
    if (!manifest.categories[metadata.category]) {
      manifest.categories[metadata.category] = {
        count: 0,
        totalSize: 0
      };
    }
    
    manifest.categories[metadata.category].count++;
    manifest.categories[metadata.category].totalSize += metadata.size;
    
    // Add file info
    manifest.files.push({
      path: metadata.relativePath,
      category: metadata.category,
      size: metadata.size,
      lastModified: metadata.lastModified,
      extension: metadata.extension
    });
  }
  
  // Write manifest file
  const manifestPath = path.join(UPLOADS_DIR, 'media-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`Generated media manifest: ${manifestPath}`);
  return manifest;
}

/**
 * Main optimization function
 */
async function optimizeMedia() {
  console.log('Starting media optimization...');
  
  try {
    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    
    // Get all image files
    const imageFiles = await getImageFiles(UPLOADS_DIR);
    console.log(`Found ${imageFiles.length} image files`);
    
    if (imageFiles.length === 0) {
      console.log('No images to optimize');
      return;
    }
    
    // Validate images
    const issues = await validateImages(imageFiles);
    if (issues.length > 0) {
      console.log('\nValidation Issues:');
      issues.forEach(issue => {
        console.log(`- ${issue.type}: ${issue.path} - ${issue.suggestion}`);
      });
    }
    
    // Generate responsive variants (if Sharp is available)
    if (checkSharpAvailability()) {
      console.log('\nGenerating responsive variants...');
      
      for (const filePath of imageFiles) {
        const metadata = await getImageMetadata(filePath);
        if (metadata) {
          await generateResponsiveVariants(filePath, metadata);
        }
      }
    }
    
    // Generate manifest
    const manifest = await generateMediaManifest(imageFiles);
    
    console.log('\nOptimization Summary:');
    console.log(`- Total files: ${manifest.totalFiles}`);
    console.log(`- Categories: ${Object.keys(manifest.categories).join(', ')}`);
    
    Object.entries(manifest.categories).forEach(([category, stats]) => {
      const sizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
      console.log(`  - ${category}: ${stats.count} files (${sizeMB}MB)`);
    });
    
    if (issues.length > 0) {
      console.log(`- Issues found: ${issues.length}`);
    }
    
    console.log('\nMedia optimization complete!');
    
  } catch (error) {
    console.error('Media optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeMedia();
}

module.exports = {
  optimizeMedia,
  getImageFiles,
  validateImages,
  generateMediaManifest
};