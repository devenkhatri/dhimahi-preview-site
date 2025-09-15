#!/usr/bin/env node

/**
 * Test script to verify layout.tsx uses CMS values instead of hardcoded ones
 */

const fs = require('fs');
const path = require('path');

function checkLayoutFile() {
  console.log('🔍 Checking Layout File for Hardcoded Values');
  console.log('=============================================');

  const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  
  try {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    // Define patterns to check for hardcoded values
    const hardcodedPatterns = [
      {
        pattern: /telephone":\s*"[+]91\s*99999\s*99999"/,
        description: 'Hardcoded phone number in JSON-LD',
        shouldUse: 'settings.contact.phone or settings.phone'
      },
      {
        pattern: /"Dhīmahi Technolabs"/,
        description: 'Hardcoded company name',
        shouldUse: 'settings.brand.companyName'
      },
      {
        pattern: /"https:\/\/www\.dhimahitechnolabs\.com"/,
        description: 'Hardcoded website URL',
        shouldUse: 'settings.business?.website'
      },
      {
        pattern: /"foundingDate":\s*"1999"/,
        description: 'Hardcoded founding date',
        shouldUse: 'settings.business?.foundedYear'
      },
      {
        pattern: /"addressLocality":\s*"Ahmedabad"/,
        description: 'Hardcoded address locality',
        shouldUse: 'settings.location.serviceAreas'
      },
      {
        pattern: /"addressRegion":\s*"Gujarat"/,
        description: 'Hardcoded address region',
        shouldUse: 'settings.location.serviceAreas'
      },
      {
        pattern: /"Transform your SME with AI solutions/,
        description: 'Hardcoded description',
        shouldUse: 'settings.brand.description'
      },
      {
        pattern: /@dhimahitechnolabs/,
        description: 'Hardcoded Twitter handle',
        shouldUse: 'Dynamic extraction from settings.socialMedia.twitter'
      },
      {
        pattern: /"sameAs":\s*\[\]/,
        description: 'Empty sameAs array',
        shouldUse: 'settings.socialMedia values'
      }
    ];

    let issuesFound = 0;
    let totalChecks = hardcodedPatterns.length;

    console.log('\n📋 Checking for hardcoded values:');
    
    hardcodedPatterns.forEach((check, index) => {
      if (check.pattern.test(content)) {
        console.log(`❌ Issue ${index + 1}: ${check.description}`);
        console.log(`   Should use: ${check.shouldUse}`);
        issuesFound++;
      } else {
        console.log(`✅ Check ${index + 1}: ${check.description} - OK`);
      }
    });

    // Check for proper CMS integration patterns
    const cmsPatterns = [
      {
        pattern: /settings\.brand\.companyName/,
        description: 'Uses CMS company name'
      },
      {
        pattern: /settings\.contact\.phone/,
        description: 'Uses CMS phone number'
      },
      {
        pattern: /settings\.business\?\.website/,
        description: 'Uses CMS website URL'
      },
      {
        pattern: /settings\.brand\.description/,
        description: 'Uses CMS brand description'
      },
      {
        pattern: /settings\.socialMedia/,
        description: 'Uses CMS social media'
      },
      {
        pattern: /settings\.location\.serviceAreas/,
        description: 'Uses CMS service areas'
      }
    ];

    console.log('\n📋 Checking for CMS integration:');
    
    let cmsIntegrationCount = 0;
    cmsPatterns.forEach((check, index) => {
      if (check.pattern.test(content)) {
        console.log(`✅ Integration ${index + 1}: ${check.description} - Found`);
        cmsIntegrationCount++;
      } else {
        console.log(`❌ Integration ${index + 1}: ${check.description} - Missing`);
      }
    });

    // Summary
    console.log('\n📊 SUMMARY');
    console.log('==========');
    console.log(`Hardcoded issues found: ${issuesFound}/${totalChecks}`);
    console.log(`CMS integrations found: ${cmsIntegrationCount}/${cmsPatterns.length}`);
    
    const successRate = ((totalChecks - issuesFound + cmsIntegrationCount) / (totalChecks + cmsPatterns.length) * 100).toFixed(1);
    console.log(`Overall success rate: ${successRate}%`);

    if (issuesFound === 0 && cmsIntegrationCount === cmsPatterns.length) {
      console.log('\n🎉 All hardcoded values have been replaced with CMS values!');
      return true;
    } else {
      console.log('\n⚠️  Some issues remain. See details above.');
      return false;
    }

  } catch (error) {
    console.error('❌ Failed to read layout file:', error.message);
    return false;
  }
}

function checkSpecificValues() {
  console.log('\n🔍 Checking Specific Value Replacements');
  console.log('======================================');

  const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  
  try {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    // Extract JSON-LD sections
    const jsonLdMatches = content.match(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g);
    
    if (!jsonLdMatches) {
      console.log('❌ No JSON-LD scripts found');
      return false;
    }

    console.log(`✅ Found ${jsonLdMatches.length} JSON-LD script(s)`);

    jsonLdMatches.forEach((script, index) => {
      console.log(`\n📄 JSON-LD Script ${index + 1}:`);
      
      // Check for dynamic values
      const dynamicChecks = [
        { pattern: /settings\.brand\.companyName/, name: 'Company Name' },
        { pattern: /settings\.contact\.phone/, name: 'Phone Number' },
        { pattern: /settings\.brand\.description/, name: 'Description' },
        { pattern: /settings\.business\?\.website/, name: 'Website URL' },
        { pattern: /settings\.socialMedia/, name: 'Social Media' },
        { pattern: /settings\.location/, name: 'Location Data' }
      ];

      dynamicChecks.forEach(check => {
        if (check.pattern.test(script)) {
          console.log(`  ✅ ${check.name}: Using CMS value`);
        } else {
          console.log(`  ⚪ ${check.name}: Not found in this script`);
        }
      });
    });

    return true;

  } catch (error) {
    console.error('❌ Failed to analyze JSON-LD:', error.message);
    return false;
  }
}

function provideCMSMappingGuide() {
  console.log('\n📖 CMS Value Mapping Guide');
  console.log('==========================');
  
  const mappings = [
    { hardcoded: '"Dhīmahi Technolabs"', cms: 'settings.brand.companyName' },
    { hardcoded: '"+91 99999 99999"', cms: 'settings.contact.phone || settings.phone' },
    { hardcoded: '"https://www.dhimahitechnolabs.com"', cms: 'settings.business?.website' },
    { hardcoded: '"Transform your SME..."', cms: 'settings.brand.description' },
    { hardcoded: '"1999"', cms: 'settings.business?.foundedYear?.toString()' },
    { hardcoded: '"Ahmedabad"', cms: 'settings.location.serviceAreas?.[0]' },
    { hardcoded: '"Gujarat"', cms: 'settings.location.serviceAreas?.find(area => area.includes("Gujarat"))' },
    { hardcoded: '@dhimahitechnolabs', cms: 'Extract from settings.socialMedia.twitter' },
    { hardcoded: 'Empty sameAs array', cms: 'settings.socialMedia values filtered' },
    { hardcoded: 'Static keywords', cms: 'settings.seo?.keywords' }
  ];

  mappings.forEach(mapping => {
    console.log(`${mapping.hardcoded} → ${mapping.cms}`);
  });
}

function main() {
  console.log('🚀 Layout CMS Integration Verification');
  console.log('======================================');

  const layoutOK = checkLayoutFile();
  const valuesOK = checkSpecificValues();

  if (layoutOK && valuesOK) {
    console.log('\n🎉 SUCCESS: Layout is properly integrated with CMS!');
    console.log('\n✅ Benefits:');
    console.log('- All structured data now uses CMS values');
    console.log('- Easy to update company information through CMS');
    console.log('- Consistent branding across the site');
    console.log('- Better SEO with accurate, up-to-date information');
  } else {
    console.log('\n⚠️  Issues found. Please review the analysis above.');
    provideCMSMappingGuide();
  }

  return layoutOK && valuesOK;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { checkLayoutFile, checkSpecificValues };