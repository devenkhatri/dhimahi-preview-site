import { searchContent, getAllSearchableContent } from '@/lib/search';

// Mock the content modules
jest.mock('@/lib/content', () => ({
  getAllPersonas: jest.fn(() => [
    {
      slug: 'small-business-owner',
      title: 'Small Business Owner',
      excerpt: 'Running a growing business but struggling with outdated systems',
      publishDate: '2024-01-15',
      tags: ['SME', 'Growth', 'Automation']
    },
    {
      slug: 'doctors',
      title: 'Healthcare Professionals',
      excerpt: 'Medical professionals looking to modernize patient care',
      publishDate: '2024-01-17',
      tags: ['Healthcare', 'Patient Care', 'Digital Transformation']
    }
  ])
}));

jest.mock('@/lib/cms-content', () => ({
  getAllCMSServices: jest.fn(() => [
    {
      slug: 'web-development',
      title: 'Web Development',
      excerpt: 'Custom websites and web applications',
      icon: '🌐',
      features: ['React', 'Next.js', 'TypeScript']
    }
  ]),
  getAllCMSInsights: jest.fn(() => [
    {
      slug: 'ai-automation-guide',
      title: 'AI Automation Guide',
      excerpt: 'How to implement AI automation in your business',
      category: 'AI & Automation',
      tags: ['AI', 'Automation', 'SME'],
      publishDate: new Date('2024-01-20')
    }
  ])
}));

describe('Search Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all searchable content including personas', () => {
    const allContent = getAllSearchableContent();
    
    expect(allContent.length).toBeGreaterThan(0);
    
    // Check that personas are included
    const personas = allContent.filter(item => item.type === 'persona');
    expect(personas).toHaveLength(2);
    expect(personas[0].title).toBe('Small Business Owner');
    expect(personas[1].title).toBe('Healthcare Professionals');
  });

  it('should search across all content types including personas', () => {
    const results = searchContent('business');
    
    expect(results.length).toBeGreaterThan(0);
    
    // Should include both personas and other content
    const personas = results.filter(item => item.type === 'persona');
    const services = results.filter(item => item.type === 'service');
    
    expect(personas.length).toBeGreaterThan(0);
    expect(services.length).toBeGreaterThan(0);
  });

  it('should search personas by tags', () => {
    const results = searchContent('healthcare');
    
    const personas = results.filter(item => item.type === 'persona');
    expect(personas.length).toBeGreaterThan(0);
    expect(personas[0].title).toBe('Healthcare Professionals');
  });

  it('should search personas by title', () => {
    const results = searchContent('small business');
    
    const personas = results.filter(item => item.type === 'persona');
    expect(personas.length).toBeGreaterThan(0);
    expect(personas[0].title).toBe('Small Business Owner');
  });

  it('should filter by content type', () => {
    const personaResults = searchContent('business', 'persona');
    
    expect(personaResults.every(item => item.type === 'persona')).toBe(true);
    expect(personaResults.length).toBeGreaterThan(0);
  });

  it('should return empty array for no matches', () => {
    const results = searchContent('nonexistent-term');
    
    expect(results).toHaveLength(0);
  });

  it('should sort results by relevance', () => {
    const results = searchContent('business');
    
    // Results should be sorted with title matches first
    expect(results.length).toBeGreaterThan(0);
    
    // The first result should have 'business' in the title
    const firstResult = results[0];
    expect(firstResult.title.toLowerCase()).toContain('business');
  });
});