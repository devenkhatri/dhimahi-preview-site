#!/usr/bin/env node

/**
 * Build-time validation script for CMS content
 * This script validates all CMS content before build to catch errors early
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yaml = require('js-yaml');

// Content directories
const contentDir = path.join(process.cwd(), 'content');
const pagesDir = path.join(contentDir, 'pages');
const servicesDir = path.join(contentDir, 'services');
const caseStudiesDir = path.join(contentDir, 'case-studies');
const insightsDir = path.join(contentDir, 'insights');

// Validation results
let validationResults = {
  errors: [],
  warnings: [],
  totalFiles: 0,
  validFiles: 0
};

// Utility functions
function logError(file, message) {
  validationResults.errors.push({ file, message });
  console.error(`❌ ERROR in ${file}: ${message}`);
}

function logWarning(file, message) {
  validationResults.warnings.push({ file, message });
  console.warn(`⚠️  WARNING in ${file}: ${message}`);
}

function logSuccess(file) {
  validationResults.validFiles++;
  console.log(`✅ ${file} - Valid`);
}

// Validation functions
function validateRequiredField(data, field, file) {
  if (!data || !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
    logError(file, `Missing required field: ${field}`);
    return false;
  }
  return true;
}

function validateArray(data, field, file, minLength = 0) {
  if (!data || !Array.isArray(data[field])) {
    logError(file, `Field ${field} must be an array`);
    return false;
  }
  if (data[field].length < minLength) {
    logError(file, `Field ${field} must have at least ${minLength} items`);
    return false;
  }
  return true;
}

function validateDate(dateString, file, field) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    logError(file, `Invalid date format in field: ${field}`);
    return false;
  }
  return true;
}

// Content type validators
function validateHomepage(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const data = yaml.load(content);
    
    let isValid = true;
    
    // Validate hero section
    if (!data.hero) {
      logError(file, 'Missing hero section');
      isValid = false;
    } else {
      isValid &= validateRequiredField(data.hero, 'mainHeadline', file);
      isValid &= validateRequiredField(data.hero, 'subheadline', file);
      isValid &= validateArray(data.hero, 'statistics', file, 1);
    }
    
    // Validate services overview
    if (!data.servicesOverview) {
      logError(file, 'Missing servicesOverview section');
      isValid = false;
    } else {
      isValid &= validateRequiredField(data.servicesOverview, 'title', file);
    }
    
    return isValid;
  } catch (error) {
    logError(file, `Parse error: ${error.message}`);
    return false;
  }
}

function validateService(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const { data } = matter(content);
    
    let isValid = true;
    
    isValid &= validateRequiredField(data, 'title', file);
    isValid &= validateRequiredField(data, 'icon', file);
    isValid &= validateRequiredField(data, 'excerpt', file);
    isValid &= validateRequiredField(data, 'timeline', file);
    isValid &= validateArray(data, 'features', file, 1);
    
    if (data.order && typeof data.order !== 'number') {
      logError(file, 'Order field must be a number');
      isValid = false;
    }
    
    return isValid;
  } catch (error) {
    logError(file, `Parse error: ${error.message}`);
    return false;
  }
}

function validateCaseStudy(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const { data } = matter(content);
    
    let isValid = true;
    
    isValid &= validateRequiredField(data, 'title', file);
    isValid &= validateRequiredField(data, 'excerpt', file);
    isValid &= validateRequiredField(data, 'category', file);
    
    if (data.publishDate && !validateDate(data.publishDate, file, 'publishDate')) {
      isValid = false;
    }
    
    if (!data.client || typeof data.client !== 'object') {
      logError(file, 'Missing or invalid client information');
      isValid = false;
    } else {
      isValid &= validateRequiredField(data.client, 'name', file);
      isValid &= validateRequiredField(data.client, 'industry', file);
    }
    
    return isValid;
  } catch (error) {
    logError(file, `Parse error: ${error.message}`);
    return false;
  }
}

function validateInsight(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const { data } = matter(content);
    
    let isValid = true;
    
    isValid &= validateRequiredField(data, 'title', file);
    isValid &= validateRequiredField(data, 'excerpt', file);
    isValid &= validateRequiredField(data, 'author', file);
    isValid &= validateRequiredField(data, 'category', file);
    
    if (data.publishDate && !validateDate(data.publishDate, file, 'publishDate')) {
      isValid = false;
    }
    
    if (data.tags && !Array.isArray(data.tags)) {
      logError(file, 'Tags field must be an array');
      isValid = false;
    }
    
    return isValid;
  } catch (error) {
    logError(file, `Parse error: ${error.message}`);
    return false;
  }
}

// Directory validation functions
function validateDirectory(dir, validator, fileExtension = '.md') {
  if (!fs.existsSync(dir)) {
    logWarning('Directory', `${dir} does not exist`);
    return;
  }
  
  const files = fs.readdirSync(dir).filter(file => file.endsWith(fileExtension));
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    validationResults.totalFiles++;
    
    if (validator(filePath)) {
      logSuccess(file);
    }
  });
}

// Main validation function
function validateAllContent() {
  console.log('🔍 Starting CMS content validation...\n');
  
  // Validate homepage
  const homepageFile = path.join(pagesDir, 'homepage.yml');
  if (fs.existsSync(homepageFile)) {
    validationResults.totalFiles++;
    if (validateHomepage(homepageFile)) {
      logSuccess('homepage.yml');
    }
  } else {
    logWarning('homepage.yml', 'File does not exist');
  }
  
  // Validate services
  console.log('\n📋 Validating services...');
  validateDirectory(servicesDir, validateService);
  
  // Validate case studies
  console.log('\n📊 Validating case studies...');
  validateDirectory(caseStudiesDir, validateCaseStudy);
  
  // Validate insights
  console.log('\n📝 Validating insights...');
  validateDirectory(insightsDir, validateInsight);
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 VALIDATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total files checked: ${validationResults.totalFiles}`);
  console.log(`Valid files: ${validationResults.validFiles}`);
  console.log(`Errors: ${validationResults.errors.length}`);
  console.log(`Warnings: ${validationResults.warnings.length}`);
  
  if (validationResults.errors.length > 0) {
    console.log('\n❌ VALIDATION FAILED');
    console.log('Please fix the errors above before building.');
    process.exit(1);
  } else if (validationResults.warnings.length > 0) {
    console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS');
    console.log('Consider addressing the warnings above.');
  } else {
    console.log('\n✅ ALL VALIDATIONS PASSED');
  }
}

// Run validation if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const isCI = args.includes('--ci');
  const isBuild = args.includes('--build');
  const isPreCommit = args.includes('--pre-commit');
  
  // Set appropriate logging level based on context
  if (isCI || isBuild) {
    // Reduce verbosity for CI/build environments
    const originalLog = console.log;
    console.log = (...args) => {
      if (!args[0] || !args[0].includes('✅')) {
        originalLog(...args);
      }
    };
  }
  
  if (isPreCommit) {
    console.log('🔍 Pre-commit content validation...');
  } else if (isBuild) {
    console.log('🔍 Build-time content validation...');
  }
  
  validateAllContent();
}

module.exports = { validateAllContent, validationResults };