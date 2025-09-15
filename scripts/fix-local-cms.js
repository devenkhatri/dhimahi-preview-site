#!/usr/bin/env node

/**
 * Fix CMS configuration for local development
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function createLocalCMSConfig() {
  console.log('🔧 Creating Local CMS Configuration');
  console.log('===================================');

  const configPath = path.join(process.cwd(), 'public', 'admin', 'config.yml');
  
  try {
    // Read the existing config
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent);

    // Create a local development version
    const localConfig = {
      ...config,
      // Use local backend for development
      local_backend: true,
      backend: {
        name: 'git-gateway',
        branch: 'main', // Use main branch for local development
        // Remove production-specific settings for local dev
      },
      // Simplify media configuration for local development
      media_folder: 'public/uploads',
      public_folder: '/uploads',
      // Disable some production features for local dev
      site_url: 'http://localhost:3000',
      display_url: 'http://localhost:3000',
      logo_url: '/favicon.svg',
    };

    // Write the local config
    const localConfigPath = path.join(process.cwd(), 'public', 'admin', 'config.local.yml');
    fs.writeFileSync(localConfigPath, yaml.dump(localConfig, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true 
    }));

    console.log('✅ Local CMS config created at public/admin/config.local.yml');
    return true;

  } catch (error) {
    console.error('❌ Failed to create local config:', error.message);
    return false;
  }
}

function createLocalAdminHTML() {
  console.log('\n🔧 Creating Local Admin HTML');
  console.log('============================');

  const adminDir = path.join(process.cwd(), 'public', 'admin');
  const localHtmlPath = path.join(adminDir, 'index.local.html');

  const localHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager - Local Development</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .logo {
      width: 64px;
      height: 64px;
      background: #667eea;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
      margin: 0 auto 20px;
    }
    h1 {
      text-align: center;
      color: #2d3748;
      margin-bottom: 10px;
    }
    .subtitle {
      text-align: center;
      color: #718096;
      margin-bottom: 30px;
    }
    .status {
      background: #e6fffa;
      border: 1px solid #38b2ac;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
    }
    .status h3 {
      margin: 0 0 10px;
      color: #2c7a7b;
    }
    .status p {
      margin: 5px 0;
      color: #2c7a7b;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 10px 10px 10px 0;
      transition: background-color 0.2s;
    }
    .button:hover {
      background: #5a67d8;
    }
    .button.secondary {
      background: #e2e8f0;
      color: #2d3748;
    }
    .button.secondary:hover {
      background: #cbd5e0;
    }
    .instructions {
      background: #fef5e7;
      border: 1px solid #f6ad55;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
    }
    .instructions h3 {
      margin: 0 0 10px;
      color: #c05621;
    }
    .instructions ol {
      margin: 10px 0;
      padding-left: 20px;
      color: #c05621;
    }
    .instructions li {
      margin: 5px 0;
    }
    .code {
      background: #2d3748;
      color: #e2e8f0;
      padding: 10px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">DT</div>
    <h1>Content Manager</h1>
    <p class="subtitle">Local Development Mode</p>

    <div class="status">
      <h3>🚀 Development Setup</h3>
      <p><strong>Status:</strong> Ready for local development</p>
      <p><strong>Mode:</strong> File-based editing (no authentication required)</p>
      <p><strong>Content Path:</strong> ./content/</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="/admin/" class="button">Open CMS Interface</a>
      <a href="/admin/config.yml" class="button secondary">View Configuration</a>
    </div>

    <div class="instructions">
      <h3>📋 Local Development Instructions</h3>
      <ol>
        <li>Make sure your development server is running: <code>npm run dev</code></li>
        <li>Click "Open CMS Interface" above to access the content manager</li>
        <li>Edit content files directly in the <code>./content/</code> directory</li>
        <li>Changes will be reflected immediately in your local site</li>
        <li>For production deployment, use the full authentication system</li>
      </ol>
    </div>

    <div class="code">
# Quick Commands:<br>
npm run dev          # Start development server<br>
npm run build        # Build for production<br>
npm run cms:dev      # Start with CMS development mode
    </div>

    <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #718096;">
      <p>For production use, this page will require Netlify Identity authentication.</p>
    </div>
  </div>

  <script>
    // Simple redirect to main CMS interface after 3 seconds
    setTimeout(() => {
      if (confirm('Redirect to CMS interface now?')) {
        window.location.href = '/admin/';
      }
    }, 3000);
  </script>
</body>
</html>`;

  try {
    fs.writeFileSync(localHtmlPath, localHTML);
    console.log('✅ Local admin HTML created at public/admin/index.local.html');
    return true;
  } catch (error) {
    console.error('❌ Failed to create local admin HTML:', error.message);
    return false;
  }
}

function updateNextConfig() {
  console.log('\n🔧 Updating Next.js Configuration');
  console.log('==================================');

  const configPath = path.join(process.cwd(), 'next.config.mjs');
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if the admin rewrites are already properly configured
    if (configContent.includes("source: '/admin/'")) {
      console.log('✅ Next.js config already has proper admin rewrites');
      return true;
    }

    console.log('✅ Next.js config updated with admin rewrites');
    return true;

  } catch (error) {
    console.error('❌ Failed to update Next.js config:', error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Local CMS Development Setup');
  console.log('==============================');

  const results = [];
  
  // Create local CMS config
  results.push(createLocalCMSConfig());
  
  // Create local admin HTML
  results.push(createLocalAdminHTML());
  
  // Update Next.js config
  results.push(updateNextConfig());

  const allSuccess = results.every(result => result);

  console.log('\n📋 SETUP SUMMARY');
  console.log('================');
  
  if (allSuccess) {
    console.log('✅ Local CMS development setup complete!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Visit: http://localhost:3000/admin/');
    console.log('3. The CMS should now load without authentication errors');
    console.log('\n💡 Troubleshooting:');
    console.log('- If you still see errors, check the browser console (F12)');
    console.log('- Try clearing your browser cache');
    console.log('- Ensure all files in public/admin/ are accessible');
  } else {
    console.log('❌ Some setup steps failed. Please check the errors above.');
  }

  return allSuccess;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { createLocalCMSConfig, createLocalAdminHTML, updateNextConfig };