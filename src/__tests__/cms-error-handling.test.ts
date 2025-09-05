import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Import functions to test
import { 
  getCMSHomepageContent,
  getAllCMSServices,
  getCMSServiceData,
  getAllCMSCaseStudies,
  getCMSCaseStudyData,
  getAllCMSInsights,
  getCMSInsightData,
  getCMSAboutContent
} from '../lib/cms-content';

import {
  validateHomepageContent,
  validateServiceData,
  validateCaseStudy,
  validateInsight,
  validateAboutContent
} from '../lib/cms-validation';

import {
  getDefaultHomepageContent,
  getDefaultAboutContent,
  getDefaultServiceMeta,
  getDefaultServiceData,
  getDefaultCaseStudyMeta,
  getDefaultCaseStudyData,
  getDefaultInsightMeta,
  getDefaultInsightData
} from '../lib/cms-fallbacks';

describe('CMS Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console errors during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('File System Error Handling', () => {
    it('should return fallback content when homepage file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = getCMSHomepageContent();
      const fallback = getDefaultHomepageContent();
      
      expect(result).toEqual(fallback);
    });

    it('should return fallback content when file read fails', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });
      
      const result = getCMSHomepageContent();
      const fallback = getDefaultHomepageContent();
      
      expect(result).toEqual(fallback);
    });

    it('should return fallback services when directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = getAllCMSServices();
      const fallback = getDefaultServiceMeta();
      
      expect(result).toEqual(fallback);
    });

    it('should handle individual file errors in directory reading', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['service1.md', 'service2.md']);
      
      // First file succeeds, second fails
      mockFs.readFileSync
        .mockReturnValueOnce('---\ntitle: Service 1\nicon: 🔧\nexcerpt: Test service\norder: 1\nfeatures: []\ntimeline: 1 week\n---\nContent')
        .mockImplementationOnce(() => {
          throw new Error('File read error');
        });
      
      const result = getAllCMSServices();
      
      // Should return only the valid service
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Service 1');
    });
  });

  describe('YAML Parsing Error Handling', () => {
    it('should return fallback content when YAML parsing fails', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid: yaml: content: [');
      
      const result = getCMSHomepageContent();
      const fallback = getDefaultHomepageContent();
      
      expect(result).toEqual(fallback);
    });
  });

  describe('Content Validation', () => {
    it('should validate valid homepage content', () => {
      const validContent = getDefaultHomepageContent();
      const result = validateHomepageContent(validContent);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for invalid homepage content', () => {
      const invalidContent = {
        hero: {
          mainHeadline: '', // Empty required field
          subheadline: 'Test',
          trustBadge: 'Test',
          statistics: [], // Empty required array
          ctaButtons: {
            primary: 'Test',
            secondary: 'Test'
          }
        }
      };
      
      const result = validateHomepageContent(invalidContent as any);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate service data correctly', () => {
      const validService = getDefaultServiceData('test-service');
      const result = validateServiceData(validService);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for incomplete service data', () => {
      const invalidService = {
        slug: 'test',
        title: '', // Empty required field
        icon: 'test',
        excerpt: 'test'
      };
      
      const result = validateServiceData(invalidService as any);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Fallback Content', () => {
    it('should provide complete fallback homepage content', () => {
      const fallback = getDefaultHomepageContent();
      
      expect(fallback.hero.mainHeadline).toBeTruthy();
      expect(fallback.hero.statistics).toHaveLength(3);
      expect(fallback.testimonials.items).toHaveLength(3);
      expect(fallback.whyChooseUs.reasons).toHaveLength(4);
    });

    it('should provide complete fallback service data', () => {
      const fallback = getDefaultServiceData('test-service');
      
      expect(fallback.title).toBeTruthy();
      expect(fallback.features).toHaveLength(4);
      expect(fallback.processSteps).toHaveLength(3);
    });

    it('should provide complete fallback case study data', () => {
      const fallback = getDefaultCaseStudyData('test-case-study');
      
      expect(fallback.title).toBeTruthy();
      expect(fallback.client.name).toBeTruthy();
      expect(fallback.solution).toHaveLength(3);
      expect(fallback.results).toHaveLength(2);
    });
  });

  describe('Error Recovery', () => {
    it('should recover gracefully from markdown processing errors', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('---\ntitle: Test Service\nicon: 🔧\nexcerpt: Test\norder: 1\nfeatures: []\ntimeline: 1 week\n---\nInvalid markdown content');
      
      // Mock remark to throw an error
      jest.doMock('remark', () => ({
        remark: () => ({
          use: () => ({
            process: () => {
              throw new Error('Markdown processing error');
            }
          })
        })
      }));
      
      const result = await getCMSServiceData('test-service');
      
      // Should still return service data with error message in content
      expect(result.title).toBe('Test Service');
      expect(result.content).toContain('Content processing error');
    });
  });

  describe('Build-time Validation', () => {
    it('should identify missing required fields', () => {
      const invalidData = {
        hero: {
          mainHeadline: '',
          subheadline: 'test'
        }
      };
      
      const result = validateHomepageContent(invalidData as any);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('required'))).toBe(true);
    });

    it('should validate array fields correctly', () => {
      const dataWithEmptyArray = {
        hero: {
          mainHeadline: 'Test',
          subheadline: 'Test',
          trustBadge: 'Test',
          statistics: [], // Should have at least one item
          ctaButtons: {
            primary: 'Test',
            secondary: 'Test'
          }
        }
      };
      
      const result = validateHomepageContent(dataWithEmptyArray as any);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('at least one'))).toBe(true);
    });
  });
});