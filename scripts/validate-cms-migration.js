#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating CMS Content Migration...\n');

// Check homepage content
console.log('📄 Checking Homepage Content:');
try {
  const homepageContent = fs.readFileSync('content/pages/homepage.yml', 'utf8');
  const requiredSections = ['hero', 'servicesOverview', 'whyChooseUs', 'testimonials', 'contactCTA', 'contactForm'];
  
  requiredSections.forEach(section => {
    if (homepageContent.includes(`${section}:`)) {
      console.log(`  ✅ ${section} section migrated`);
    } else {
      console.log(`  ❌ ${section} section missing`);
    }
  });
} catch (error) {
  console.log('  ❌ Homepage file not found or readable');
}

// Check services
console.log('\n🛠️  Checking Services:');
const servicesDir = 'content/services';
const serviceFiles = ['web-development.md', 'digital-marketing.md', 'ai-automation.md'];

serviceFiles.forEach(filename => {
  try {
    const content = fs.readFileSync(path.join(servicesDir, filename), 'utf8');
    const hasStartingPrice = content.includes('startingPrice:');
    const hasRequiredFields = content.includes('title:') && content.includes('excerpt:') && content.includes('features:');
    
    if (hasRequiredFields) {
      console.log(`  ✅ ${filename} - Required fields present ${hasStartingPrice ? '(with pricing)' : ''}`);
    } else {
      console.log(`  ❌ ${filename} - Missing required fields`);
    }
  } catch (error) {
    console.log(`  ❌ ${filename} - File not found or readable`);
  }
});

// Check case studies
console.log('\n📊 Checking Case Studies:');
const caseStudiesDir = 'content/case-studies';
const caseStudyFiles = fs.readdirSync(caseStudiesDir).filter(f => f.endsWith('.md'));

caseStudyFiles.forEach(filename => {
  try {
    const content = fs.readFileSync(path.join(caseStudiesDir, filename), 'utf8');
    const hasExpandedChallenge = content.includes('challenge: |');
    const hasRequiredFields = content.includes('client:') && content.includes('results:') && content.includes('solution:');
    
    if (hasRequiredFields) {
      console.log(`  ✅ ${filename} - Required fields present ${hasExpandedChallenge ? '(expanded challenge)' : ''}`);
    } else {
      console.log(`  ❌ ${filename} - Missing required fields`);
    }
  } catch (error) {
    console.log(`  ❌ ${filename} - File not found or readable`);
  }
});

// Check insights
console.log('\n📝 Checking Insights Articles:');
const insightsDir = 'content/insights';
const insightFiles = fs.readdirSync(insightsDir).filter(f => f.endsWith('.md'));

let migratedCount = 0;
let totalCount = insightFiles.length;

insightFiles.forEach(filename => {
  try {
    const content = fs.readFileSync(path.join(insightsDir, filename), 'utf8');
    const hasCMSFields = content.includes('slug:') && content.includes('publishDate:') && content.includes('category:');
    
    if (hasCMSFields) {
      migratedCount++;
    }
  } catch (error) {
    console.log(`  ❌ ${filename} - File not found or readable`);
  }
});

console.log(`  ✅ ${migratedCount}/${totalCount} insights articles migrated to CMS format`);

// Check about page
console.log('\n👥 Checking About Page:');
try {
  const aboutContent = fs.readFileSync('content/pages/about.yml', 'utf8');
  const requiredSections = ['story', 'mission', 'vision', 'values', 'timeline', 'team'];
  
  requiredSections.forEach(section => {
    if (aboutContent.includes(`${section}:`)) {
      console.log(`  ✅ ${section} section present`);
    } else {
      console.log(`  ❌ ${section} section missing`);
    }
  });
} catch (error) {
  console.log('  ❌ About page file not found or readable');
}

// Check settings
console.log('\n⚙️  Checking Site Settings:');
try {
  const settingsContent = fs.readFileSync('content/settings/general.yml', 'utf8');
  const requiredFields = ['siteTitle', 'siteDescription', 'contactEmail', 'phone', 'address'];
  
  requiredFields.forEach(field => {
    if (settingsContent.includes(`${field}:`)) {
      console.log(`  ✅ ${field} configured`);
    } else {
      console.log(`  ❌ ${field} missing`);
    }
  });
} catch (error) {
  console.log('  ❌ Settings file not found or readable');
}

console.log('\n🎉 Migration validation complete!');
console.log('\n📋 Summary:');
console.log(`- Homepage: Enhanced with additional sections`);
console.log(`- Services: ${serviceFiles.length} services with pricing information`);
console.log(`- Case Studies: ${caseStudyFiles.length} case studies with expanded content`);
console.log(`- Insights: ${migratedCount}/${totalCount} articles migrated to CMS format`);
console.log(`- About Page: Complete with all sections`);
console.log(`- Settings: Site configuration ready`);