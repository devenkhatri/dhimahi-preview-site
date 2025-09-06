// URL utilities for SEO-friendly structures

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function createCanonicalUrl(path: string): string {
  const baseUrl = 'https://www.dhimahitechnolabs.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function createBreadcrumbs(pathname: string): Array<{ name: string; url: string }> {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable name
    let name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special cases for better naming
    switch (segment) {
      case 'insights':
        name = 'Insights';
        break;
      case 'services':
        name = 'Services';
        break;
      case 'portfolio':
        name = 'Portfolio';
        break;
      case 'consultation':
        name = 'Consultation';
        break;
      case 'quote':
        name = 'Get Quote';
        break;
      case 'resources':
        name = 'Resources';
        break;
      case 'tag':
        name = 'Tags';
        break;
      case 'search':
        name = 'Search';
        break;
    }

    breadcrumbs.push({
      name,
      url: currentPath,
    });
  });

  return breadcrumbs;
}

export function generateHreflang(pathname: string): Array<{ lang: string; url: string }> {
  const baseUrl = 'https://www.dhimahitechnolabs.com';
  
  return [
    {
      lang: 'en',
      url: `${baseUrl}${pathname}`,
    },
    {
      lang: 'gu',
      url: `${baseUrl}/gu${pathname}`,
    },
    {
      lang: 'x-default',
      url: `${baseUrl}${pathname}`,
    },
  ];
}

export function createPaginationUrls(
  basePath: string,
  currentPage: number,
  totalPages: number
): {
  prev?: string;
  next?: string;
  first: string;
  last: string;
} {
  const baseUrl = 'https://www.dhimahitechnolabs.com';
  const cleanBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;

  return {
    prev: currentPage > 1 ? `${baseUrl}${cleanBasePath}?page=${currentPage - 1}` : undefined,
    next: currentPage < totalPages ? `${baseUrl}${cleanBasePath}?page=${currentPage + 1}` : undefined,
    first: `${baseUrl}${cleanBasePath}`,
    last: `${baseUrl}${cleanBasePath}?page=${totalPages}`,
  };
}

export function extractSearchParams(searchParams: URLSearchParams): {
  page: number;
  query?: string;
  category?: string;
  tag?: string;
  sort?: string;
} {
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
    query: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    sort: searchParams.get('sort') || undefined,
  };
}

export function buildSearchUrl(
  basePath: string,
  params: {
    query?: string;
    category?: string;
    tag?: string;
    page?: number;
    sort?: string;
  }
): string {
  const url = new URL(basePath, 'https://www.dhimahitechnolabs.com');
  
  if (params.query) url.searchParams.set('q', params.query);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.tag) url.searchParams.set('tag', params.tag);
  if (params.page && params.page > 1) url.searchParams.set('page', params.page.toString());
  if (params.sort) url.searchParams.set('sort', params.sort);

  return url.toString();
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isInternalUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'www.dhimahitechnolabs.com' || 
           urlObj.hostname === 'dhimahitechnolabs.com';
  } catch {
    return false;
  }
}

// Social media URL builders
export function createSocialShareUrls(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };
}

// Sitemap URL generation
export function generateSitemapUrls(): Array<{
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}> {
  const baseUrl = 'https://www.dhimahitechnolabs.com';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/consultation`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];
}