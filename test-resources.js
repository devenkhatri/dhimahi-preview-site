// Simple test script to verify resource functions
const { getAllResources, getFeaturedResource, getResourcesByType } = require('./src/lib/content.ts');

console.log('Testing resource functions...\n');

try {
  // Test getAllResources
  console.log('1. Testing getAllResources():');
  const allResources = getAllResources();
  console.log(`Found ${allResources.length} resources`);
  if (allResources.length > 0) {
    console.log('First resource:', allResources[0].title);
  }
  console.log('');

  // Test getFeaturedResource
  console.log('2. Testing getFeaturedResource():');
  const featuredResource = getFeaturedResource();
  if (featuredResource) {
    console.log('Featured resource:', featuredResource.title);
    console.log('Featured flag:', featuredResource.featured);
  } else {
    console.log('No featured resource found');
  }
  console.log('');

  // Test getResourcesByType
  console.log('3. Testing getResourcesByType("checklist"):');
  const checklists = getResourcesByType('checklist');
  console.log(`Found ${checklists.length} checklist resources`);
  checklists.forEach(resource => {
    console.log(`- ${resource.title} (${resource.type})`);
  });
  console.log('');

  console.log('All tests completed successfully!');
} catch (error) {
  console.error('Test failed:', error);
}