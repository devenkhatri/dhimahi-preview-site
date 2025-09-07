import { 
  getAllPersonas, 
  getPersonaBySlug, 
  getFeaturedPersonas,
  sortPersonas,
  getFilteredPersonas,
  getPersonasByTags,
  getPersonaTags
} from '../lib/content';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// Mock gray-matter
jest.mock('gray-matter', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockFs = require('fs');
const mockMatter = require('gray-matter').default;

describe('Persona Content Processing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPersonas', () => {
    it('should return empty array when personas directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = getAllPersonas();
      
      expect(result).toEqual([]);
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining('content/personas'));
    });

    it('should return empty array when no markdown files exist', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['not-markdown.txt', '.hidden.md']);
      
      const result = getAllPersonas();
      
      expect(result).toEqual([]);
    });

    it('should process valid persona files correctly', () => {
      const mockPersonaData = {
        title: 'Small Business Owner',
        slug: 'small-business-owner',
        icon: '/uploads/personas/business-icon.svg',
        excerpt: 'Running a growing business',
        publishDate: '2024-01-15',
        featured: true,
        order: 1,
        tags: ['SME', 'Growth'],
        storytelling: {
          everydayStruggle: 'Daily challenges...',
          whyThisMatters: 'Important because...',
          howDhimahiHelps: 'We help by...',
          theJourney: 'The process...',
          callToAction: {
            title: 'Ready to Transform?',
            description: 'Let us help you grow',
            primaryButton: {
              text: 'Get Consultation',
              url: '/consultation'
            }
          }
        }
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['small-business-owner.md']);
      mockFs.readFileSync.mockReturnValue('mock file content');
      mockMatter.mockReturnValue({ data: mockPersonaData });

      const result = getAllPersonas();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: 'Small Business Owner',
        slug: 'small-business-owner',
        featured: true,
        order: 1
      });
    });

    it('should skip invalid persona files', () => {
      const invalidPersonaData = {
        title: 'Invalid Persona',
        // Missing required fields
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['invalid-persona.md']);
      mockFs.readFileSync.mockReturnValue('mock file content');
      mockMatter.mockReturnValue({ data: invalidPersonaData });

      const result = getAllPersonas();

      expect(result).toEqual([]);
    });
  });

  describe('getPersonaBySlug', () => {
    it('should return null when persona not found', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);

      const result = getPersonaBySlug('non-existent');

      expect(result).toBeNull();
    });

    it('should return persona when found', () => {
      const mockPersonaData = {
        title: 'Test Persona',
        slug: 'test-persona',
        icon: '/uploads/personas/test-icon.svg',
        excerpt: 'Test excerpt',
        storytelling: {
          everydayStruggle: 'Test struggle',
          whyThisMatters: 'Test matters',
          howDhimahiHelps: 'Test helps',
          theJourney: 'Test journey',
          callToAction: {
            title: 'Test CTA',
            description: 'Test description',
            primaryButton: {
              text: 'Test Button',
              url: '/test'
            }
          }
        }
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['test-persona.md']);
      mockFs.readFileSync.mockReturnValue('mock file content');
      mockMatter.mockReturnValue({ data: mockPersonaData });

      const result = getPersonaBySlug('test-persona');

      expect(result).not.toBeNull();
      expect(result?.slug).toBe('test-persona');
    });
  });

  describe('getFeaturedPersonas', () => {
    it('should return only featured personas', () => {
      const mockPersonas = [
        {
          title: 'Featured Persona',
          slug: 'featured',
          featured: true,
          storytelling: {
            everydayStruggle: 'Test',
            whyThisMatters: 'Test',
            howDhimahiHelps: 'Test',
            theJourney: 'Test',
            callToAction: {
              title: 'Test',
              description: 'Test',
              primaryButton: { text: 'Test', url: '/test' }
            }
          }
        },
        {
          title: 'Regular Persona',
          slug: 'regular',
          featured: false,
          storytelling: {
            everydayStruggle: 'Test',
            whyThisMatters: 'Test',
            howDhimahiHelps: 'Test',
            theJourney: 'Test',
            callToAction: {
              title: 'Test',
              description: 'Test',
              primaryButton: { text: 'Test', url: '/test' }
            }
          }
        }
      ];

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['featured.md', 'regular.md']);
      mockFs.readFileSync.mockReturnValue('mock file content');
      mockMatter
        .mockReturnValueOnce({ data: { ...mockPersonas[0], icon: '/test.svg', excerpt: 'Test' } })
        .mockReturnValueOnce({ data: { ...mockPersonas[1], icon: '/test.svg', excerpt: 'Test' } });

      const result = getFeaturedPersonas();

      expect(result).toHaveLength(1);
      expect(result[0].featured).toBe(true);
    });
  });

  describe('sortPersonas', () => {
    const mockPersonas = [
      {
        id: '1',
        title: 'B Persona',
        slug: 'b-persona',
        icon: '/test.svg',
        excerpt: 'Test',
        publishDate: '2024-01-01',
        featured: false,
        order: 2,
        storytelling: {
          everydayStruggle: 'Test',
          whyThisMatters: 'Test',
          howDhimahiHelps: 'Test',
          theJourney: 'Test',
          callToAction: {
            title: 'Test',
            description: 'Test',
            primaryButton: { text: 'Test', url: '/test' }
          }
        }
      },
      {
        id: '2',
        title: 'A Persona',
        slug: 'a-persona',
        icon: '/test.svg',
        excerpt: 'Test',
        publishDate: '2024-01-02',
        featured: false,
        order: 1,
        storytelling: {
          everydayStruggle: 'Test',
          whyThisMatters: 'Test',
          howDhimahiHelps: 'Test',
          theJourney: 'Test',
          callToAction: {
            title: 'Test',
            description: 'Test',
            primaryButton: { text: 'Test', url: '/test' }
          }
        }
      }
    ];

    it('should sort by order ascending by default', () => {
      const result = sortPersonas(mockPersonas);
      
      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(2);
    });

    it('should sort by title when specified', () => {
      const result = sortPersonas(mockPersonas, 'title');
      
      expect(result[0].title).toBe('A Persona');
      expect(result[1].title).toBe('B Persona');
    });

    it('should sort by date when specified', () => {
      const result = sortPersonas(mockPersonas, 'date');
      
      expect(result[0].publishDate).toBe('2024-01-01');
      expect(result[1].publishDate).toBe('2024-01-02');
    });

    it('should sort descending when specified', () => {
      const result = sortPersonas(mockPersonas, 'order', 'desc');
      
      expect(result[0].order).toBe(2);
      expect(result[1].order).toBe(1);
    });
  });

  describe('getFilteredPersonas', () => {
    it('should filter by featured status', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);

      const result = getFilteredPersonas({ featured: true });

      expect(result).toEqual([]);
    });

    it('should limit results when specified', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);

      const result = getFilteredPersonas({ limit: 2 });

      expect(result.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getPersonasByTags', () => {
    it('should return empty array when no personas match tags', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);

      const result = getPersonasByTags(['non-existent-tag']);

      expect(result).toEqual([]);
    });
  });

  describe('getPersonaTags', () => {
    it('should return empty array when no personas exist', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);

      const result = getPersonaTags();

      expect(result).toEqual([]);
    });
  });
});