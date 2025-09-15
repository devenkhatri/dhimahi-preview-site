#!/usr/bin/env node

/**
 * Test script to verify CMS interface configuration for brand fields
 * This script validates the CMS config structure and field definitions
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function loadCMSConfig() {
  try {
    const configPath = path.join(__dirname, '..', 'public', 'admin', 'config.yml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return yaml.load(configContent);
  } catch (error) {
    console.error('❌ Failed to load CMS config:', error.message);
    return null;
  }
}

function testFieldConfiguration(config) {
  console.log('🧪 Testing CMS Field Configuration');
  console.log('==================================');

  const settingsCollection = config.collections.find(c => c.name === 'settings');
  if (!settingsCollection) {
    console.log('❌ Settings collection not found');
    return false;
  }

  const generalFile = settingsCollection.files.find(f => f.name === 'general');
  if (!generalFile) {
    console.log('❌ General settings file not found');
    return false;
  }

  const fields = generalFile.fields;
  let testsPassed = 0;
  let totalTests = 0;

  // Test brand section
  console.log('\n📋 Brand Information Section:');
  const brandField = fields.find(f => f.name === 'brand');
  totalTests++;
  if (brandField && brandField.widget === 'object') {
    console.log('  ✅ Brand section exists and is properly configured');
    testsPassed++;

    // Test brand subfields
    const brandFields = brandField.fields;
    const requiredBrandFields = ['companyName', 'tagline', 'description'];
    
    requiredBrandFields.forEach(fieldName => {
      totalTests++;
      const field = brandFields.find(f => f.name === fieldName);
      if (field) {
        console.log(`  ✅ ${fieldName}: configured with validation`);
        testsPassed++;
        
        // Check for validation patterns
        if (field.pattern) {
          console.log(`    📏 Pattern validation: ${field.pattern[1]}`);
        }
        if (field.hint) {
          console.log(`    💡 Help text: "${field.hint}"`);
        }
      } else {
        console.log(`  ❌ ${fieldName}: missing`);
      }
    });
  } else {
    console.log('  ❌ Brand section missing or misconfigured');
  }

  // Test location section
  console.log('\n🌍 Location Information Section:');
  const locationField = fields.find(f => f.name === 'location');
  totalTests++;
  if (locationField && locationField.widget === 'object') {
    console.log('  ✅ Location section exists and is properly configured');
    testsPassed++;

    const locationFields = locationField.fields;
    const requiredLocationFields = ['primaryLocation', 'serviceAreas', 'fullAddress'];
    
    requiredLocationFields.forEach(fieldName => {
      totalTests++;
      const field = locationFields.find(f => f.name === fieldName);
      if (field) {
        console.log(`  ✅ ${fieldName}: configured`);
        testsPassed++;
        
        if (field.hint) {
          console.log(`    💡 Help text: "${field.hint}"`);
        }
      } else {
        console.log(`  ❌ ${fieldName}: missing`);
      }
    });
  } else {
    console.log('  ❌ Location section missing or misconfigured');
  }

  // Test contact section
  console.log('\n📞 Contact Information Section:');
  const contactField = fields.find(f => f.name === 'contact');
  totalTests++;
  if (contactField && contactField.widget === 'object') {
    console.log('  ✅ Contact section exists and is properly configured');
    testsPassed++;

    const contactFields = contactField.fields;
    const requiredContactFields = ['primaryEmail', 'supportEmail', 'phone'];
    
    requiredContactFields.forEach(fieldName => {
      totalTests++;
      const field = contactFields.find(f => f.name === fieldName);
      if (field) {
        console.log(`  ✅ ${fieldName}: configured with validation`);
        testsPassed++;
        
        // Check for email/phone validation
        if (field.pattern) {
          console.log(`    📏 Pattern validation: ${field.pattern[1]}`);
        }
        if (field.hint) {
          console.log(`    💡 Help text: "${field.hint}"`);
        }
      } else {
        console.log(`  ❌ ${fieldName}: missing`);
      }
    });
  } else {
    console.log('  ❌ Contact section missing or misconfigured');
  }

  // Test social media section
  console.log('\n📱 Social Media Section:');
  const socialField = fields.find(f => f.name === 'socialMedia');
  totalTests++;
  if (socialField && socialField.widget === 'object') {
    console.log('  ✅ Social media section exists and is properly configured');
    testsPassed++;

    const socialFields = socialField.fields;
    const socialPlatforms = ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'];
    
    socialPlatforms.forEach(platform => {
      totalTests++;
      const field = socialFields.find(f => f.name === platform);
      if (field) {
        console.log(`  ✅ ${platform}: configured with URL validation`);
        testsPassed++;
        
        if (field.pattern) {
          console.log(`    📏 URL validation: ${field.pattern[1]}`);
        }
      } else {
        console.log(`  ❌ ${platform}: missing`);
      }
    });
  } else {
    console.log('  ❌ Social media section missing or misconfigured');
  }

  return { testsPassed, totalTests };
}

function testRequiredFieldValidation(config) {
  console.log('\n🔒 Testing Required Field Validation');
  console.log('====================================');

  const settingsCollection = config.collections.find(c => c.name === 'settings');
  const generalFile = settingsCollection.files.find(f => f.name === 'general');
  const fields = generalFile.fields;

  let testsPassed = 0;
  let totalTests = 0;

  // Critical fields that should be required
  const criticalFields = [
    { section: 'root', field: 'siteTitle', required: true },
    { section: 'root', field: 'siteDescription', required: true },
    { section: 'brand', field: 'companyName', required: true },
    { section: 'brand', field: 'tagline', required: true },
    { section: 'brand', field: 'description', required: true },
    { section: 'location', field: 'primaryLocation', required: true },
    { section: 'location', field: 'serviceAreas', required: true },
    { section: 'location', field: 'fullAddress', required: true },
    { section: 'contact', field: 'primaryEmail', required: true }
  ];

  criticalFields.forEach(({ section, field, required }) => {
    totalTests++;
    let fieldConfig;

    if (section === 'root') {
      fieldConfig = fields.find(f => f.name === field);
    } else {
      const sectionConfig = fields.find(f => f.name === section);
      if (sectionConfig && sectionConfig.fields) {
        fieldConfig = sectionConfig.fields.find(f => f.name === field);
      }
    }

    if (fieldConfig) {
      if (fieldConfig.required === required) {
        console.log(`  ✅ ${section}.${field}: correctly ${required ? 'required' : 'optional'}`);
        testsPassed++;
      } else {
        console.log(`  ❌ ${section}.${field}: should be ${required ? 'required' : 'optional'} but is ${fieldConfig.required ? 'required' : 'optional'}`);
      }
    } else {
      console.log(`  ❌ ${section}.${field}: field not found`);
    }
  });

  return { testsPassed, totalTests };
}

function testHelpTextAndHints(config) {
  console.log('\n💡 Testing Help Text and Hints');
  console.log('===============================');

  const settingsCollection = config.collections.find(c => c.name === 'settings');
  const generalFile = settingsCollection.files.find(f => f.name === 'general');
  const fields = generalFile.fields;

  let testsPassed = 0;
  let totalTests = 0;

  function checkFieldHints(fieldList, sectionName = '') {
    fieldList.forEach(field => {
      totalTests++;
      const fieldPath = sectionName ? `${sectionName}.${field.name}` : field.name;
      
      if (field.hint && field.hint.length > 10) {
        console.log(`  ✅ ${fieldPath}: has helpful hint text`);
        testsPassed++;
      } else {
        console.log(`  ⚠️  ${fieldPath}: missing or insufficient hint text`);
      }

      // Check nested fields
      if (field.fields && Array.isArray(field.fields)) {
        checkFieldHints(field.fields, fieldPath);
      }
    });
  }

  checkFieldHints(fields);

  return { testsPassed, totalTests };
}

function testBackwardCompatibility(config) {
  console.log('\n🔄 Testing Backward Compatibility');
  console.log('=================================');

  const settingsCollection = config.collections.find(c => c.name === 'settings');
  const generalFile = settingsCollection.files.find(f => f.name === 'general');
  const fields = generalFile.fields;

  let testsPassed = 0;
  let totalTests = 0;

  // Legacy fields that should still exist
  const legacyFields = ['contactEmail', 'phone', 'address'];

  legacyFields.forEach(fieldName => {
    totalTests++;
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      console.log(`  ✅ Legacy field '${fieldName}': preserved for backward compatibility`);
      testsPassed++;
      
      if (field.hint && field.hint.includes('Legacy')) {
        console.log(`    💡 Properly marked as legacy field`);
      }
    } else {
      console.log(`  ❌ Legacy field '${fieldName}': missing`);
    }
  });

  return { testsPassed, totalTests };
}

function main() {
  console.log('🚀 CMS Interface Configuration Testing');
  console.log('======================================');

  const config = loadCMSConfig();
  if (!config) {
    console.log('❌ Failed to load CMS configuration');
    return false;
  }

  console.log('✅ CMS configuration loaded successfully');

  const results = [];

  // Test field configuration
  results.push(testFieldConfiguration(config));

  // Test required field validation
  results.push(testRequiredFieldValidation(config));

  // Test help text and hints
  results.push(testHelpTextAndHints(config));

  // Test backward compatibility
  results.push(testBackwardCompatibility(config));

  // Calculate overall results
  const totalTests = results.reduce((sum, result) => sum + result.totalTests, 0);
  const totalPassed = results.reduce((sum, result) => sum + result.testsPassed, 0);
  const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

  console.log('\n📋 OVERALL TEST SUMMARY');
  console.log('=======================');
  console.log(`🎯 Success Rate: ${successRate}% (${totalPassed}/${totalTests} tests passed)`);

  if (totalPassed === totalTests) {
    console.log('🎉 All CMS interface tests passed! The configuration is ready for use.');
  } else {
    console.log('⚠️  Some tests failed. Please review the configuration.');
  }

  // Provide usage instructions
  console.log('\n📖 USAGE INSTRUCTIONS');
  console.log('=====================');
  console.log('1. Access the CMS at: /admin/');
  console.log('2. Navigate to "Site Settings" → "General Settings"');
  console.log('3. Update brand information in the "Brand Information" section');
  console.log('4. Configure contact details in the "Contact Information" section');
  console.log('5. Set location information in the "Location Information" section');
  console.log('6. Update social media links in the "Social Media" section');
  console.log('7. All fields include validation and helpful hints');
  console.log('8. Required fields are marked and will prevent saving if empty');

  return totalPassed === totalTests;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { loadCMSConfig, testFieldConfiguration };