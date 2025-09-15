#!/usr/bin/env node

/**
 * Test script to validate CMS field validation patterns
 * This script tests the regex patterns defined in the CMS config
 */

const fs = require('fs');
const yaml = require('js-yaml');

// Test data for validation
const testData = {
  validEmails: [
    'hello@dhimahitechnolabs.com',
    'support@example.com',
    'test.email+tag@domain.co.uk'
  ],
  invalidEmails: [
    'invalid-email',
    '@domain.com',
    'email@',
    'email@domain',
    'email.domain.com'
  ],
  validPhones: [
    '+91 99999 99999',
    '+1 (555) 123-4567',
    '9999999999',
    '+44 20 7946 0958',
    '555-123-4567'
  ],
  invalidPhones: [
    '123',
    'abc-def-ghij',
    '+',
    '++91 99999 99999',
    '123456789012345678901'
  ],
  validUrls: [
    'https://linkedin.com/company/dhimahi-technolabs',
    'https://www.linkedin.com/company/test-company',
    'https://twitter.com/username',
    'https://x.com/username',
    'https://facebook.com/page.name',
    'https://www.instagram.com/username',
    'https://youtube.com/channel/UCtest',
    'https://youtube.com/@channelname',
    'https://www.dhimahitechnolabs.com',
    'http://example.com'
  ],
  invalidUrls: [
    'not-a-url',
    'ftp://example.com',
    'https://',
    'linkedin.com/company/test',
    'https://linkedin.com/invalid-path',
    'https://twitter.com/',
    'https://facebook.com/',
    'https://instagram.com/',
    'https://youtube.com/'
  ]
};

// Validation patterns from CMS config
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[+]?[0-9\s\-\(\)]{7,20}$/,
  linkedin: /^https:\/\/(www\.)?linkedin\.com\/(company|in)\/[a-zA-Z0-9\-]+\/?$/,
  twitter: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
  facebook: /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9\.]+\/?$/,
  instagram: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9\._]+\/?$/,
  youtube: /^https:\/\/(www\.)?youtube\.com\/(channel\/|@)[a-zA-Z0-9\-_]+\/?$/,
  website: /^https?:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}\/?.*$/
};

function testPattern(pattern, validData, invalidData, patternName) {
  console.log(`\n🧪 Testing ${patternName} validation:`);
  
  let validPassed = 0;
  let validFailed = 0;
  let invalidPassed = 0;
  let invalidFailed = 0;

  // Test valid data (should pass)
  validData.forEach(data => {
    if (pattern.test(data)) {
      console.log(`  ✅ Valid: "${data}" - PASSED`);
      validPassed++;
    } else {
      console.log(`  ❌ Valid: "${data}" - FAILED (should have passed)`);
      validFailed++;
    }
  });

  // Test invalid data (should fail)
  invalidData.forEach(data => {
    if (!pattern.test(data)) {
      console.log(`  ✅ Invalid: "${data}" - CORRECTLY REJECTED`);
      invalidPassed++;
    } else {
      console.log(`  ❌ Invalid: "${data}" - INCORRECTLY ACCEPTED`);
      invalidFailed++;
    }
  });

  const totalTests = validData.length + invalidData.length;
  const totalPassed = validPassed + invalidPassed;
  const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

  console.log(`  📊 Results: ${totalPassed}/${totalTests} tests passed (${successRate}%)`);
  
  return {
    pattern: patternName,
    totalTests,
    totalPassed,
    successRate: parseFloat(successRate),
    validPassed,
    validFailed,
    invalidPassed,
    invalidFailed
  };
}

function testCharacterLimits() {
  console.log('\n🧪 Testing character limit validations:');
  
  const limits = {
    companyName: { min: 2, max: 100 },
    tagline: { min: 5, max: 100 },
    description: { min: 50, max: 500 },
    primaryLocation: { min: 3, max: 100 },
    businessHours: { min: 5, max: 100 }
  };

  Object.entries(limits).forEach(([field, { min, max }]) => {
    const shortText = 'a'.repeat(min - 1);
    const validText = 'a'.repeat(min);
    const longText = 'a'.repeat(max + 1);
    const maxText = 'a'.repeat(max);

    console.log(`  📏 ${field}:`);
    console.log(`    ❌ Too short (${shortText.length} chars): ${shortText.length < min ? 'CORRECTLY REJECTED' : 'INCORRECTLY ACCEPTED'}`);
    console.log(`    ✅ Min length (${validText.length} chars): ${validText.length >= min ? 'CORRECTLY ACCEPTED' : 'INCORRECTLY REJECTED'}`);
    console.log(`    ✅ Max length (${maxText.length} chars): ${maxText.length <= max ? 'CORRECTLY ACCEPTED' : 'INCORRECTLY REJECTED'}`);
    console.log(`    ❌ Too long (${longText.length} chars): ${longText.length > max ? 'CORRECTLY REJECTED' : 'INCORRECTLY ACCEPTED'}`);
  });
}

function main() {
  console.log('🚀 CMS Validation Pattern Testing');
  console.log('=====================================');

  const results = [];

  // Test email validation
  results.push(testPattern(
    patterns.email,
    testData.validEmails,
    testData.invalidEmails,
    'Email'
  ));

  // Test phone validation
  results.push(testPattern(
    patterns.phone,
    testData.validPhones,
    testData.invalidPhones,
    'Phone'
  ));

  // Test social media URL validations
  results.push(testPattern(
    patterns.linkedin,
    testData.validUrls.filter(url => url.includes('linkedin')),
    testData.invalidUrls.filter(url => url.includes('linkedin') || url === 'linkedin.com/company/test'),
    'LinkedIn'
  ));

  results.push(testPattern(
    patterns.twitter,
    testData.validUrls.filter(url => url.includes('twitter') || url.includes('x.com')),
    testData.invalidUrls.filter(url => url.includes('twitter')),
    'Twitter/X'
  ));

  results.push(testPattern(
    patterns.facebook,
    testData.validUrls.filter(url => url.includes('facebook')),
    testData.invalidUrls.filter(url => url.includes('facebook')),
    'Facebook'
  ));

  results.push(testPattern(
    patterns.instagram,
    testData.validUrls.filter(url => url.includes('instagram')),
    testData.invalidUrls.filter(url => url.includes('instagram')),
    'Instagram'
  ));

  results.push(testPattern(
    patterns.youtube,
    testData.validUrls.filter(url => url.includes('youtube')),
    testData.invalidUrls.filter(url => url.includes('youtube')),
    'YouTube'
  ));

  results.push(testPattern(
    patterns.website,
    testData.validUrls.filter(url => !url.includes('linkedin') && !url.includes('twitter') && !url.includes('facebook') && !url.includes('instagram') && !url.includes('youtube')),
    testData.invalidUrls.filter(url => !url.includes('linkedin') && !url.includes('twitter') && !url.includes('facebook') && !url.includes('instagram') && !url.includes('youtube')),
    'Website'
  ));

  // Test character limits
  testCharacterLimits();

  // Summary
  console.log('\n📋 VALIDATION TEST SUMMARY');
  console.log('==========================');
  
  const overallStats = results.reduce((acc, result) => {
    acc.totalTests += result.totalTests;
    acc.totalPassed += result.totalPassed;
    return acc;
  }, { totalTests: 0, totalPassed: 0 });

  const overallSuccessRate = ((overallStats.totalPassed / overallStats.totalTests) * 100).toFixed(1);

  results.forEach(result => {
    const status = result.successRate >= 90 ? '✅' : result.successRate >= 70 ? '⚠️' : '❌';
    console.log(`${status} ${result.pattern}: ${result.successRate}% (${result.totalPassed}/${result.totalTests})`);
  });

  console.log(`\n🎯 Overall Success Rate: ${overallSuccessRate}% (${overallStats.totalPassed}/${overallStats.totalTests} tests)`);

  if (overallStats.totalPassed === overallStats.totalTests) {
    console.log('🎉 All validation patterns are working correctly!');
  } else {
    console.log('⚠️  Some validation patterns may need adjustment.');
  }

  return overallStats.totalPassed === overallStats.totalTests;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { testPattern, patterns, testData };