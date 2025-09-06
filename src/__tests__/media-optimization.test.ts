/**
 * Tests for media optimization functionality
 */

import {
  generateResponsiveSizes,
  generateOptimizedImageUrls,
  extractImageMetadata,
  generateAltTextSuggestion,
  validateImageFile,
  generateBlurPlaceholder,
  getRecommendedDimensions,
  MEDIA_FOLDERS
} from '@/lib/media-optimization';

describe('Media Optimization', () => {
  describe('generateResponsiveSizes', () => {
    it('should generate responsive sizes string', () => {
      const sizes = generateResponsiveSizes(1200);
      expect(sizes).toContain('(max-width: 640px) 640px');
      expect(sizes).toContain('(max-width: 768px) 768px');
      expect(sizes).toContain('1200px');
    });

    it('should handle custom breakpoints', () => {
      const sizes = generateResponsiveSizes(800, [400, 600, 800]);
      expect(sizes).toContain('(max-width: 400px) 400px');
      expect(sizes).toContain('(max-width: 600px) 600px');
      expect(sizes).toContain('800px');
    });

    it('should not exceed base width', () => {
      const sizes = generateResponsiveSizes(500, [640, 768, 1024]);
      expect(sizes).toContain('(max-width: 640px) 500px');
      expect(sizes).toContain('(max-width: 768px) 500px');
      expect(sizes).toContain('500px');
    });
  });

  describe('generateOptimizedImageUrls', () => {
    it('should generate optimized URLs', () => {
      const urls = generateOptimizedImageUrls('/uploads/test-image.jpg');
      
      expect(urls.webp).toBe('/uploads/test-image.webp');
      expect(urls.avif).toBe('/uploads/test-image.avif');
      expect(urls.fallback).toBe('/uploads/test-image.jpg');
    });

    it('should handle different file extensions', () => {
      const urls = generateOptimizedImageUrls('/uploads/test-image.png');
      
      expect(urls.webp).toBe('/uploads/test-image.webp');
      expect(urls.avif).toBe('/uploads/test-image.avif');
      expect(urls.fallback).toBe('/uploads/test-image.png');
    });
  });

  describe('extractImageMetadata', () => {
    it('should extract metadata from case study path', () => {
      const metadata = extractImageMetadata('/uploads/case-studies/healthcare-website.jpg');
      
      expect(metadata.category).toBe('case-studies');
      expect(metadata.filename).toBe('healthcare-website.jpg');
      expect(metadata.extension).toBe('jpg');
    });

    it('should extract metadata from services path', () => {
      const metadata = extractImageMetadata('/uploads/services/web-development-icon.png');
      
      expect(metadata.category).toBe('services');
      expect(metadata.filename).toBe('web-development-icon.png');
      expect(metadata.extension).toBe('png');
    });

    it('should default to general category', () => {
      const metadata = extractImageMetadata('/uploads/random-image.jpg');
      
      expect(metadata.category).toBe('general');
      expect(metadata.filename).toBe('random-image.jpg');
      expect(metadata.extension).toBe('jpg');
    });
  });

  describe('generateAltTextSuggestion', () => {
    it('should generate alt text for case study images', () => {
      const altText = generateAltTextSuggestion('healthcare-website-homepage.jpg', 'case-studies');
      
      expect(altText).toBe('Case study image showing Healthcare Website Homepage');
    });

    it('should generate alt text for service images', () => {
      const altText = generateAltTextSuggestion('web-development-process.png', 'services');
      
      expect(altText).toBe('Service illustration for Web Development Process');
    });

    it('should generate alt text for team images', () => {
      const altText = generateAltTextSuggestion('john-doe-profile.jpg', 'team');
      
      expect(altText).toBe('Team member photo of John Doe Profile');
    });

    it('should include context when provided', () => {
      const altText = generateAltTextSuggestion(
        'dashboard-analytics.jpg', 
        'case-studies', 
        'showing 150% increase in conversions'
      );
      
      expect(altText).toBe('Case study image showing Dashboard Analytics - showing 150% increase in conversions');
    });

    it('should handle filenames with numbers and special characters', () => {
      const altText = generateAltTextSuggestion('project-v2_final-screenshot.jpg', 'case-studies');
      
      expect(altText).toBe('Case study image showing Project V2 Final Screenshot');
    });
  });

  describe('validateImageFile', () => {
    it('should validate a good image file', () => {
      const mockFile = new File([''], 'test-image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Mock file size
      Object.defineProperty(mockFile, 'size', {
        value: 1024 * 1024, // 1MB
        writable: false
      });
      
      const validation = validateImageFile(mockFile);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject files that are too large', () => {
      const mockFile = new File([''], 'large-image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Mock large file size (15MB)
      Object.defineProperty(mockFile, 'size', {
        value: 15 * 1024 * 1024,
        writable: false
      });
      
      const validation = validateImageFile(mockFile);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('File size (15.0MB) exceeds 10MB limit');
      expect(validation.suggestions).toContain('Compress the image before uploading');
    });

    it('should reject unsupported file types', () => {
      const mockFile = new File([''], 'document.pdf', {
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      Object.defineProperty(mockFile, 'size', {
        value: 1024 * 1024,
        writable: false
      });
      
      const validation = validateImageFile(mockFile);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('File type application/pdf is not supported');
      expect(validation.suggestions).toContain('Use JPEG, PNG, WebP, or GIF format');
    });

    it('should reject files with invalid filenames', () => {
      const mockFile = new File([''], 'invalid filename with spaces & symbols!.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      Object.defineProperty(mockFile, 'size', {
        value: 1024 * 1024,
        writable: false
      });
      
      const validation = validateImageFile(mockFile);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Filename contains invalid characters');
      expect(validation.suggestions).toContain('Use only letters, numbers, dots, hyphens, and underscores');
    });

    it('should reject files with very long filenames', () => {
      const longFilename = 'a'.repeat(97) + '.jpg'; // 101 characters total
      const mockFile = new File([''], longFilename, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      Object.defineProperty(mockFile, 'size', {
        value: 1024 * 1024,
        writable: false
      });
      
      const validation = validateImageFile(mockFile);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Filename is too long (max 100 characters)');
      expect(validation.suggestions).toContain('Use a shorter, descriptive filename');
    });
  });

  describe('generateBlurPlaceholder', () => {
    it('should generate a valid data URL', () => {
      const placeholder = generateBlurPlaceholder(400, 300);
      
      expect(placeholder).toMatch(/^data:image\/svg\+xml;base64,/);
      
      // Decode the base64 to check the SVG content
      const base64Content = placeholder.replace('data:image/svg+xml;base64,', '');
      const svgContent = Buffer.from(base64Content, 'base64').toString();
      
      expect(svgContent).toContain('width="400"');
      expect(svgContent).toContain('height="300"');
    });

    it('should handle different dimensions', () => {
      const placeholder = generateBlurPlaceholder(800, 600);
      
      // Decode the base64 to check the SVG content
      const base64Content = placeholder.replace('data:image/svg+xml;base64,', '');
      const svgContent = Buffer.from(base64Content, 'base64').toString();
      
      expect(svgContent).toContain('width="800"');
      expect(svgContent).toContain('height="600"');
    });
  });

  describe('getRecommendedDimensions', () => {
    it('should return correct dimensions for case studies', () => {
      const dimensions = getRecommendedDimensions('case-studies');
      
      expect(dimensions.width).toBe(1200);
      expect(dimensions.height).toBe(800);
      expect(dimensions.aspectRatio).toBe('3:2');
    });

    it('should return correct dimensions for services', () => {
      const dimensions = getRecommendedDimensions('services');
      
      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(600);
      expect(dimensions.aspectRatio).toBe('4:3');
    });

    it('should return correct dimensions for insights', () => {
      const dimensions = getRecommendedDimensions('insights');
      
      expect(dimensions.width).toBe(1200);
      expect(dimensions.height).toBe(630);
      expect(dimensions.aspectRatio).toBe('1.91:1');
    });

    it('should return correct dimensions for team', () => {
      const dimensions = getRecommendedDimensions('team');
      
      expect(dimensions.width).toBe(400);
      expect(dimensions.height).toBe(400);
      expect(dimensions.aspectRatio).toBe('1:1');
    });

    it('should default to general dimensions for unknown categories', () => {
      const dimensions = getRecommendedDimensions('unknown-category');
      
      expect(dimensions.width).toBe(1200);
      expect(dimensions.height).toBe(800);
      expect(dimensions.aspectRatio).toBe('3:2');
    });
  });

  describe('MEDIA_FOLDERS', () => {
    it('should have all required folder configurations', () => {
      const expectedFolders = ['case-studies', 'services', 'insights', 'team', 'testimonials', 'general'];
      
      expectedFolders.forEach(folder => {
        expect(MEDIA_FOLDERS[folder]).toBeDefined();
        expect(MEDIA_FOLDERS[folder].path).toBeDefined();
        expect(MEDIA_FOLDERS[folder].description).toBeDefined();
        expect(MEDIA_FOLDERS[folder].allowedTypes).toBeDefined();
        expect(Array.isArray(MEDIA_FOLDERS[folder].allowedTypes)).toBe(true);
      });
    });

    it('should have valid paths for all folders', () => {
      Object.values(MEDIA_FOLDERS).forEach(folder => {
        expect(folder.path).toMatch(/^\/uploads\//);
      });
    });

    it('should have allowed types for all folders', () => {
      Object.values(MEDIA_FOLDERS).forEach(folder => {
        expect(folder.allowedTypes.length).toBeGreaterThan(0);
        folder.allowedTypes.forEach(type => {
          expect(type).toMatch(/^image\//);
        });
      });
    });
  });
});