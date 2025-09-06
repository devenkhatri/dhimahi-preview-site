#!/usr/bin/env node

/**
 * Validate Open Graph image for social media sharing
 */

const fs = require('fs');
const path = require('path');

function validateOGImage() {
  console.log('🖼️  Validating Open Graph image...');
  
  const ogImagePath = path.join(process.cwd(), 'public', 'og-image.png');
  
  if (!fs.existsSync(ogImagePath)) {
    console.error('❌ og-image.png not found in public directory');
    console.log('💡 Create an image with dimensions 1200x630px for optimal social sharing');
    return false;
  }
  
  const stats = fs.statSync(ogImagePath);
  const fileSizeKB = Math.round(stats.size / 1024);
  
  console.log(`✅ og-image.png found`);
  console.log(`📏 File size: ${fileSizeKB}KB`);
  
  if (fileSizeKB > 1000) {
    console.warn('⚠️  Image is quite large (>1MB). Consider optimizing for faster loading.');
  } else if (fileSizeKB > 500) {
    console.log('📊 Image size is acceptable but could be optimized further.');
  } else {
    console.log('✅ Image size is optimal for web sharing.');
  }
  
  console.log('');
  console.log('📋 Open Graph Image Requirements:');
  console.log('   • Dimensions: 1200x630px (recommended)');
  console.log('   • Format: PNG or JPG');
  console.log('   • File size: <1MB (preferably <500KB)');
  console.log('   • Content: Company logo, name, and tagline');
  console.log('');
  console.log('🔗 Test your sharing cards at:');
  console.log('   • Facebook: https://developers.facebook.com/tools/debug/');
  console.log('   • Twitter: https://cards-dev.twitter.com/validator');
  console.log('   • LinkedIn: https://www.linkedin.com/post-inspector/');
  
  return true;
}

// Run validation if called directly
if (require.main === module) {
  validateOGImage();
}

module.exports = { validateOGImage };