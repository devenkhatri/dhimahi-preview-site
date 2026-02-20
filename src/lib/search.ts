import { getAllPersonas, getAllResources } from './content';
import { getAllCMSServices, getAllCMSInsights, getAllCMSCaseStudies } from './cms-content';

export interface SearchResult {
  type: 'service' | 'insight' | 'persona' | 'case-study' | 'resource' | 'about';
  title: string;
  excerpt: string;
  href: string;
  icon?: string;
  tags: string[];
  category?: string;
  publishDate?: Date;
}

export function getAllSearchableContent(): SearchResult[] {
  const searchableContent: SearchResult[] = [];

  // Add services
  try {
    const services = getAllCMSServices();
    services.forEach(service => {
      searchableContent.push({
        type: 'service',
        title: service.title,
        excerpt: service.excerpt,
        href: `/services/${service.slug}`,
        icon: service.icon,
        tags: [
          service.title.toLowerCase(),
          ...service.features.slice(0, 5).map(f => f.toLowerCase()),
          'service',
          'business solution'
        ],
      });
    });
  } catch (error) {
    console.warn('Could not load services for search:', error);
  }

  // Add insights
  try {
    const insights = getAllCMSInsights();
    insights.forEach(insight => {
      searchableContent.push({
        type: 'insight',
        title: insight.title,
        excerpt: insight.excerpt,
        href: `/insights/${insight.slug}`,
        tags: insight.tags,
        category: insight.category,
        publishDate: insight.publishDate,
      });
    });
  } catch (error) {
    console.warn('Could not load insights for search:', error);
  }

  // Add personas
  try {
    const personas = getAllPersonas();
    personas.forEach(persona => {
      searchableContent.push({
        type: 'persona',
        title: persona.title,
        excerpt: persona.excerpt,
        href: `/personas/${persona.slug}`,
        tags: [
          ...persona.tags,
          'persona',
          'business type',
          'customer story'
        ],
        publishDate: new Date(persona.publishDate),
      });
    });
  } catch (error) {
    console.warn('Could not load personas for search:', error);
  }

  // Add case studies
  try {
    const caseStudies = getAllCMSCaseStudies();
    caseStudies.forEach(caseStudy => {
      searchableContent.push({
        type: 'case-study',
        title: caseStudy.title,
        excerpt: caseStudy.excerpt,
        href: `/portfolio/${caseStudy.slug}`,
        icon: '🏆',
        tags: [
          caseStudy.category,
          caseStudy.client?.industry || '',
          caseStudy.projectType || '',
          ...(caseStudy.services || []),
          'case study',
          'portfolio',
          'project'
        ].filter(Boolean),
        category: caseStudy.category,
        publishDate: caseStudy.publishDate,
      });
    });
  } catch (error) {
    console.warn('Could not load case studies for search:', error);
  }

  // Add resources
  try {
    const resources = getAllResources();
    resources.forEach(resource => {
      searchableContent.push({
        type: 'resource',
        title: resource.title,
        excerpt: resource.description,
        href: `/resources`,
        icon: '📚',
        tags: [
          resource.type,
          ...(resource.tags || []),
          'resource',
          'download',
          'guide',
          'checklist',
          'template'
        ].filter(Boolean),
        category: resource.type,
      });
    });
  } catch (error) {
    console.warn('Could not load resources for search:', error);
  }

  // Add About Us page as a static searchable entry
  searchableContent.push({
    type: 'about',
    title: 'About Dhīmahi Technolabs',
    excerpt: 'Learn about our 25+ years of experience helping SMEs in Gujarat with IT, AI, and digital marketing solutions. Meet our team and discover our mission.',
    href: '/about',
    icon: 'ℹ️',
    tags: [
      'about', 'company', 'team', 'mission', 'vision', 'values', 'history',
      'founder', 'experience', 'gujarat', 'ahmedabad', 'gandhinagar', 'sme', 'it consultancy'
    ],
  });

  return searchableContent;
}

export function searchContent(query: string, contentType?: 'service' | 'insight' | 'persona' | 'case-study' | 'resource' | 'about'): SearchResult[] {
  const allContent = getAllSearchableContent();

  if (!query.trim()) {
    return contentType ? allContent.filter(item => item.type === contentType) : allContent;
  }

  const searchTerm = query.toLowerCase();

  let filteredContent = allContent.filter(item =>
    item.title.toLowerCase().includes(searchTerm) ||
    item.excerpt.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    item.category?.toLowerCase().includes(searchTerm)
  );

  if (contentType) {
    filteredContent = filteredContent.filter(item => item.type === contentType);
  }

  // Sort by relevance (title matches first, then excerpt, then tags)
  return filteredContent.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(searchTerm) ? 3 : 0;
    const aExcerpt = a.excerpt.toLowerCase().includes(searchTerm) ? 2 : 0;
    const aTags = a.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0;
    const aScore = aTitle + aExcerpt + aTags;

    const bTitle = b.title.toLowerCase().includes(searchTerm) ? 3 : 0;
    const bExcerpt = b.excerpt.toLowerCase().includes(searchTerm) ? 2 : 0;
    const bTags = b.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0;
    const bScore = bTitle + bExcerpt + bTags;

    return bScore - aScore;
  });
}