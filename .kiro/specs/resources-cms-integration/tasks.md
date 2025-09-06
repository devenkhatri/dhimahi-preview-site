# Implementation Plan

- [x] 1. Set up content directory structure and TypeScript interfaces
  - Create `content/resources/` directory for resource markdown files
  - Define Resource interface in TypeScript with all required fields
  - Create type definitions for resource-related data structures
  - _Requirements: 1.1, 4.1_

- [x] 2. Extend Decap CMS configuration with Resources collection
  - Add Resources collection to `public/admin/config.yml`
  - Configure all required fields (title, description, type, fileSize, pages, downloadUrl, featured, order)
  - Set up proper validation rules and field constraints
  - Configure slug generation and file organization
  - _Requirements: 1.1, 1.2, 6.1, 6.2_

- [x] 3. Implement content library functions for resource management
  - Add `getAllResources()` function to `src/lib/content.ts`
  - Implement `getFeaturedResource()` with fallback logic
  - Create `getResourcesByType()` for filtering functionality


- [x] 4. Create and populate initial resource content files
  - Convert existing hardcoded resources to markdown files in `content/resources/`
  - Ensure all resource metadata matches the defined schema
  - Set appropriate featured flags and display orders
  
- [x] 5. Update ResourceDownloadForm component interface
  - Modify Resource interface to match new CMS data structure
  - Ensure backward compatibility with existing functionality
  - Update type definitions and prop interfaces
  
- [x] 6. Refactor resources page to use dynamic content loading
  - Replace hardcoded FEATURED_RESOURCES array with dynamic content fetching
  - Implement resource loading and sorting logic
  - Update featured resource selection to use CMS data
  - Maintain existing layout and responsive design
  - _Requirements: 3.1, 4.1, 5.1, 6.3, 6.4_

- [x] 8. Add resource ordering and filtering functionality
  - Implement sorting by display order and publication date
  - Handle duplicate order numbers with date-based fallback
  - Add resource type filtering capabilities
