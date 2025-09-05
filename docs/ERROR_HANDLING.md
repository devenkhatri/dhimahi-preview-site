# CMS Error Handling & Fallback System

This document describes the comprehensive error handling and fallback content system implemented for the Decap CMS integration.

## Overview

The error handling system provides multiple layers of protection to ensure the website remains functional even when CMS content is unavailable, corrupted, or invalid.

## Components

### 1. Content Validation (`src/lib/cms-validation.ts`)

Provides Zod-based validation schemas for all content types:

- **HomepageContentSchema**: Validates homepage structure and required fields
- **ServiceDataSchema**: Validates service page content
- **CaseStudySchema**: Validates case study data
- **InsightSchema**: Validates blog/insight articles
- **AboutContentSchema**: Validates about page content

#### Usage Example:
```typescript
import { validateHomepageContent } from '@/lib/cms-validation';

const validation = validateHomepageContent(data);
if (!validation.success) {
  console.error('Validation errors:', validation.errors);
  // Use fallback content
}
```

### 2. Fallback Content (`src/lib/cms-fallbacks.ts`)

Provides complete fallback content for all content types:

- `getDefaultHomepageContent()`: Complete homepage fallback
- `getDefaultServiceData(slug)`: Service page fallbacks
- `getDefaultCaseStudyData(slug)`: Case study fallbacks
- `getDefaultInsightData(slug)`: Insight article fallbacks
- `getDefaultAboutContent()`: About page fallback

#### Features:
- Complete, production-ready content
- Maintains website functionality during CMS issues
- Contextual error messages and logging
- Graceful degradation

### 3. Enhanced CMS Content Functions (`src/lib/cms-content.ts`)

All CMS content functions now include:

- **File existence checks**: Verify files exist before reading
- **YAML/Markdown parsing error handling**: Graceful handling of malformed content
- **Content validation**: Automatic validation with fallback on failure
- **Detailed error logging**: Comprehensive error context and debugging info
- **Null safety**: Safe property access with fallback values

#### Error Handling Flow:
1. Check if content file exists
2. Read and parse file content
3. Transform data to expected format
4. Validate transformed data
5. Return validated data or fallback on any error

### 4. React Error Boundaries (`src/components/ErrorBoundary.tsx`)

Multiple error boundary components for different use cases:

#### `ErrorBoundary`
General-purpose error boundary with customizable fallback UI.

```tsx
<ErrorBoundary fallback={<CustomErrorUI />} onError={handleError}>
  <YourComponent />
</ErrorBoundary>
```

#### `ContentErrorBoundary`
Specialized for content sections with user-friendly messaging.

```tsx
<ContentErrorBoundary contentType="homepage" onError={logError}>
  <HomepageContent />
</ContentErrorBoundary>
```

#### `CMSContentErrorBoundary`
Optimized for CMS content with minimal visual impact.

```tsx
<CMSContentErrorBoundary sectionName="hero" showFallback={true}>
  <HeroSection />
</CMSContentErrorBoundary>
```

### 5. Content Error Handling Hooks (`src/hooks/useContentErrorHandler.ts`)

React hooks for managing content errors:

#### `useContentErrorHandler`
Centralized error state management with automatic cleanup.

```tsx
const { logError, clearErrors, hasErrors, errors } = useContentErrorHandler();
```

#### `useContentWithErrorHandling`
Automatic content loading with error recovery.

```tsx
const { content, loading, error, retry } = useContentWithErrorHandling(
  () => getCMSHomepageContent(),
  getDefaultHomepageContent(),
  'homepage'
);
```

### 6. Build-time Validation (`scripts/validate-cms-build.js`)

Comprehensive validation script that runs before builds:

- **Content Structure Validation**: Ensures all required fields are present
- **Data Type Validation**: Verifies correct data types
- **Reference Validation**: Checks internal content references
- **Asset Validation**: Verifies referenced images and files exist

#### Usage:
```bash
npm run validate:content        # Run validation
npm run build                   # Includes validation
npm run build:skip-validation   # Skip validation (emergency builds)
```

## Error Types and Handling

### 1. File System Errors
- **Missing files**: Use fallback content
- **Permission errors**: Log error, use fallback
- **Directory not found**: Create with defaults or use fallback

### 2. Content Parsing Errors
- **Invalid YAML**: Log parsing error, use fallback
- **Malformed Markdown**: Process what's possible, fallback for rest
- **Encoding issues**: Attempt recovery, fallback if needed

### 3. Validation Errors
- **Missing required fields**: Use fallback values
- **Invalid data types**: Transform or use defaults
- **Business rule violations**: Log warning, use corrected data

### 4. Runtime Errors
- **Component crashes**: Error boundary catches, shows fallback UI
- **Network issues**: Retry logic with exponential backoff
- **Memory issues**: Cleanup and graceful degradation

## Logging and Monitoring

### Development Mode
- Detailed console logging with context
- Validation error details
- Component stack traces
- Performance warnings

### Production Mode
- Error aggregation and batching
- Critical error alerts
- Performance metrics
- User impact tracking

### Log Levels
- **ERROR**: Critical issues requiring immediate attention
- **WARN**: Issues that don't break functionality
- **INFO**: Normal operation events
- **DEBUG**: Detailed debugging information (dev only)

## Configuration

### Environment Variables
```env
# Error handling configuration
NEXT_PUBLIC_ERROR_REPORTING=true
NEXT_PUBLIC_FALLBACK_MODE=graceful
NEXT_PUBLIC_VALIDATION_STRICT=false

# Development settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG_ERRORS=true
```

### Build Configuration
```json
{
  "scripts": {
    "build": "npm run validate:content && next build",
    "validate:content": "node scripts/validate-cms-build.js"
  }
}
```

## Best Practices

### 1. Content Creation
- Always provide fallback content for new content types
- Include comprehensive validation schemas
- Test with invalid/missing data scenarios

### 2. Component Development
- Wrap content components in appropriate error boundaries
- Use content hooks for automatic error handling
- Provide meaningful fallback UI

### 3. Error Recovery
- Implement retry mechanisms for transient errors
- Provide user actions for error recovery
- Maintain functionality during partial failures

### 4. Testing
- Test all error scenarios in development
- Validate fallback content completeness
- Verify error boundary behavior

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check content validation
npm run validate:content

# Skip validation for emergency builds
npm run build:skip-validation
```

#### Runtime Errors
1. Check browser console for detailed errors
2. Verify content file structure
3. Test with fallback content
4. Check error boundary implementation

#### Content Not Loading
1. Verify file paths and permissions
2. Check YAML/Markdown syntax
3. Validate content against schema
4. Test fallback mechanisms

### Debug Mode
Enable detailed debugging:
```typescript
// In development
localStorage.setItem('debug-cms-errors', 'true');
```

## Performance Impact

The error handling system is designed for minimal performance impact:

- **Validation**: Only runs when content changes
- **Fallbacks**: Pre-computed and cached
- **Error Boundaries**: No overhead when no errors occur
- **Logging**: Batched and throttled in production

## Future Enhancements

- Integration with external error tracking services
- Automated content health monitoring
- Self-healing content recovery
- Advanced analytics and reporting
- A/B testing for fallback content effectiveness