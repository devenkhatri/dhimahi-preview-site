import { generatePersonaMetadata, generatePersonaStructuredData } from '@/lib/seo';

describe('Persona SEO', () => {
  const mockPersona = {
    title: 'Small Business Owner',
    slug: 'small-business-owner',
    excerpt: 'Running a growing business but struggling with outdated systems and manual processes',
    icon: '/uploads/personas/small-business-icon.svg',
    publishDate: '2024-01-15T00:00:00.000Z',
    modifiedDate: '2024-01-20T00:00:00.000Z',
    tags: ['SME', 'Growth', 'Automation']
  };

  describe('generatePersonaMetadata', () => {
    it('should generate comprehensive metadata for persona', () => {
      const metadata = generatePersonaMetadata(mockPersona);

      expect(metadata.title).toContain('Small Business Owner Business Solutions');
      expect(metadata.title).toContain('Customer Success Story');
      expect(metadata.title).toContain('Dhīmahi Technolabs');
      
      expect(metadata.description).toContain('Running a growing business');
      expect(metadata.description).toContain('outdated systems');
      expect(metadata.description).toContain('manual processes');

      expect(metadata.keywords).toContain('small business owner');
      expect(metadata.keywords).toContain('customer persona');
      expect(metadata.keywords).toContain('business solutions');
      expect(metadata.keywords).toContain('SME');
      expect(metadata.keywords).toContain('Growth');
      expect(metadata.keywords).toContain('Automation');
    });

    it('should generate proper OpenGraph metadata', () => {
      const metadata = generatePersonaMetadata(mockPersona);

      expect(metadata.openGraph?.title).toContain('Small Business Owner - Customer Success Story');
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-15T00:00:00.000Z');
      expect(metadata.openGraph?.modifiedTime).toBe('2024-01-20T00:00:00.000Z');
      expect(metadata.openGraph?.section).toBe('Customer Personas');
      expect(metadata.openGraph?.images?.[0]?.url).toContain('/uploads/personas/small-business-icon.svg');
    });

    it('should generate proper Twitter metadata', () => {
      const metadata = generatePersonaMetadata(mockPersona);

      expect(metadata.twitter?.card).toBe('summary_large_image');
      expect(metadata.twitter?.title).toContain('Small Business Owner - Customer Success Story');
      expect(metadata.twitter?.creator).toBe('@dhimahitechnolabs');
      expect(metadata.twitter?.site).toBe('@dhimahitechnolabs');
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalPersona = {
        title: 'Test Persona',
        slug: 'test-persona',
        excerpt: 'Test excerpt'
      };

      const metadata = generatePersonaMetadata(minimalPersona);

      expect(metadata.title).toContain('Test Persona Business Solutions');
      expect(metadata.description).toContain('Test excerpt');
      expect(metadata.openGraph?.images?.[0]?.url).toContain('/og-image.png');
    });
  });

  describe('generatePersonaStructuredData', () => {
    it('should generate Article structured data', () => {
      const structuredData = generatePersonaStructuredData(mockPersona);

      expect(Array.isArray(structuredData)).toBe(true);
      expect(structuredData).toHaveLength(3); // Article, Breadcrumb, FAQ

      const articleData = structuredData[0];
      expect(articleData['@type']).toBe('Article');
      expect(articleData.headline).toContain('Small Business Owner - Customer Success Story');
      expect(articleData.author['@type']).toBe('Organization');
      expect(articleData.author.name).toBe('Dhīmahi Technolabs');
      expect(articleData.publisher['@type']).toBe('Organization');
      expect(articleData.publisher.name).toBe('Dhīmahi Technolabs');
      expect(articleData.datePublished).toBe('2024-01-15T00:00:00.000Z');
      expect(articleData.dateModified).toBe('2024-01-20T00:00:00.000Z');
      expect(articleData.articleSection).toBe('Customer Personas');
    });

    it('should generate BreadcrumbList structured data', () => {
      const structuredData = generatePersonaStructuredData(mockPersona);
      const breadcrumbData = structuredData[1];

      expect(breadcrumbData['@type']).toBe('BreadcrumbList');
      expect(breadcrumbData.itemListElement).toHaveLength(3);
      expect(breadcrumbData.itemListElement[0].name).toBe('Home');
      expect(breadcrumbData.itemListElement[1].name).toBe('Customer Personas');
      expect(breadcrumbData.itemListElement[2].name).toBe('Small Business Owner');
    });

    it('should include service mentions in structured data', () => {
      const structuredData = generatePersonaStructuredData(mockPersona);
      const articleData = structuredData[0];

      expect(articleData.mentions).toHaveLength(3);
      expect(articleData.mentions[0].name).toBe('Digital Transformation');
      expect(articleData.mentions[1].name).toBe('Business Automation');
      expect(articleData.mentions[2].name).toBe('IT Consulting');
      
      articleData.mentions.forEach((mention: any) => {
        expect(mention['@type']).toBe('Service');
        expect(mention.provider['@type']).toBe('Organization');
        expect(mention.provider.name).toBe('Dhīmahi Technolabs');
      });
    });

    it('should generate FAQ structured data', () => {
      const structuredData = generatePersonaStructuredData(mockPersona);
      const faqData = structuredData[2];

      expect(faqData['@type']).toBe('FAQPage');
      expect(faqData.mainEntity).toHaveLength(3);
      expect(faqData.mainEntity[0]['@type']).toBe('Question');
      expect(faqData.mainEntity[0].name).toContain('How can Dhīmahi Technolabs help Small Business Owner?');
      expect(faqData.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });

    it('should handle missing optional fields in structured data', () => {
      const minimalPersona = {
        title: 'Test Persona',
        slug: 'test-persona',
        excerpt: 'Test excerpt'
      };

      const structuredData = generatePersonaStructuredData(minimalPersona);
      const articleData = structuredData[0];

      expect(articleData.headline).toContain('Test Persona - Customer Success Story');
      expect(articleData.description).toBe('Test excerpt');
      expect(articleData.image.url).toContain('/og-image.png');
      expect(articleData.datePublished).toBeDefined();
      expect(articleData.dateModified).toBeDefined();
    });
  });
});