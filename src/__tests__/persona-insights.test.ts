import { getPersonaSpecificInsights } from '@/lib/content';

// Mock the cms-content module
jest.mock('@/lib/cms-content', () => ({
  getAllCMSInsights: jest.fn(() => [
    {
      slug: 'ai-automation-sme',
      title: 'AI Automation for SMEs',
      excerpt: 'How small businesses can leverage AI automation',
      category: 'AI & Automation',
      tags: ['AI', 'Automation', 'SME', 'Business Strategy'],
      publishDate: new Date('2024-01-15'),
      author: 'Dhimahi Team'
    },
    {
      slug: 'digital-marketing-guide',
      title: 'Digital Marketing Guide',
      excerpt: 'Complete guide to digital marketing for businesses',
      category: 'Digital Marketing',
      tags: ['Digital Marketing', 'SME', 'Lead Generation', 'Growth'],
      publishDate: new Date('2024-01-10'),
      author: 'Dhimahi Team'
    },
    {
      slug: 'healthcare-automation',
      title: 'Healthcare Automation Solutions',
      excerpt: 'Automation solutions for healthcare providers',
      category: 'AI & Automation',
      tags: ['Healthcare', 'Medical', 'Automation', 'Patient Management'],
      publishDate: new Date('2024-01-12'),
      author: 'Dhimahi Team'
    },
    {
      slug: 'construction-marketing',
      title: 'Construction Industry Marketing',
      excerpt: 'Marketing strategies for construction businesses',
      category: 'Digital Marketing',
      tags: ['Construction', 'Real Estate', 'Digital Marketing', 'Lead Generation'],
      publishDate: new Date('2024-01-08'),
      author: 'Dhimahi Team'
    },
    {
      slug: 'unrelated-topic',
      title: 'Unrelated Topic',
      excerpt: 'This should not match any persona',
      category: 'Other',
      tags: ['Random', 'Unrelated'],
      publishDate: new Date('2024-01-05'),
      author: 'Dhimahi Team'
    }
  ])
}));

describe('getPersonaSpecificInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return relevant insights for small-business-owner persona', () => {
    const insights = getPersonaSpecificInsights('small-business-owner', ['SME', 'Growth'], 3);
    
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.length).toBeLessThanOrEqual(3);
    // Should include relevant insights
    const slugs = insights.map(i => i.slug);
    expect(slugs).toContain('digital-marketing-guide');
    expect(slugs).toContain('ai-automation-sme');
  });

  it('should return relevant insights for doctors persona', () => {
    const insights = getPersonaSpecificInsights('doctors', ['Healthcare'], 2);
    
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.length).toBeLessThanOrEqual(2);
    // Should include healthcare-specific insights
    const slugs = insights.map(i => i.slug);
    expect(slugs).toContain('healthcare-automation');
  });

  it('should return relevant insights for builders persona', () => {
    const insights = getPersonaSpecificInsights('builders', ['Construction'], 2);
    
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.length).toBeLessThanOrEqual(2);
    // Should include construction-specific insights
    const slugs = insights.map(i => i.slug);
    expect(slugs).toContain('construction-marketing');
  });

  it('should return limited insights for persona with no specific mapping', () => {
    const insights = getPersonaSpecificInsights('unknown-persona', [], 3);
    
    // Even unknown personas might get some general SME insights
    expect(insights.length).toBeLessThanOrEqual(3);
  });

  it('should respect the limit parameter', () => {
    const insights = getPersonaSpecificInsights('small-business-owner', ['SME'], 1);
    
    expect(insights).toHaveLength(1);
  });

  it('should handle empty persona tags gracefully', () => {
    const insights = getPersonaSpecificInsights('small-business-owner', [], 3);
    
    expect(insights.length).toBeGreaterThan(0);
  });

  it('should score insights correctly based on tag matches', () => {
    const insights = getPersonaSpecificInsights('small-business-owner', ['SME', 'Digital Marketing'], 3);
    
    // Should return insights with high relevance scores
    expect(insights.length).toBeGreaterThan(0);
    const slugs = insights.map(i => i.slug);
    expect(slugs).toContain('digital-marketing-guide');
  });

  it('should handle errors gracefully', () => {
    // Mock getAllCMSInsights to throw an error
    const { getAllCMSInsights } = require('@/lib/cms-content');
    getAllCMSInsights.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const insights = getPersonaSpecificInsights('small-business-owner', ['SME'], 3);
    
    expect(insights).toEqual([]);
  });
});