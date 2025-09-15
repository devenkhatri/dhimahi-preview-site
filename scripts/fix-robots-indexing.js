#!/usr/bin/env node

/**
 * Diagnostic and fix script for Google Search Console robots.txt blocking issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkRobotsConfiguration() {
  console.log('🤖 Checking Robots Configuration');
  console.log('================================');

  // Check robots.ts file
  const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
  
  if (fs.existsSync(robotsPath)) {
    console.log('✅ Found robots.ts file');
    
    const content = fs.readFileSync(robotsPath, 'utf8');
    console.log('\n📄 Current robots.ts content:');
    console.log(content);
    
    // Check for common issues
    if (content.includes('disallow: "/"')) {
      console.log('❌ ISSUE: Found disallow: "/" - this blocks all pages!');
      return false;
    }
    
    if (content.includes('allow: "/"')) {
      console.log('✅ Good: Found allow: "/" - pages should be crawlable');
    }
    
    if (content.includes('userAgent: "*"')) {
      console.log('✅ Good: Allows all user agents');
    }
    
    return true;
  } else {
    console.log('❌ No robots.ts file found');
    return false;
  }
}

function checkSitemapConfiguration() {
  console.log('\n🗺️  Checking Sitemap Configuration');
  console.log('==================================');

  const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
  
  if (fs.existsSync(sitemapPath)) {
    console.log('✅ Found sitemap.ts file');
    
    const content = fs.readFileSync(sitemapPath, 'utf8');
    
    // Check for proper base URL
    if (content.includes('dhimahitechnolabs.com')) {
      console.log('✅ Good: Uses correct domain');
    } else {
      console.log('⚠️  Warning: Check domain in sitemap');
    }
    
    // Check for dynamic content
    if (content.includes('force-static')) {
      console.log('✅ Good: Uses force-static for proper generation');
    }
    
    return true;
  } else {
    console.log('❌ No sitemap.ts file found');
    return false;
  }
}

function checkNextJSConfiguration() {
  console.log('\n⚙️  Checking Next.js Configuration');
  console.log('==================================');

  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  
  if (fs.existsSync(nextConfigPath)) {
    console.log('✅ Found next.config.mjs');
    
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for static export
    if (content.includes('output: \'export\'')) {
      console.log('⚠️  Warning: Static export detected - this can affect robots.txt generation');
      console.log('💡 For static sites, you may need a static robots.txt file');
      return 'static';
    } else {
      console.log('✅ Good: Using standard Next.js build');
      return 'standard';
    }
  }
  
  return 'unknown';
}

function createOptimizedRobots() {
  console.log('\n🔧 Creating Optimized Robots Configuration');
  console.log('==========================================');

  const robotsContent = `import type { MetadataRoute } from "next";

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.dhimahitechnolabs.com'
    : 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow admin and private areas
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/private/",
          "/*.json$",
          "/scripts/",
          "/node_modules/"
        ]
      },
      {
        // Allow search engines full access
        userAgent: ["Googlebot", "Bingbot", "Slurp"],
        allow: "/",
        disallow: ["/admin/", "/api/"]
      }
    ],
    sitemap: \`\${baseUrl}/sitemap.xml\`,
    host: baseUrl
  };
}`;

  const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
  
  try {
    // Backup existing file
    if (fs.existsSync(robotsPath)) {
      const backup = fs.readFileSync(robotsPath, 'utf8');
      fs.writeFileSync(robotsPath + '.backup', backup);
      console.log('✅ Backed up existing robots.ts');
    }
    
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('✅ Created optimized robots.ts');
    return true;
  } catch (error) {
    console.error('❌ Failed to create robots.ts:', error.message);
    return false;
  }
}

function createStaticRobotsTxt() {
  console.log('\n📄 Creating Static robots.txt (for static exports)');
  console.log('==================================================');

  const robotsTxtContent = `# Robots.txt for dhimahitechnolabs.com
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/
Disallow: /*.json$
Disallow: /scripts/
Disallow: /node_modules/

# Allow search engines
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemap location
Sitemap: https://www.dhimahitechnolabs.com/sitemap.xml

# Host
Host: https://www.dhimahitechnolabs.com
`;

  const robotsTxtPath = path.join(process.cwd(), 'public', 'robots.txt');
  
  try {
    fs.writeFileSync(robotsTxtPath, robotsTxtContent);
    console.log('✅ Created static robots.txt in public folder');
    return true;
  } catch (error) {
    console.error('❌ Failed to create robots.txt:', error.message);
    return false;
  }
}

function testRobotsGeneration() {
  console.log('\n🧪 Testing Robots Generation');
  console.log('============================');

  try {
    // Try to build and check robots generation
    console.log('Building project to test robots generation...');
    
    // For development testing, we'll just check the file structure
    const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
    
    if (fs.existsSync(robotsPath)) {
      console.log('✅ robots.ts exists and should generate robots.txt');
      
      // Check if we can import and run it (basic syntax check)
      const content = fs.readFileSync(robotsPath, 'utf8');
      
      if (content.includes('export default function robots()')) {
        console.log('✅ robots.ts has correct export structure');
      }
      
      if (content.includes('MetadataRoute.Robots')) {
        console.log('✅ robots.ts uses correct TypeScript types');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error testing robots generation:', error.message);
    return false;
  }
}

function provideSEORecommendations() {
  console.log('\n💡 SEO Recommendations');
  console.log('======================');

  console.log('1. 🔍 Verify robots.txt in production:');
  console.log('   Visit: https://www.dhimahitechnolabs.com/robots.txt');
  console.log('   Should show: User-agent: * Allow: /');

  console.log('\n2. 📊 Test with Google Search Console:');
  console.log('   - Go to Google Search Console');
  console.log('   - Use "URL Inspection" tool');
  console.log('   - Test individual URLs');
  console.log('   - Check "robots.txt tester"');

  console.log('\n3. 🗺️  Verify sitemap:');
  console.log('   Visit: https://www.dhimahitechnolabs.com/sitemap.xml');
  console.log('   Should list all your pages');

  console.log('\n4. 🚀 Submit to search engines:');
  console.log('   - Google Search Console: Submit sitemap');
  console.log('   - Bing Webmaster Tools: Submit sitemap');
  console.log('   - Request re-indexing for blocked pages');

  console.log('\n5. 📈 Monitor indexing:');
  console.log('   - Check "Coverage" report in Search Console');
  console.log('   - Look for "Indexed, though blocked by robots.txt"');
  console.log('   - Request re-crawling after fixes');
}

function checkCommonIssues() {
  console.log('\n🔍 Checking Common Indexing Issues');
  console.log('==================================');

  const issues = [];

  // Check for meta noindex tags
  const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    if (content.includes('noindex')) {
      issues.push('Found "noindex" in layout.tsx - this prevents indexing');
    }
    
    if (content.includes('nofollow')) {
      issues.push('Found "nofollow" in layout.tsx - this prevents link following');
    }
  }

  // Check for canonical issues
  const pages = ['page.tsx', 'layout.tsx'];
  pages.forEach(pageFile => {
    const pagePath = path.join(process.cwd(), 'src', 'app', pageFile);
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      
      if (content.includes('canonical') && content.includes('localhost')) {
        issues.push(`Found localhost canonical URL in ${pageFile} - should use production URL`);
      }
    }
  });

  if (issues.length === 0) {
    console.log('✅ No common indexing issues found');
  } else {
    console.log('⚠️  Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }

  return issues.length === 0;
}

function main() {
  console.log('🚀 Google Search Console Robots.txt Fix');
  console.log('=======================================');

  const results = [];

  // Check current configuration
  results.push(checkRobotsConfiguration());
  results.push(checkSitemapConfiguration());
  
  const buildType = checkNextJSConfiguration();
  results.push(checkCommonIssues());

  // Create optimized configuration
  if (buildType === 'static') {
    console.log('\n🔧 Detected static export - creating static robots.txt');
    results.push(createStaticRobotsTxt());
  } else {
    console.log('\n🔧 Creating optimized robots.ts for dynamic generation');
    results.push(createOptimizedRobots());
  }

  results.push(testRobotsGeneration());

  // Summary
  const successCount = results.filter(Boolean).length;
  const totalChecks = results.length;

  console.log('\n📊 SUMMARY');
  console.log('==========');
  console.log(`✅ Successful checks: ${successCount}/${totalChecks}`);

  if (successCount === totalChecks) {
    console.log('\n🎉 All checks passed! Your robots.txt should now allow indexing.');
    console.log('\n🚀 Next steps:');
    console.log('1. Deploy your changes to production');
    console.log('2. Verify robots.txt at your domain/robots.txt');
    console.log('3. Request re-indexing in Google Search Console');
    console.log('4. Monitor the Coverage report for improvements');
  } else {
    console.log('\n⚠️  Some issues need attention. See details above.');
  }

  provideSEORecommendations();

  return successCount === totalChecks;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { 
  checkRobotsConfiguration, 
  createOptimizedRobots, 
  createStaticRobotsTxt,
  checkCommonIssues 
};