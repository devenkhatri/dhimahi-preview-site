import { getGeneralSettings, clearSettingsCache, getGeneralSettingsUncached } from '../lib/settings';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Mock fs and yaml modules
jest.mock('fs');
jest.mock('js-yaml');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockYaml = yaml as jest.Mocked<typeof yaml>;

describe('Settings Library', () => {
  beforeEach(() => {
    clearSettingsCache();
    jest.clearAllMocks();
    // Suppress console warnings for tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getGeneralSettings', () => {
    it('should load and validate settings from CMS', () => {
      const mockSettings = {
        siteTitle: 'Test Company - Test Tagline',
        siteDescription: 'Test description',
        brand: {
          companyName: 'Test Company',
          tagline: 'Test Tagline',
          description: 'Test brand description'
        },
        location: {
          primaryLocation: 'Test City',
          serviceAreas: ['Test City', 'Test State'],
          fullAddress: 'Test Address'
        },
        contact: {
          primaryEmail: 'test@example.com',
          supportEmail: 'support@example.com',
          phone: '+1 234 567 8900',
          businessHours: 'Mon-Fri 9-5'
        },
        socialMedia: {
          linkedin: 'https://linkedin.com/company/test',
          twitter: 'https://twitter.com/test'
        }
      };

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
      mockYaml.load.mockReturnValue(mockSettings);

      const settings = getGeneralSettings();

      expect(settings.brand.companyName).toBe('Test Company');
      expect(settings.contact.primaryEmail).toBe('test@example.com');
      expect(settings.location.primaryLocation).toBe('Test City');
      expect(settings.socialMedia.linkedin).toBe('https://linkedin.com/company/test');
    });

    it('should use fallback settings when CMS file is missing', () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const settings = getGeneralSettings();

      expect(settings.brand.companyName).toBe('Dhīmahi Technolabs');
      expect(settings.contact.primaryEmail).toBe('hello@dhimahitechnolabs.com');
      expect(settings.location.primaryLocation).toBe('Ahmedabad & Gandhinagar');
    });

    it('should use fallback settings when YAML parsing fails', () => {
      mockFs.readFileSync.mockReturnValue('invalid yaml content');
      mockYaml.load.mockImplementation(() => {
        throw new Error('YAML parse error');
      });

      const settings = getGeneralSettings();

      expect(settings.brand.companyName).toBe('Dhīmahi Technolabs');
      expect(settings.contact.primaryEmail).toBe('hello@dhimahitechnolabs.com');
    });

    it('should handle backward compatibility with legacy fields', () => {
      const mockLegacySettings = {
        siteTitle: 'Legacy Company',
        siteDescription: 'Legacy description',
        contactEmail: 'legacy@example.com',
        phone: '+1 555 0123',
        address: 'Legacy Address'
      };

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockLegacySettings));
      mockYaml.load.mockReturnValue(mockLegacySettings);

      const settings = getGeneralSettings();

      expect(settings.brand.companyName).toBe('Legacy Company');
      expect(settings.contact.primaryEmail).toBe('legacy@example.com');
      expect(settings.location.fullAddress).toBe('Legacy Address');
      // Legacy fields should be populated
      expect(settings.contactEmail).toBe('legacy@example.com');
      expect(settings.phone).toBe('+1 555 0123');
      expect(settings.address).toBe('Legacy Address');
    });

    it('should validate email addresses and use fallbacks for invalid ones', () => {
      const mockSettings = {
        contact: {
          primaryEmail: 'invalid-email',
          supportEmail: 'also-invalid'
        }
      };

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
      mockYaml.load.mockReturnValue(mockSettings);

      const settings = getGeneralSettings();

      expect(settings.contact.primaryEmail).toBe('hello@dhimahitechnolabs.com');
      expect(settings.contact.supportEmail).toBeUndefined();
    });

    it('should validate URLs and filter out invalid social media links', () => {
      const mockSettings = {
        socialMedia: {
          linkedin: 'https://linkedin.com/valid',
          twitter: 'invalid-url',
          facebook: 'https://facebook.com/valid'
        }
      };

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
      mockYaml.load.mockReturnValue(mockSettings);

      const settings = getGeneralSettings();

      expect(settings.socialMedia.linkedin).toBe('https://linkedin.com/valid');
      expect(settings.socialMedia.twitter).toBeUndefined();
      expect(settings.socialMedia.facebook).toBe('https://facebook.com/valid');
    });

    it('should cache settings after first load', () => {
      const mockSettings = { siteTitle: 'Cached Test' };
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
      mockYaml.load.mockReturnValue(mockSettings);

      // First call
      const settings1 = getGeneralSettings();
      // Second call
      const settings2 = getGeneralSettings();

      expect(mockFs.readFileSync).toHaveBeenCalledTimes(1);
      expect(settings1).toBe(settings2); // Same object reference due to caching
    });

    it('should extract company name from site title when brand.companyName is missing', () => {
      const mockSettings = {
        siteTitle: 'Extracted Company - Some Tagline'
      };

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
      mockYaml.load.mockReturnValue(mockSettings);

      const settings = getGeneralSettings();

      expect(settings.brand.companyName).toBe('Extracted Company');
    });
  });

  describe('clearSettingsCache', () => {
    it('should clear the cache and reload settings on next call', () => {
      const mockSettings = { siteTitle: 'First Load' };
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
      mockYaml.load.mockReturnValue(mockSettings);

      // First load
      getGeneralSettings();
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(1);

      // Clear cache
      clearSettingsCache();

      // Second load should read file again
      getGeneralSettings();
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);
    });
  });

  describe('getGeneralSettingsUncached', () => {
    it('should always reload settings without affecting cache', () => {
      const mockSettings = { siteTitle: 'Uncached Test' };
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));
      mockYaml.load.mockReturnValue(mockSettings);

      // Load cached version
      getGeneralSettings();
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(1);

      // Load uncached version
      getGeneralSettingsUncached();
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);

      // Load cached version again - should not read file
      getGeneralSettings();
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);
    });
  });
});