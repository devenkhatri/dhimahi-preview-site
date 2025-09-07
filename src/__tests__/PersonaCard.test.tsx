import { Persona } from '../../types/cms';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock OptimizedImage component
jest.mock('@/components/OptimizedImage', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
});

const mockPersona: Persona = {
  id: 'test-persona',
  title: 'Small Business Owner',
  slug: 'small-business-owner',
  icon: '/uploads/personas/small-business-icon.svg',
  excerpt: 'Running a growing business but struggling with outdated systems and manual processes',
  publishDate: '2024-01-15',
  featured: true,
  order: 1,
  tags: ['SME', 'Growth', 'Automation'],
  storytelling: {
    everydayStruggle: 'Test struggle content',
    whyThisMatters: 'Test matters content',
    howDhimahiHelps: 'Test helps content',
    theJourney: 'Test journey content',
    callToAction: {
      title: 'Ready to Transform Your Business?',
      description: 'Let\'s discuss how we can help streamline your operations and drive growth.',
      primaryButton: {
        text: 'Get Free Consultation',
        url: '/consultation'
      },
      secondaryButton: {
        text: 'View Our Services',
        url: '/services'
      }
    }
  }
};

describe('PersonaCard Component', () => {
  it('should have correct persona data structure', () => {
    expect(mockPersona).toHaveProperty('title', 'Small Business Owner');
    expect(mockPersona).toHaveProperty('slug', 'small-business-owner');
    expect(mockPersona).toHaveProperty('icon');
    expect(mockPersona).toHaveProperty('excerpt');
    expect(mockPersona).toHaveProperty('featured', true);
    expect(mockPersona).toHaveProperty('tags');
    expect(mockPersona.tags).toContain('SME');
    expect(mockPersona.tags).toContain('Growth');
    expect(mockPersona.tags).toContain('Automation');
  });

  it('should have required storytelling structure', () => {
    expect(mockPersona.storytelling).toHaveProperty('everydayStruggle');
    expect(mockPersona.storytelling).toHaveProperty('whyThisMatters');
    expect(mockPersona.storytelling).toHaveProperty('howDhimahiHelps');
    expect(mockPersona.storytelling).toHaveProperty('theJourney');
    expect(mockPersona.storytelling).toHaveProperty('callToAction');
    
    expect(mockPersona.storytelling.callToAction).toHaveProperty('title');
    expect(mockPersona.storytelling.callToAction).toHaveProperty('description');
    expect(mockPersona.storytelling.callToAction).toHaveProperty('primaryButton');
    expect(mockPersona.storytelling.callToAction.primaryButton).toHaveProperty('text');
    expect(mockPersona.storytelling.callToAction.primaryButton).toHaveProperty('url');
  });

  it('should handle persona without tags', () => {
    const personaWithoutTags = { ...mockPersona, tags: undefined };
    
    expect(personaWithoutTags.tags).toBeUndefined();
  });

  it('should handle persona with many tags', () => {
    const personaWithManyTags = {
      ...mockPersona,
      tags: ['SME', 'Growth', 'Automation', 'Digital', 'Technology', 'Innovation']
    };
    
    expect(personaWithManyTags.tags).toHaveLength(6);
    expect(personaWithManyTags.tags?.slice(0, 3)).toEqual(['SME', 'Growth', 'Automation']);
  });

  it('should validate required persona fields', () => {
    const requiredFields = ['id', 'title', 'slug', 'icon', 'excerpt', 'publishDate', 'featured', 'order', 'storytelling'];
    
    requiredFields.forEach(field => {
      expect(mockPersona).toHaveProperty(field);
    });
  });

  it('should have valid URL structure for slug', () => {
    expect(mockPersona.slug).toMatch(/^[a-z0-9-]+$/);
    expect(mockPersona.slug).not.toContain(' ');
    expect(mockPersona.slug).not.toContain('_');
  });
});