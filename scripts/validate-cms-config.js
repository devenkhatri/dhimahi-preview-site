#!/usr/bin/env node

/**
 * Validate CMS configuration YAML syntax
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function validateYamlFile(filePath) {
  console.log(`🔍 Validating YAML file: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`📄 File size: ${content.length} characters`);
    
    // Try to parse the YAML
    const parsed = yaml.load(content);
    console.log('✅ YAML syntax is valid');
    
    // Check for required top-level properties
    const requiredProps = ['backend', 'collections'];
    const missingProps = requiredProps.filter(prop => !parsed[prop]);
    
    if (missingProps.length > 0) {
      console.log(`❌ Missing required properties: ${missingProps.join(', ')}`);
      return false;
    }
    
    console.log('✅ Required properties present');
    
    // Check collections structure
    if (!Array.isArray(parsed.collections)) {
      console.log('❌ Collections must be an array');
      return false;
    }
    
    console.log(`✅ Found ${parsed.collections.length} collections`);
    
    // Validate each collection
    parsed.collections.forEach((collection, index) => {
      if (!collection.name) {
        console.log(`❌ Collection ${index} missing name`);
        return false;
      }
      console.log(`  ✅ Collection: ${collection.name}`);
    });
    
    return true;
    
  } catch (error) {
    console.log('❌ YAML parsing error:');
    console.log(`   Error: ${error.message}`);
    
    if (error.mark) {
      console.log(`   Line: ${error.mark.line + 1}`);
      console.log(`   Column: ${error.mark.column + 1}`);
      
      // Show context around the error
      const lines = fs.readFileSync(filePath, 'utf8').split('\n');
      const errorLine = error.mark.line;
      const start = Math.max(0, errorLine - 2);
      const end = Math.min(lines.length, errorLine + 3);
      
      console.log('\n   Context:');
      for (let i = start; i < end; i++) {
        const marker = i === errorLine ? ' >>> ' : '     ';
        console.log(`${marker}${i + 1}: ${lines[i]}`);
      }
    }
    
    return false;
  }
}

function main() {
  const configPath = path.join(__dirname, '..', 'public', 'admin', 'config.yml');
  
  console.log('🚀 CMS Configuration Validator');
  console.log('==============================');
  
  if (!fs.existsSync(configPath)) {
    console.log(`❌ Config file not found: ${configPath}`);
    return false;
  }
  
  const isValid = validateYamlFile(configPath);
  
  if (isValid) {
    console.log('\n🎉 CMS configuration is valid!');
    console.log('You can now access the admin interface at /admin/');
  } else {
    console.log('\n💡 Suggestions:');
    console.log('1. Check for unclosed quotes or brackets');
    console.log('2. Verify proper YAML indentation (use spaces, not tabs)');
    console.log('3. Ensure all strings with special characters are quoted');
    console.log('4. Check for trailing commas or invalid characters');
  }
  
  return isValid;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { validateYamlFile };