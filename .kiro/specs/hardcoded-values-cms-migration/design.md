# Design Document

## Overview

This design outlines the migration of hardcoded brand-related values from the constants file and components to the CMS (Content Management System). The solution will extend the existing CMS settings structure to include comprehensive brand information while maintaining backward compatibility and robust fallback mechanisms.

## Architecture

### Current State Analysis

The application currently has:
- Hardcoded constants in `src/lib/constants.ts` (COMPANY_NAME, EMAIL, PHONE, CITY_LINE)
- Partial CMS settings in `content/settings/general.yml` 
- Settings loader in `src/lib/settings.ts` with basic fallback
- Components directly importing constants or using settings inconsistently

### Target Architecture

```
CMS Settings (content/settings/general.yml)
    ↓
Settings Loader (src/lib/settings.ts)
    ↓
Enhanced Brand Settings Interface
    ↓
Components (Header, Footer, About, etc.)
```

## Components and Interfaces

### Enhanced Settings Interface

```typescript
export interface BrandSettings {
  companyName: string;
  tagline: string;
  description: string;
}

export interface LocationSettings {
  primaryLocation: string;
  serviceAreas: string[];
  fullAddress: string;
}

export interface ContactSettings {
  primaryEmail: string;
  supportEmail?: string;
  phone?: string;
  businessHours?: string;
}

export interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  brand: BrandSettings;
  location: LocationSettings;
  contact: ContactSettings;
  socialMedia: SocialMediaLinks;
}
```

### CMS Schema Extension

The existing CMS configuration will be extended to include:

1. **Brand Information Section**
   - Company name
   - Tagline/slogan
   - Company description

2. **Location Information Section**
   - Primary location (city/region)
   - Service areas
   - Full business address

3. **Contact Information Section**
   - Primary email
   - Support email (optional)
   - Phone number
   - Business hours (optional)

4. **Enhanced Social Media Section**
   - All existing platforms
   - Platform-specific usernames/handles

## Data Models

### CMS Content Structure

```yaml
# content/settings/general.yml
siteTitle: "Company Name - Tagline"
siteDescription: "SEO description"

brand:
  companyName: "Dhīmahi Technolabs"
  tagline: "Future-Ready IT Solutions"
  description: "Transform your SME with AI automation, digital marketing, and smart IT strategy."

location:
  primaryLocation: "Ahmedabad & Gandhinagar"
  serviceAreas:
    - "Ahmedabad"
    - "Gandhinagar"
    - "Gujarat"
  fullAddress: |
    Dhīmahi Technolabs
    Gandhinagar, Gujarat, India

contact:
  primaryEmail: "hello@dhimahitechnolabs.com"
  supportEmail: "support@dhimahitechnolabs.com"
  phone: "+91 99999 99999"
  businessHours: "Mon-Fri 9:00 AM - 6:00 PM IST"

socialMedia:
  linkedin: "https://linkedin.com/company/dhimahi-technolabs"
  twitter: "https://x.com/dhimahitechno"
  facebook: "https://www.facebook.com/dhimahi.technolabs"
  instagram: "https://www.instagram.com/dhimahi.technolabs/"
  youtube: "https://youtube.com/@dhimahitechnolabs"
```

### Migration Strategy

1. **Backward Compatibility**: Maintain existing field structure while adding new nested objects
2. **Gradual Migration**: Components can be updated incrementally
3. **Fallback Chain**: New structure → Legacy structure → Hardcoded defaults

## Error Handling

### Fallback Mechanism

```typescript
export function getGeneralSettings(): GeneralSettings {
  try {
    const settings = loadFromCMS();
    return validateAndEnhanceSettings(settings);
  } catch (error) {
    logError('CMS settings load failed', error);
    return getFallbackSettings();
  }
}

function validateAndEnhanceSettings(settings: any): GeneralSettings {
  return {
    // New nested structure with fallbacks to legacy fields
    brand: {
      companyName: settings.brand?.companyName || extractCompanyName(settings.siteTitle) || 'Dhīmahi Technolabs',
      tagline: settings.brand?.tagline || 'Future-Ready IT Solutions',
      description: settings.brand?.description || settings.siteDescription || 'Professional IT services'
    },
    location: {
      primaryLocation: settings.location?.primaryLocation || 'Ahmedabad & Gandhinagar',
      serviceAreas: settings.location?.serviceAreas || ['Ahmedabad', 'Gandhinagar'],
      fullAddress: settings.location?.fullAddress || settings.address || 'Gujarat, India'
    },
    contact: {
      primaryEmail: settings.contact?.primaryEmail || settings.contactEmail || 'hello@dhimahitechnolabs.com',
      supportEmail: settings.contact?.supportEmail,
      phone: settings.contact?.phone || settings.phone,
      businessHours: settings.contact?.businessHours
    },
    // ... existing fields
  };
}
```

### Error Logging

- CMS load failures
- Validation errors
- Fallback usage tracking
- Missing field warnings

## Testing Strategy

### Unit Tests

1. **Settings Loader Tests**
   - Valid CMS data loading
   - Invalid/missing CMS data handling
   - Fallback mechanism validation
   - Backward compatibility verification

2. **Component Integration Tests**
   - Brand information display
   - Contact information rendering
   - Social media links functionality
   - Location information accuracy

### Integration Tests

1. **CMS Integration**
   - Settings update through CMS interface
   - Real-time content updates
   - Validation error handling

2. **Fallback Testing**
   - CMS unavailable scenarios
   - Partial data scenarios
   - Invalid data handling

### Migration Testing

1. **Before/After Comparison**
   - Visual regression testing
   - Content accuracy verification
   - Performance impact assessment

2. **Rollback Testing**
   - Ability to revert changes
   - Data integrity maintenance
   - Component functionality preservation

## Implementation Phases

### Phase 1: CMS Schema Extension
- Update CMS configuration with new brand fields
- Maintain backward compatibility
- Add validation rules

### Phase 2: Settings Loader Enhancement
- Extend TypeScript interfaces
- Implement enhanced fallback logic
- Add comprehensive error handling

### Phase 3: Component Migration
- Update components to use new settings structure
- Remove hardcoded constants usage
- Implement graceful degradation

### Phase 4: Constants Cleanup
- Remove unused constants
- Update imports across codebase
- Clean up legacy code

### Phase 5: Testing & Validation
- Comprehensive testing suite
- Performance optimization
- Documentation updates

## Security Considerations

- Input validation for all CMS fields
- XSS prevention for user-editable content
- Email address validation
- URL validation for social media links
- Phone number format validation

## Performance Considerations

- Settings caching mechanism
- Lazy loading of non-critical settings
- Minimal impact on page load times
- Efficient fallback processing