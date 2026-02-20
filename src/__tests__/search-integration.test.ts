import { searchContent, getAllSearchableContent } from '@/lib/search';

// Mock the content modules
jest.mock('@/lib/content', () => ({
  getAllPersonas: jest.fn(() => [
    {
      slug: 'small-business-owner',
      title: 'Small Business Owner',
      excerpt: 'Running a growing business but struggling with outdated systems',
      publishDate: '2024-01-15',
      tags: ['SME', 'Growth', 'Automation'],
    },
    {
      slug: 'doctors',
      title: 'Healthcare Professionals',
      excerpt: 'Medical professionals looking to modernize patient care',
      publishDate: '2024-01-17',
      tags: ['Healthcare', 'Patient Care', 'Digital Transformation'],
    },
  ]),
  getAllResources: jest.fn(() => [
    {
      id: 'seo-checklist',
      slug: 'seo-checklist',
      title: 'SEO Checklist for SMEs',
      description: 'A practical SEO checklist to improve your website visibility',
      type: 'checklist',
      fileSize: '1.2 MB',
      pages: 10,
      downloadUrl: '/downloads/seo-checklist.pdf',
      featured: true,
      order: 1,
      publishDate: '2024-01-10',
      tags: ['SEO', 'Digital Marketing', 'Guide'],
    },
    {
      id: 'ai-guide',
      slug: 'ai-guide',
      title: 'AI Automation Guide for SMEs',
      description: 'Step-by-step guide to implementing AI in your business',
      type: 'guide',
      fileSize: '2.4 MB',
      pages: 24,
      downloadUrl: '/downloads/ai-guide.pdf',
      featured: false,
      order: 2,
      publishDate: '2024-01-12',
      tags: ['AI', 'Automation', 'Business'],
    },
  ]),
}));

jest.mock('@/lib/cms-content', () => ({
  getAllCMSServices: jest.fn(() => [
    {
      slug: 'web-development',
      title: 'Web Development',
      excerpt: 'Custom websites and web applications',
      icon: '🌐',
      features: ['React', 'Next.js', 'TypeScript'],
    },
  ]),
  getAllCMSInsights: jest.fn(() => [
    {
      slug: 'ai-automation-guide',
      title: 'AI Automation Guide',
      excerpt: 'How to implement AI automation in your business',
      category: 'AI & Automation',
      tags: ['AI', 'Automation', 'SME'],
      publishDate: new Date('2024-01-20'),
    },
  ]),
  getAllCMSCaseStudies: jest.fn(() => [
    {
      slug: 'manufacturing-erp',
      title: 'Manufacturing ERP Transformation',
      excerpt: 'Helped a Ahmedabad manufacturer modernize operations with ERP',
      category: 'ERP',
      projectType: 'Digital Transformation',
      services: ['web-development', 'ai-automation'],
      client: { name: 'Confidential', industry: 'Manufacturing', size: 'SME', location: 'Ahmedabad' },
      publishDate: new Date('2024-01-05'),
      featured: true,
    },
    {
      slug: 'retail-ecommerce',
      title: 'Retail E-commerce Launch',
      excerpt: 'Built a fully featured e-commerce store for a Gujarat retailer',
      category: 'E-commerce',
      projectType: 'Web Development',
      services: ['web-development'],
      client: { name: 'Confidential', industry: 'Retail', size: 'SME', location: 'Gandhinagar' },
      publishDate: new Date('2024-01-08'),
      featured: false,
    },
  ]),
}));

describe('Search Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── getAllSearchableContent ───────────────────────────────────────────────

  it('should include all content types in searchable content', () => {
    const allContent = getAllSearchableContent();

    const types = new Set(allContent.map((item) => item.type));
    expect(types.has('service')).toBe(true);
    expect(types.has('insight')).toBe(true);
    expect(types.has('persona')).toBe(true);
    expect(types.has('case-study')).toBe(true);
    expect(types.has('resource')).toBe(true);
    expect(types.has('about')).toBe(true);
  });

  it('should include personas', () => {
    const allContent = getAllSearchableContent();
    const personas = allContent.filter((item) => item.type === 'persona');
    expect(personas).toHaveLength(2);
    expect(personas[0].title).toBe('Small Business Owner');
  });

  it('should include case studies', () => {
    const allContent = getAllSearchableContent();
    const caseStudies = allContent.filter((item) => item.type === 'case-study');
    expect(caseStudies).toHaveLength(2);
    expect(caseStudies[0].title).toBe('Manufacturing ERP Transformation');
    expect(caseStudies[0].href).toBe('/portfolio/manufacturing-erp');
  });

  it('should include resources', () => {
    const allContent = getAllSearchableContent();
    const resources = allContent.filter((item) => item.type === 'resource');
    expect(resources).toHaveLength(2);
    expect(resources[0].title).toBe('SEO Checklist for SMEs');
    expect(resources[0].href).toBe('/resources');
  });

  it('should include a single about entry', () => {
    const allContent = getAllSearchableContent();
    const about = allContent.filter((item) => item.type === 'about');
    expect(about).toHaveLength(1);
    expect(about[0].href).toBe('/about');
  });

  // ─── searchContent ────────────────────────────────────────────────────────

  it('should search across all content types including personas', () => {
    const results = searchContent('business');
    const personas = results.filter((item) => item.type === 'persona');
    const services = results.filter((item) => item.type === 'service');
    expect(personas.length).toBeGreaterThan(0);
    expect(services.length).toBeGreaterThan(0);
  });

  it('should find case studies by category tag', () => {
    const results = searchContent('manufacturing');
    const caseStudies = results.filter((item) => item.type === 'case-study');
    expect(caseStudies.length).toBeGreaterThan(0);
    expect(caseStudies[0].title).toBe('Manufacturing ERP Transformation');
  });

  it('should find case studies by industry', () => {
    const results = searchContent('retail');
    const caseStudies = results.filter((item) => item.type === 'case-study');
    expect(caseStudies.length).toBeGreaterThan(0);
  });

  it('should find resources by type tag', () => {
    const results = searchContent('checklist');
    const resources = results.filter((item) => item.type === 'resource');
    expect(resources.length).toBeGreaterThan(0);
  });

  it('should find resources by tag content', () => {
    const results = searchContent('SEO');
    const resources = results.filter((item) => item.type === 'resource');
    expect(resources.length).toBeGreaterThan(0);
    expect(resources[0].title).toBe('SEO Checklist for SMEs');
  });

  it('should find about page by keyword', () => {
    const results = searchContent('mission');
    const about = results.filter((item) => item.type === 'about');
    expect(about).toHaveLength(1);
  });

  it('should find about page by team keyword', () => {
    const results = searchContent('team');
    const about = results.filter((item) => item.type === 'about');
    expect(about).toHaveLength(1);
  });

  it('should search personas by tags', () => {
    const results = searchContent('healthcare');
    const personas = results.filter((item) => item.type === 'persona');
    expect(personas.length).toBeGreaterThan(0);
    expect(personas[0].title).toBe('Healthcare Professionals');
  });

  it('should filter by content type', () => {
    const caseStudyResults = searchContent('', 'case-study');
    expect(caseStudyResults.every((item) => item.type === 'case-study')).toBe(true);

    const resourceResults = searchContent('', 'resource');
    expect(resourceResults.every((item) => item.type === 'resource')).toBe(true);
  });

  it('should return empty array for no matches', () => {
    const results = searchContent('nonexistent-term-xyzfoo');
    expect(results).toHaveLength(0);
  });

  it('should sort results by relevance (title matches first)', () => {
    const results = searchContent('business');
    expect(results.length).toBeGreaterThan(0);
    // The first result should have 'business' in the title
    const firstResult = results[0];
    expect(firstResult.title.toLowerCase()).toContain('business');
  });
});