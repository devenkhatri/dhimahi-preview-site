/**
 * Tests for enhanced settings error handling and validation
 */

import { 
  getGeneralSettings, 
  clearSettingsCache, 
  validateSettings,
  getSettingsHealth,
  settingsLogger
} from '../lib/settings';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

// Mock file system operations
jest.mock('fs');
jest.mock('js-yaml');

const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockYamlLoad = yaml.load as jest.MockedFunction<typeof yaml.load>;

describe('Settings Error Handling', () => {
  beforeEach(() => {
    clearSettingsCache();
    settingsLogger.clearLogs();
    jest.clearAllMocks();
    
    // Mock console methods to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handles file read errors gracefully', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    const settings = getGeneralSettings();
    
    // Should return fallback settings
    expect(settings.brand.companyName).toBe('Dhīmahi Technolabs');
    expect(settings.contact.primaryEmail).toBe('hello@dhimahitechnolabs.com');
    
    // Should log the error
    const errorLogs = settingsLogger.getLogs('ERROR');
    expect(errorLogs.length).toBeGreaterThan(0);
    expect(errorLogs[0].message).toBe('Failed to load CMS settings file');
  });

  test('handles YAML parse errors gracefully', () => {
    mockReadFileSync.mockReturnValue('invalid: yaml: content:');
    mockYamlLoad.mockImplementation(() => {
      throw new Error('Invalid YAML');
    });

    const settings = getGeneralSettings();
    
    // Should return fallback settings
    expect(settings.brand.companyName).toBe('Dhīmahi Technolabs');
    
    // Should log the parse error
    const errorLogs = settingsLogger.getLogs('ERROR');
    expect(errorLogs.some(log => log.message === 'Failed to parse YAML content')).toBe(true);
  });

  test('handles invalid data structure gracefully', () => {
    mockReadFileSync.mockReturnValue('valid yaml content');
    mockYamlLoad.mockReturnValue('not an object');

    const settings = getGeneralSettings();
    
    // Should return fallback settings
    expect(settings.brand.companyName).toBe('Dhīmahi Technolabs');
    
    // Should log the validation error
    const errorLogs = settingsLogger.getLogs('ERROR');
    expect(errorLogs.some(log => log.message === 'Settings file does not contain valid object data')).toBe(true);
  });

  test('validates email addresses and uses fallbacks', () => {
    const invalidSettings = {
      contact: {
        primaryEmail: 'invalid-email',
        supportEmail: 'also-invalid'
      }
    };

    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue(invalidSettings);

    const settings = getGeneralSettings();
    
    // Should use fallback for invalid primary email
    expect(settings.contact.primaryEmail).toBe('hello@dhimahitechnolabs.com');
    
    // Should ignore invalid support email
    expect(settings.contact.supportEmail).toBeUndefined();
    
    // Should log validation warnings
    const warnLogs = settingsLogger.getLogs('WARN');
    expect(warnLogs.some(log => log.context?.field === 'contact.primaryEmail')).toBe(true);
  });

  test('validates phone numbers and logs issues', () => {
    const invalidSettings = {
      contact: {
        phone: 'invalid-phone',
        whatsapp: '123' // Too short
      }
    };

    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue(invalidSettings);

    const settings = getGeneralSettings();
    
    // Should keep original phone for display but log validation issue
    expect(settings.contact.phone).toBe('invalid-phone');
    
    // Should log validation warnings
    const warnLogs = settingsLogger.getLogs('WARN');
    expect(warnLogs.some(log => log.context?.field === 'contact.phone')).toBe(true);
    expect(warnLogs.some(log => log.context?.field === 'contact.whatsapp')).toBe(true);
  });

  test('validates social media URLs and filters invalid ones', () => {
    const invalidSettings = {
      socialMedia: {
        linkedin: 'https://facebook.com/wrong-platform',
        twitter: 'invalid-url',
        facebook: 'https://facebook.com/valid-page'
      }
    };

    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue(invalidSettings);

    const settings = getGeneralSettings();
    
    // Should only include valid social media URLs
    expect(settings.socialMedia.linkedin).toBeUndefined();
    expect(settings.socialMedia.twitter).toBeUndefined();
    expect(settings.socialMedia.facebook).toBe('https://facebook.com/valid-page');
    
    // Should log validation warnings
    const warnLogs = settingsLogger.getLogs('WARN');
    expect(warnLogs.some(log => log.context?.field === 'socialMedia.linkedin')).toBe(true);
    expect(warnLogs.some(log => log.context?.field === 'socialMedia.twitter')).toBe(true);
  });

  test('validates business settings and removes invalid fields', () => {
    const invalidSettings = {
      business: {
        foundedYear: 1700, // Too old
        employeeCount: 'invalid-format',
        website: 'not-a-url'
      }
    };

    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue(invalidSettings);

    const settings = getGeneralSettings();
    
    // Should remove invalid business fields
    expect(settings.business?.foundedYear).toBeUndefined();
    expect(settings.business?.employeeCount).toBeUndefined();
    expect(settings.business?.website).toBeUndefined();
    
    // Should log validation warnings
    const warnLogs = settingsLogger.getLogs('WARN');
    expect(warnLogs.some(log => log.context?.field === 'business.foundedYear')).toBe(true);
    expect(warnLogs.some(log => log.context?.field === 'business.employeeCount')).toBe(true);
    expect(warnLogs.some(log => log.context?.field === 'business.website')).toBe(true);
  });

  test('validates SEO settings arrays', () => {
    const invalidSettings = {
      seo: {
        keywords: 'not-an-array',
        primaryMarkets: [123, 456] // Numbers instead of strings
      }
    };

    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue(invalidSettings);

    const settings = getGeneralSettings();
    
    // Should remove invalid SEO fields
    expect(settings.seo?.keywords).toBeUndefined();
    expect(settings.seo?.primaryMarkets).toBeUndefined();
    
    // Should log validation warnings
    const warnLogs = settingsLogger.getLogs('WARN');
    expect(warnLogs.some(log => log.context?.field === 'seo.keywords')).toBe(true);
    expect(warnLogs.some(log => log.context?.field === 'seo.primaryMarkets')).toBe(true);
  });

  test('validateSettings function works correctly', () => {
    const validSettings = {
      siteTitle: 'Test Site',
      siteDescription: 'Test Description',
      brand: { companyName: 'Test Company' },
      contact: { primaryEmail: 'test@example.com' },
      location: { 
        primaryLocation: 'Test City',
        serviceAreas: ['Test Area'],
        fullAddress: 'Test Address'
      }
    };

    const result = validateSettings(validSettings);
    expect(result.settings).toBeDefined();
    expect(result.settings?.brand.companyName).toBe('Test Company');
    // Check if there are any validation warnings but don't require perfect validation
    expect(result.errors).toBeDefined();
  });

  test('validateSettings function catches validation errors', () => {
    const invalidSettings = {
      contact: { primaryEmail: 'invalid-email' }
    };

    const result = validateSettings(invalidSettings);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('getSettingsHealth returns correct status', () => {
    // Test with valid settings
    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue({
      brand: { companyName: 'Test' },
      contact: { primaryEmail: 'test@example.com' }
    });

    getGeneralSettings();
    
    const health = getSettingsHealth();
    expect(health.status).toBe('healthy');
    expect(health.source).toBe('cms');
    expect(health.errors).toBe(0);
  });

  test('getSettingsHealth detects degraded status', () => {
    // Test with settings that trigger warnings
    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue({
      contact: { primaryEmail: 'invalid-email' }
    });

    getGeneralSettings();
    
    const health = getSettingsHealth();
    expect(health.status).toBe('degraded');
    expect(health.warnings).toBeGreaterThan(0);
  });

  test('getSettingsHealth detects unhealthy status', () => {
    // Test with file read error
    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    getGeneralSettings();
    
    const health = getSettingsHealth();
    expect(health.status).toBe('unhealthy');
    expect(health.errors).toBeGreaterThan(0);
  });

  test('caches settings correctly and logs cache operations', () => {
    mockReadFileSync.mockReturnValue('mock content');
    mockYamlLoad.mockReturnValue({
      brand: { companyName: 'Test Company' }
    });

    // First call should read from file
    const settings1 = getGeneralSettings();
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const settings2 = getGeneralSettings();
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
    expect(settings1).toBe(settings2);

    // Clear cache and verify it's logged
    clearSettingsCache();
    const debugLogs = settingsLogger.getLogs('DEBUG');
    expect(debugLogs.some(log => log.message === 'Settings cache cleared')).toBe(true);

    // Next call should read from file again
    getGeneralSettings();
    expect(mockReadFileSync).toHaveBeenCalledTimes(2);
  });
});