# Implementation Plan

- [x] 1. Extend CMS schema with brand-related fields
  - Update `public/admin/config.yml` to include new brand, location, and contact sections
  - Add validation rules for email, phone, and URL fields
  - Maintain backward compatibility with existing general settings structure
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 2. Enhance TypeScript interfaces for brand settings
  - Create new interfaces for BrandSettings, LocationSettings, and ContactSettings
  - Update GeneralSettings interface to include nested brand objects
  - Add proper type definitions for all new fields
  - _Requirements: 5.1, 6.1_

- [x] 3. Implement enhanced settings loader with fallback logic
  - Update `src/lib/settings.ts` to handle new nested structure
  - Implement backward compatibility fallbacks to legacy fields
  - Add comprehensive error handling and logging
  - Create fallback chain: new structure → legacy structure → hardcoded defaults
  - _Requirements: 5.2, 6.1, 6.2, 6.3, 6.4_

- [x] 4. Update CMS content with brand information
  - Migrate existing hardcoded values to `content/settings/general.yml`
  - Add company name, tagline, and description to brand section
  - Configure location information including service areas
  - Set up contact information with primary and support emails
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1_

- [x] 5. Update Header component to use CMS brand settings
  - Replace COMPANY_NAME constant with CMS brand.companyName
  - Update tagline to use CMS brand.tagline
  - Ensure proper fallback handling for missing brand data
  - _Requirements: 1.3, 5.3_

- [x] 6. Update Footer component to use CMS contact and brand settings
  - Replace hardcoded company name with CMS brand.companyName
  - Update contact information to use CMS contact settings
  - Update address information to use CMS location.fullAddress
  - Ensure social media links use existing CMS socialMedia configuration
  - _Requirements: 1.4, 2.3, 2.4, 3.3, 4.4_

- [x] 7. Update About page to use CMS brand and location settings
  - Replace hardcoded company references with CMS brand.companyName
  - Update location references to use CMS location.primaryLocation
  - Replace hardcoded email references with CMS contact.primaryEmail
  - Update company description to use CMS brand.description
  - _Requirements: 1.4, 2.4, 4.4_

- [x] 8. Remove hardcoded constants and update imports
  - Remove COMPANY_NAME, EMAIL, PHONE, CITY_LINE from `src/lib/constants.ts`
  - Update all component imports to use settings instead of constants
  - Clean up unused constant imports across the codebase
  - _Requirements: 5.1, 5.2_

- [x] 9. Add comprehensive error handling and validation
  - Implement validation for email addresses, phone numbers, and URLs
  - Add error logging for CMS load failures and validation errors
  - Create robust fallback mechanisms for all brand-related data
  - Add warning logs when fallback data is used
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11. Update CMS configuration validation and user interface
  - Add field validation patterns for email, phone, and URL inputs
  - Configure proper hints and help text for new brand fields
  - Set up required field validation for critical brand information
  - Test CMS interface for editing new brand-related fields
  - _Requirements: 1.1, 2.1, 3.1, 4.1_
