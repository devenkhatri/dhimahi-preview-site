#!/usr/bin/env node

/**
 * Test script to verify admin page accessibility and diagnose issues
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

function checkAdminFiles() {
  console.log('🔍 Checking Admin Files');
  console.log('=======================');

  const adminDir = path.join(process.cwd(), 'public', 'admin');
  const requiredFiles = [
    'index.html',
    'config.yml'
  ];

  const optionalFiles = [
    'media-widget.js',
    'preview-templates/homepage-preview.js',
    'preview-templates/service-preview.js',
    'preview-templates/case-study-preview.js',
    'preview-templates/insight-preview.js',
    'preview-templates/pages-preview.js',
    'preview-templates/settings-preview.js'
  ];

  let allGood = true;

  // Check required files
  requiredFiles.forEach(file => {
    const filePath = path.join(adminDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Required: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
      allGood = false;
    }
  });

  // Check optional files
  optionalFiles.forEach(file => {
    const filePath = path.join(adminDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Optional: ${file}`);
    } else {
      console.log(`⚠️  Missing: ${file} (optional)`);
    }
  });

  return allGood;
}

function validateJavaScriptFiles() {
  console.log('\n🧪 Validating JavaScript Files');
  console.log('==============================');

  const adminDir = path.join(process.cwd(), 'public', 'admin');
  const jsFiles = [
    'media-widget.js',
    'preview-templates/homepage-preview.js',
    'preview-templates/service-preview.js',
    'preview-templates/case-study-preview.js',
    'preview-templates/insight-preview.js',
    'preview-templates/pages-preview.js',
    'preview-templates/settings-preview.js'
  ];

  let allValid = true;

  jsFiles.forEach(file => {
    const filePath = path.join(adminDir, file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Basic syntax checks
        if (content.trim().length === 0) {
          console.log(`⚠️  ${file}: Empty file`);
          return;
        }

        // Check for incomplete functions or syntax
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;

        if (openBraces !== closeBraces) {
          console.log(`❌ ${file}: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
          allValid = false;
        } else if (openParens !== closeParens) {
          console.log(`❌ ${file}: Mismatched parentheses (${openParens} open, ${closeParens} close)`);
          allValid = false;
        } else {
          console.log(`✅ ${file}: Basic syntax OK`);
        }

      } catch (error) {
        console.log(`❌ ${file}: Error reading file - ${error.message}`);
        allValid = false;
      }
    }
  });

  return allValid;
}

function testLocalAccess() {
  console.log('\n🌐 Testing Local Access');
  console.log('=======================');

  return new Promise((resolve) => {
    // Test if localhost:3000 is accessible
    const req = http.get('http://localhost:3000/admin/', (res) => {
      console.log(`✅ Admin page accessible: HTTP ${res.statusCode}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.includes('Error loading the CMS configuration')) {
          console.log('❌ CMS configuration error detected in response');
          console.log('💡 This suggests a YAML syntax error in config.yml');
          resolve(false);
        } else if (data.includes('Content Manager')) {
          console.log('✅ CMS interface loaded successfully');
          resolve(true);
        } else {
          console.log('⚠️  Unexpected response content');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Cannot access localhost:3000: ${error.message}`);
      console.log('💡 Make sure your development server is running with: npm run dev');
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Request timeout - server may not be running');
      req.destroy();
      resolve(false);
    });
  });
}

function provideSolutions() {
  console.log('\n💡 TROUBLESHOOTING SOLUTIONS');
  console.log('============================');
  
  console.log('1. 🚀 Start Development Server:');
  console.log('   npm run dev');
  console.log('   # Then visit: http://localhost:3000/admin/');
  
  console.log('\n2. 🔧 Fix Configuration Issues:');
  console.log('   # Validate YAML syntax:');
  console.log('   node scripts/validate-cms-config.js');
  
  console.log('\n3. 🧹 Clear Cache and Restart:');
  console.log('   npm run clean:dev');
  console.log('   npm run dev');
  
  console.log('\n4. 📁 Check File Permissions:');
  console.log('   # Ensure admin files are readable:');
  console.log('   ls -la public/admin/');
  
  console.log('\n5. 🌐 Alternative Access Methods:');
  console.log('   # Try these URLs:');
  console.log('   http://localhost:3000/admin');
  console.log('   http://localhost:3000/admin/');
  console.log('   http://localhost:3000/admin/index.html');
  
  console.log('\n6. 🔍 Debug Mode:');
  console.log('   # Open browser dev tools (F12) and check:');
  console.log('   # - Console for JavaScript errors');
  console.log('   # - Network tab for failed requests');
  console.log('   # - Sources tab to verify files are loaded');
}

async function main() {
  console.log('🚀 Admin Access Diagnostic Tool');
  console.log('===============================');

  // Check admin files
  const filesOK = checkAdminFiles();
  
  // Validate JavaScript files
  const jsOK = validateJavaScriptFiles();
  
  // Test local access (only if server might be running)
  let accessOK = false;
  try {
    accessOK = await testLocalAccess();
  } catch (error) {
    console.log(`⚠️  Could not test local access: ${error.message}`);
  }

  // Summary
  console.log('\n📋 DIAGNOSTIC SUMMARY');
  console.log('====================');
  console.log(`Admin Files: ${filesOK ? '✅ OK' : '❌ Issues Found'}`);
  console.log(`JavaScript Files: ${jsOK ? '✅ OK' : '❌ Issues Found'}`);
  console.log(`Local Access: ${accessOK ? '✅ OK' : '❌ Issues Found'}`);

  if (filesOK && jsOK && accessOK) {
    console.log('\n🎉 All checks passed! Admin should be accessible.');
  } else {
    console.log('\n⚠️  Issues detected. See solutions below.');
    provideSolutions();
  }

  return filesOK && jsOK;
}

if (require.main === module) {
  main().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { checkAdminFiles, validateJavaScriptFiles, testLocalAccess };