import { getAllPersonas } from './content';
import { getAllCMSServices, getAllCMSInsights } from './cms-content';

export interface SearchResult {
  type: 'service' | 'insight' | 'persona';
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

  return searchableContent;
}

export function searchContent(query: string, contentType?: 'service' | 'insight' | 'persona'): SearchResult[] {
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