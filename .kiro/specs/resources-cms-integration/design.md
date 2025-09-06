# Design Document

## Overview

This design outlines the transformation of the hardcoded resources system into a dynamic CMS-driven solution. The implementation will create a new "Resources" collection in the existing Decap CMS, establish a content structure for resource management, and modify the resources page to dynamically load content from markdown files instead of hardcoded arrays.

The design maintains backward compatibility with the existing ResourceDownloadForm component while enabling content managers to add, edit, and organize resources through the CMS interface. The solution leverages the existing content management patterns established in the codebase.

## Architecture

### Content Management Layer
- **Decap CMS Integration**: Extend the existing `public/admin/config.yml` with a new "Resources" collection
- **File-based Storage**: Resources stored as markdown files in `content/resources/` directory
- **Frontmatter Schema**: Structured metadata for each resource including title, description, type, file information, and display settings

### Data Access Layer
- **Content Library Extension**: Add resource-specific functions to `src/lib/content.ts`
- **Type Definitions**: Create TypeScript interfaces for resource data structure
- **Content Validation**: Implement fallback handling for missing or malformed resource data

### Presentation Layer
- **Dynamic Resource Loading**: Modify `src/app/resources/page.tsx` to fetch resources from content files
- **Component Compatibility**: Maintain existing ResourceDownloadForm interface and functionality
- **Responsive Layout**: Preserve current grid layout and responsive behavior

## Components and Interfaces

### Resource Data Structure
```typescript
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'checklist' | 'guide' | 'template' | 'calculator';
  fileSize: string;
  pages: number;
  downloadUrl: string;
  featured: boolean;
  order: number;
  publishDate: string;
  tags?: string[];
  slug: string;
}
```

### CMS Collection Schema
The Resources collection will include the following fields:
- **Basic Information**: Title, description, excerpt
- **Resource Metadata**: Type, file size, page count, download URL
- **Display Settings**: Featured flag, display order, publication date
- **Organization**: Tags for categorization and filtering
- **SEO**: Slug generation and meta information

### Content Library Functions
```typescript
// New functions to add to src/lib/content.ts
export function getAllResources(): Resource[]
export function getFeaturedResource(): Resource | null
export function getResourceBySlug(slug: string): Resource | null
export function getResourcesByType(type: string): Resource[]
```

## Data Models

### Resource Markdown File Structure
```markdown
---
title: "Digital Transformation Checklist for SMEs"
description: "A comprehensive 25-point checklist to modernize your business with AI, automation, and smart IT solutions."
type: "checklist"
fileSize: "2.1 MB"
pages: 12
downloadUrl: "/resources/digital-transformation-checklist.pdf"
featured: true
order: 1
publishDate: "2024-01-15"
tags: ["digital-transformation", "sme", "checklist"]
slug: "digital-transformation-checklist"
---

# Resource Content (Optional)
Additional content or description can be added here if needed for future enhancements.
```

### CMS Configuration Extension
The Decap CMS configuration will be extended with a new collection:
- Collection name: "resources"
- Folder: "content/resources"
- Slug pattern: "{{slug}}"
- Create/edit capabilities for content managers
- Preview templates for resource display

## Error Handling

### Content Validation
- **Missing Resources**: Display appropriate fallback message when no resources are available
- **Malformed Data**: Graceful handling of missing or invalid resource fields
- **File Access Errors**: Fallback to empty state with user-friendly error messages
- **CMS Connectivity**: Maintain functionality even if CMS is temporarily unavailable

### Fallback Strategies
- **Default Values**: Provide sensible defaults for optional fields (file size, page count)
- **Featured Resource**: Automatic selection of first resource if no featured resource is set
- **Ordering**: Default to publication date sorting if order values are missing or duplicate

### User Experience
- **Loading States**: Implement loading indicators during resource fetching
- **Error Boundaries**: Prevent resource loading errors from breaking the entire page
- **Progressive Enhancement**: Ensure core functionality works even with JavaScript disabled

## Testing Strategy

### Unit Testing
- **Content Library Functions**: Test resource fetching, filtering, and sorting logic
- **Data Validation**: Verify proper handling of malformed or missing resource data
- **Type Safety**: Ensure TypeScript interfaces match actual data structure

### Integration Testing
- **CMS Integration**: Verify resources can be created, edited, and deleted through CMS
- **Page Rendering**: Test dynamic resource loading and display on resources page
- **Form Functionality**: Ensure ResourceDownloadForm continues to work with CMS-driven data

### Content Testing
- **Resource Creation**: Test complete workflow from CMS creation to website display
- **Featured Resource Logic**: Verify featured resource selection and fallback behavior
- **Ordering and Filtering**: Test resource sorting and organization functionality

### Performance Testing
- **Load Times**: Ensure dynamic loading doesn't significantly impact page performance
- **Content Scaling**: Test performance with varying numbers of resources (10, 50, 100+)
- **Caching Strategy**: Implement appropriate caching for resource data if needed

## Migration Strategy

### Phase 1: CMS Setup
1. Add Resources collection to Decap CMS configuration
2. Create content directory structure
3. Implement basic content library functions

### Phase 2: Content Migration
1. Convert existing hardcoded resources to markdown files
2. Ensure all resource metadata is properly structured
3. Test CMS functionality with migrated content

### Phase 3: Page Integration
1. Modify resources page to use dynamic content loading
2. Update component interfaces as needed
3. Implement error handling and fallbacks

### Phase 4: Testing and Optimization
1. Comprehensive testing of all functionality
2. Performance optimization if needed
3. Content manager training and documentation

## Security Considerations

### Content Validation
- **Input Sanitization**: Ensure all CMS inputs are properly sanitized
- **File Upload Security**: Validate resource file uploads and prevent malicious files
- **URL Validation**: Verify download URLs are safe and accessible

### Access Control
- **CMS Permissions**: Leverage existing Decap CMS role-based access control
- **Content Publishing**: Ensure only authorized users can publish resources
- **File Management**: Secure handling of resource files and downloads

### Data Integrity
- **Backup Strategy**: Ensure resource content is included in backup procedures
- **Version Control**: Leverage Git-based content management for change tracking
- **Content Recovery**: Implement procedures for recovering from content corruption or loss