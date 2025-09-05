#!/usr/bin/env node

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * Validation script for CMS content files
 * Ensures content files match the expected schema structure
 */

function validateGlobalSettings() {
  console.log('🔍 Validating global settings...');
  
  try {
    const content = yaml.load(fs.readFileSync('content/settings/general.yml', 'utf8'));
    
    // Required fields validation
    const requiredFields = ['siteTitle', 'siteDescription', 'contactEmail', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !content[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(content.contactEmail)) {
      throw new Error('Invalid email format in contactEmail');
    }
    
    // Social media validation
    if (content.socialMedia) {
      const socialFields = ['linkedin', 'twitter', 'facebook'];
      socialFields.forEach(field => {
        if (content.socialMedia[field] && content.socialMedia[field].length > 0) {
          if (!content.socialMedia[field].startsWith('https://')) {
            console.warn(`⚠️  Warning: ${field} URL should start with https://`);
          }
        }
      });
    }
    
    console.log('✅ Global settings validation passed');
    return true;
  } catch (error) {
    console.error('❌ Global settings validation failed:', error.message);
    return false;
  }
}

function validateHomepage() {
  console.log('🔍 Validating homepage content...');
  
  try {
    const content = yaml.load(fs.readFileSync('content/pages/homepage.yml', 'utf8'));
    
    // Hero section validation
    if (!content.hero) {
      throw new Error('Missing hero section');
    }
    
    const heroRequired = ['mainHeadline', 'subheadline', 'trustBadge', 'statistics', 'ctaButton'];
    const missingHeroFields = heroRequired.filter(field => !content.hero[field]);
    if (missingHeroFields.length > 0) {
      throw new Error(`Missing hero fields: ${missingHeroFields.join(', ')}`);
    }
    
    // Statistics validation
    if (!Array.isArray(content.hero.statistics) || content.hero.statistics.length < 2) {
      throw new Error('Hero statistics must be an array with at least 2 items');
    }
    
    content.hero.statistics.forEach((stat, index) => {
      if (!stat.value || !stat.suffix || !stat.label) {
        throw new Error(`Statistics item ${index + 1} is missing required fields`);
      }
    });
    
    // Services overview validation
    if (!content.servicesOverview) {
      throw new Error('Missing servicesOverview section');
    }
    
    if (!Array.isArray(content.servicesOverview.featuredServices) || 
        content.servicesOverview.featuredServices.length !== 3) {
      throw new Error('Featured services must be an array with exactly 3 items');
    }
    
    // Testimonials validation
    if (!Array.isArray(content.testimonials) || content.testimonials.length < 2) {
      throw new Error('Testimonials must be an array with at least 2 items');
    }
    
    content.testimonials.forEach((testimonial, index) => {
      const required = ['clientName', 'company', 'testimonial', 'rating'];
      const missing = required.filter(field => !testimonial[field]);
      if (missing.length > 0) {
        throw new Error(`Testimonial ${index + 1} missing fields: ${missing.join(', ')}`);
      }
      
      if (testimonial.rating < 1 || testimonial.rating > 5) {
        throw new Error(`Testimonial ${index + 1} rating must be between 1 and 5`);
      }
    });
    
    console.log('✅ Homepage content validation passed');
    return true;
  } catch (error) {
    console.error('❌ Homepage content validation failed:', error.message);
    return false;
  }
}

function validateCMSConfig() {
  console.log('🔍 Validating CMS configuration...');
  
  try {
    const config = yaml.load(fs.readFileSync('public/admin/config.yml', 'utf8'));
    
    // Check required top-level fields
    if (!config.backend || !config.collections) {
      throw new Error('Missing required CMS configuration fields');
    }
    
    // Check collections
    const requiredCollections = ['settings', 'homepage'];
    const collectionNames = config.collections.map(c => c.name);
    const missingCollections = requiredCollections.filter(name => !collectionNames.includes(name));
    
    if (missingCollections.length > 0) {
      throw new Error(`Missing required collections: ${missingCollections.join(', ')}`);
    }
    
    console.log('✅ CMS configuration validation passed');
    return true;
  } catch (error) {
    console.error('❌ CMS configuration validation failed:', error.message);
    return false;
  }
}

// Run all validations
console.log('🚀 Starting CMS content validation...\n');

const results = [
  validateCMSConfig(),
  validateGlobalSettings(),
  validateHomepage()
];

const allPassed = results.every(result => result === true);

console.log('\n📊 Validation Summary:');
console.log(`✅ Passed: ${results.filter(r => r).length}`);
console.log(`❌ Failed: ${results.filter(r => !r).length}`);

if (allPassed) {
  console.log('\n🎉 All validations passed! CMS content is ready.');
  process.exit(0);
} else {
  console.log('\n💥 Some validations failed. Please fix the issues above.');
  process.exit(1);
}