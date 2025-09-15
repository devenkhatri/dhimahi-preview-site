# Error Handling and Validation System

This document describes the comprehensive error handling and validation system implemented for CMS settings in the Dhīmahi Technolabs website.

## Overview

The system provides robust validation, error logging, and fallback mechanisms to ensure the website remains functional even when CMS data is invalid or unavailable.

## Components

### 1. Validation Module (`src/lib/validation.ts`)

Provides comprehensive validation functions for all types of data used in CMS settings.

#### Email Validation
- **Function**: `validateEmail(email: string)`
- **Features**:
  - RFC 5322 compliant email validation
  - Length validation (max 254 characters)
  - Proper error messages
  - Case normalization (converts to lowercase)

```typescript
const result = validateEmail('user@example.com');
// Returns: { isValid: true, sanitized: 'user@example.com' }
```

#### Phone Number Validation
- **Function**: `validatePhone(phone: string)`
- **Features**:
  - International format support (+country code)
  - Domestic format support (10-15 digits)
  - Automatic cleaning of formatting characters
  - Flexible input handling

```typescript
const result = validatePhone('+91 99999 99999');
// Returns: { isValid: true, sanitized: '+919999999999' }
```

#### URL Validation
- **Function**: `validateUrl(url: string)`
- **Features**:
  - Protocol validation (HTTP/HTTPS only)
  - Hostname validation
  - Security checks (no localhost/local IPs)
  - URL normalization

```typescript
const result = validateUrl('https://example.com');
// Returns: { isValid: true, sanitized: 'https://example.com/' }
```

#### Social Media URL Validation
- **Function**: `validateSocialMediaUrl(platform: string, url: string)`
- **Features**:
  - Platform-specific domain validation
  - Supports: LinkedIn, Twitter/X, Facebook, Instagram, YouTube, TikTok, Pinterest, Snapchat
  - URL format validation

```typescript
const result = validateSocialMediaUrl('linkedin', 'https://linkedin.com/company/test');
// Returns: { isValid: true, sanitized: 'https://linkedin.com/company/test' }
```

#### Other Validation Functions
- `validateBusinessHours(hours: string)` - Business hours format validation
- `validateTimezone(timezone: string)` - IANA timezone validation
- `validateStringArray(arr: any, fieldName: string)` - Array validation with length constraints
- `validateYear(year: any)` - Year validation (1800 to current+10)
- `validateEmployeeCount(count: string)` - Employee count format validation

### 2. Error Logging System (`src/lib/error-logging.ts`)

Provides structured logging with different severity levels and contextual information.

#### Log Levels
- **ERROR**: Critical issues that prevent normal operation
- **WARN**: Issues that don't break functionality but should be addressed
- **INFO**: General information about system operations
- **DEBUG**: Detailed information for debugging

#### Features
- **Structured Logging**: Each log entry includes timestamp, level, message, context, and optional error
- **Context Tracking**: Logs include component, function, field, and value information
- **Memory Management**: Automatically limits stored logs to prevent memory issues
- **Filtering**: Retrieve logs by level, time range, or count
- **Error Summary**: Get aggregated error statistics

#### Usage Examples

```typescript
import { settingsLogger } from '../lib/error-logging';

// Log validation failure
settingsLogger.validationFailure('email', 'invalid-email', 'Invalid email format');

// Log fallback usage
settingsLogger.fallbackUsed('companyName', undefined, 'Default Company', 'Missing value');

// Log CMS load failure
settingsLogger.cmsLoadFailure(error, '/path/to/settings.yml');

// Get error summary
const summary = settingsLogger.getErrorSummary();
console.log(`Errors: ${summary.totalErrors}, Warnings: ${summary.totalWarnings}`);
```

### 3. Enhanced Settings Loader (`src/lib/settings.ts`)

The settings loader has been enhanced with comprehensive error handling and validation.

#### Features
- **Multi-layer Fallback**: CMS → Legacy fields → Hardcoded defaults
- **Comprehensive Validation**: All fields are validated using the validation module
- **Error Logging**: All issues are logged with appropriate context
- **Health Monitoring**: System health status tracking
- **Cache Management**: Efficient caching with proper invalidation

#### Fallback Chain

1. **Primary**: Load from CMS (`content/settings/general.yml`)
2. **Secondary**: Use legacy field structure for backward compatibility
3. **Tertiary**: Use hardcoded default values

#### Error Scenarios Handled

1. **File Read Errors**: File not found, permission issues, etc.
2. **YAML Parse Errors**: Invalid YAML syntax, malformed content
3. **Data Structure Errors**: Non-object data, missing required fields
4. **Validation Errors**: Invalid email formats, URLs, phone numbers, etc.
5. **Type Errors**: Unexpected data types, null/undefined values

#### Health Monitoring

```typescript
import { getSettingsHealth } from '../lib/settings';

const health = getSettingsHealth();
console.log(`Status: ${health.status}`); // 'healthy', 'degraded', or 'unhealthy'
console.log(`Source: ${health.source}`); // 'cms' or 'fallback'
console.log(`Errors: ${health.errors}, Warnings: ${health.warnings}`);
```

## Implementation Details

### Validation Process

1. **Input Sanitization**: Trim whitespace, normalize case where appropriate
2. **Type Checking**: Ensure correct data types
3. **Format Validation**: Use appropriate regex patterns or built-in validators
4. **Business Logic Validation**: Check ranges, constraints, and business rules
5. **Security Validation**: Prevent malicious input (XSS, injection, etc.)

### Error Handling Strategy

1. **Graceful Degradation**: System continues to function with fallback data
2. **Comprehensive Logging**: All issues are logged with context for debugging
3. **User Experience**: End users see consistent, working website regardless of CMS issues
4. **Developer Experience**: Clear error messages and debugging information

### Performance Considerations

- **Caching**: Settings are cached to avoid repeated file I/O
- **Lazy Validation**: Only validate fields that are actually used
- **Memory Management**: Log storage is limited to prevent memory leaks
- **Efficient Fallbacks**: Fallback data is pre-computed and cached

## Testing

The system includes comprehensive tests covering:

### Validation Tests (`src/__tests__/validation.test.ts`)
- All validation functions with valid and invalid inputs
- Edge cases and boundary conditions
- Error message accuracy
- Sanitization behavior

### Error Logging Tests (`src/__tests__/error-logging.test.ts`)
- Log level functionality
- Context tracking
- Memory management
- Filtering and retrieval
- Time-based filtering

### Settings Error Handling Tests (`src/__tests__/settings-error-handling.test.ts`)
- File read error scenarios
- YAML parse error scenarios
- Validation error scenarios
- Fallback mechanism testing
- Health monitoring
- Cache behavior

## Usage Guidelines

### For Developers

1. **Always Use Validation**: Use the validation functions for any user input or CMS data
2. **Log Appropriately**: Use the appropriate log level for different types of issues
3. **Handle Errors Gracefully**: Always provide fallback behavior
4. **Monitor Health**: Regularly check system health in production

### For Content Managers

1. **Validate Input**: Ensure all CMS data follows the expected formats
2. **Test Changes**: Test CMS changes in a staging environment
3. **Monitor Logs**: Check for validation warnings after making changes
4. **Use Proper Formats**: Follow the documented formats for emails, URLs, phone numbers, etc.

## Monitoring and Debugging

### Production Monitoring

```typescript
// Check system health
const health = getSettingsHealth();
if (health.status !== 'healthy') {
  // Alert monitoring system
  console.warn('Settings system is not healthy:', health);
}

// Get recent errors
const recentErrors = settingsLogger.getLogs('ERROR', 10);
if (recentErrors.length > 0) {
  // Send to monitoring service
  console.error('Recent settings errors:', recentErrors);
}
```

### Debugging

```typescript
// Get all logs for debugging
const allLogs = settingsLogger.getLogs();

// Get validation-specific logs
const validationLogs = settingsLogger.getLogs('WARN').filter(
  log => log.context?.component === 'SettingsValidator'
);

// Clear cache to force reload
clearSettingsCache();

// Get uncached settings for testing
const freshSettings = getGeneralSettingsUncached();
```

## Security Considerations

1. **Input Sanitization**: All inputs are sanitized to prevent XSS and injection attacks
2. **URL Validation**: URLs are validated to prevent malicious redirects
3. **Email Validation**: Prevents email header injection
4. **File Path Validation**: Prevents directory traversal attacks
5. **Error Information**: Error messages don't expose sensitive system information

## Future Enhancements

1. **Real-time Validation**: Add real-time validation in the CMS interface
2. **Automated Testing**: Add automated tests for CMS content validation
3. **Performance Metrics**: Add performance monitoring for validation operations
4. **Custom Validators**: Allow custom validation rules for specific use cases
5. **Integration Testing**: Add integration tests with actual CMS operations

## Conclusion

This comprehensive error handling and validation system ensures that the Dhīmahi Technolabs website remains robust, secure, and maintainable. It provides excellent developer experience with clear error messages and debugging tools, while ensuring end users always see a functional website regardless of CMS data quality.