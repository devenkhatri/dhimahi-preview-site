import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');
const resourcesDirectory = path.join(contentDirectory, 'resources');

export interface HomepageContent {
  hero: {
    mainHeadline: string;
    subheadline: string;
    trustBadge: string;
    statistics: Array<{
      value: number;
      suffix: string;
      label: string;
    }>;
    ctaButtons: {
      primary: string;
      secondary: string;
    };
    trustIndicators: string[];
    floatingBadges: Array<{
      icon: string;
      text: string;
    }>;
  };
  services: {
    title: string;
    subtitle: string;
  };
  whyChooseUs: {
    title: string;
    subtitle: string;
    reasons: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      quote: string;
      author: string;
    }>;
  };
  contactCta: {
    title: string;
    description: string;
    buttons: {
      primary: string;
      secondary: string;
    };
  };
  contactForm: {
    title: string;
    description: string;
    email: string;
  };
}

export interface AboutContent {
  title: string;
  subtitle: string;
  subIntroduction?: string;
  mission: {
    title: string;
    description: string;
    vision: string;
  };
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  ceo?: {
    name: string;
    position: string;
    photo?: string;
    story: string;
    linkedinUrl?: string;
  };
  team: Array<{
    name: string;
    role: string;
    bio: string;
    expertise: string[];
  }>;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'checklist' | 'guide' | 'template' | 'calculator';
  fileSize: string;
  pages: number;
  downloadUrl: string;
  featured: boolean;
  order: number;
  publishDate: string;
  tags?: string[];
  slug: string;
}

export function getHomepageContent(): HomepageContent {
  const fullPath = path.join(contentDirectory, 'homepage.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);

  // Parse the markdown content and extract structured data
  return {
    hero: {
      mainHeadline: "Transform Your Business with AI",
      subheadline: "**Dhīmahi Technolabs** helps SMEs in Ahmedabad & Gandhinagar grow with **AI automation, digital marketing, and smart IT strategy** — practical solutions that deliver real ROI.",
      trustBadge: "Gujarat's Preferred IT Partner",
      statistics: [
        { value: 25, suffix: "+", label: "Years Experience" },
        { value: 200, suffix: "+", label: "Businesses Transformed" },
        { value: 95, suffix: "%", label: "Client Satisfaction" }
      ],
      ctaButtons: {
        primary: "Get Free AI Consultation",
        secondary: "Explore Our Services"
      },
      trustIndicators: [
        "Free consultation",
        "ROI-focused approach",
        "Local Gujarat expertise"
      ],
      floatingBadges: [
        { icon: "🏆", text: "25+ Years Expertise" },
        { icon: "🚀", text: "AI-Ready Solutions" },
        { icon: "📈", text: "Proven ROI Results" },
        { icon: "🎯", text: "Gujarat SME Focus" }
      ]
    },
    services: {
      title: "Our Services",
      subtitle: "Helping SMEs in Ahmedabad & Gandhinagar grow with AI, digital marketing, and smart IT strategy."
    },
    whyChooseUs: {
      title: "Why Choose Dhīmahi Technolabs?",
      subtitle: "With 25+ years of IT expertise, we help SMEs take smarter digital steps — practical, affordable, and future-ready.",
      reasons: [
        {
          icon: "👨‍💼",
          title: "25+ Years of Experience",
          description: "Deep expertise in IT, digital marketing, and AI — guiding SMEs with proven strategies, not experiments."
        },
        {
          icon: "📍",
          title: "Local Focus",
          description: "We understand the needs of Ahmedabad & Gandhinagar businesses and provide solutions tailored to your market."
        },
        {
          icon: "💡",
          title: "Practical & Affordable",
          description: "No enterprise complexity — just straightforward, cost-effective IT and digital solutions that deliver ROI."
        },
        {
          icon: "🚀",
          title: "Future-Ready Solutions",
          description: "From AI to automation, we help you stay ahead of the curve and prepare your business for tomorrow."
        }
      ]
    },
    testimonials: {
      title: "Client Success Stories",
      subtitle: "We've helped SMEs across Gujarat streamline operations, grow online, and adopt future-ready IT solutions.",
      items: [
        {
          quote: "With Dhimahi Technolabs, we automated our sales follow-ups using AI tools. Our response time improved by 70%, and our small sales team now closes more deals effortlessly.",
          author: "Owner, Manufacturing SME (Ahmedabad)"
        },
        {
          quote: "Our website was outdated and invisible on Google. Dhimahi redesigned it and implemented SEO. Within 3 months, we started getting steady inquiries and 40% more leads.",
          author: "Director, Service Company (Gandhinagar)"
        },
        {
          quote: "As a growing business, we were confused about which CRM and ERP tools to invest in. Dhimahi guided us like a Fractional CTO and saved us lakhs in wrong purchases.",
          author: "Founder, Trading Firm (Ahmedabad)"
        }
      ]
    },
    contactCta: {
      title: "Let's Discuss Your Business Goals",
      description: "Your first consultation is **free**. Let's explore how AI, digital growth, and smart IT strategy can help your business scale.",
      buttons: {
        primary: "Book Free Consultation",
        secondary: "Get Project Quote"
      }
    },
    contactForm: {
      title: "Send us a message",
      description: "Tell us briefly about your goals. We'll reply within 1 business day.",
      email: "hello@dhimahitechnolabs.com"
    }
  };
}

export function getAboutContent(): AboutContent {
  const fullPath = path.join(contentDirectory, 'about.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);

  return {
    title: "About Dhīmahi Technolabs",
    subtitle: "Making technology accessible to SMEs across Gujarat for over 25 years. We bridge the gap between traditional business values and modern digital solutions.",
    mission: {
      title: "Our Mission",
      description: "To empower small and medium businesses in Ahmedabad & Gandhinagar and beyond with practical, affordable, and future-ready technology solutions that drive real business growth.",
      vision: "To be Gujarat's most trusted IT consultancy, known for transforming SMEs into digitally empowered, future-ready businesses that compete confidently in the modern marketplace."
    },
    values: [
      {
        icon: "🤝",
        title: "Trust & Transparency",
        description: "We build lasting relationships through honest communication, clear pricing, and reliable delivery. Your success is our success."
      },
      {
        icon: "💡",
        title: "Innovation with Purpose",
        description: "We don't chase every tech trend. Instead, we carefully select solutions that deliver real business value and ROI."
      },
      {
        icon: "🎯",
        title: "SME-Focused Approach",
        description: "We understand the unique challenges of small and medium businesses and tailor our solutions accordingly."
      },
      {
        icon: "📚",
        title: "Continuous Learning",
        description: "Technology evolves rapidly. We stay ahead of the curve to ensure our clients benefit from the latest innovations."
      },
      {
        icon: "🌱",
        title: "Sustainable Growth",
        description: "We help businesses grow sustainably, building strong foundations rather than quick fixes."
      },
      {
        icon: "🏠",
        title: "Local Expertise",
        description: "Deep understanding of the Gujarat business landscape and local market dynamics."
      }
    ],
    timeline: [
      {
        year: "1999",
        title: "Foundation & Early Years",
        description: "Started as a small IT services company, focusing on basic web development and computer solutions for local businesses in Ahmedabad."
      },
      {
        year: "2005",
        title: "Digital Marketing Expansion",
        description: "Expanded into digital marketing services as businesses began recognizing the importance of online presence and search engine visibility."
      },
      {
        year: "2015",
        title: "Cloud & Mobile Revolution",
        description: "Embraced cloud technologies and mobile-first approaches, helping clients transition from traditional systems to modern, scalable solutions."
      },
      {
        year: "2020",
        title: "AI & Automation Focus",
        description: "Pivoted to include AI consulting and business process automation, recognizing the transformative potential for SMEs."
      },
      {
        year: "2024",
        title: "Future-Ready Consultancy",
        description: "Evolved into a comprehensive IT consultancy, offering fractional CTO services and strategic technology guidance for growing businesses."
      }
    ],
    team: [
      {
        name: "Rajesh Patel",
        role: "Founder & Chief Technology Officer",
        bio: "With 25+ years in IT, Rajesh leads our technology vision and ensures we stay ahead of industry trends while maintaining practical, business-focused solutions.",
        expertise: ["IT Strategy", "AI Consulting", "Business Automation", "Team Leadership"]
      },
      {
        name: "Priyal Shah",
        role: "Digital Marketing Director",
        bio: "Priyal brings 15+ years of digital marketing expertise, specializing in helping SMEs build strong online presence and generate quality leads.",
        expertise: ["SEO", "PPC", "Social Media", "Content Strategy"]
      },
      {
        name: "Amit Desai",
        role: "Senior Web Developer",
        bio: "Amit is our technical lead for web development projects, ensuring every website we build is fast, secure, and user-friendly.",
        expertise: ["React", "Next.js", "WordPress", "E-commerce"]
      }
    ]
  };
}

/**
 * Get all resources from the content/resources directory
 * Returns resources sorted by order (ascending) and then by publishDate (descending)
 */
export function getAllResources(): Resource[] {
  try {
    // Check if resources directory exists
    if (!fs.existsSync(resourcesDirectory)) {
      console.warn('Resources directory does not exist:', resourcesDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(resourcesDirectory);
    const resources: Resource[] = [];

    for (const fileName of fileNames) {
      // Skip non-markdown files and hidden files
      if (!fileName.endsWith('.md') || fileName.startsWith('.')) {
        continue;
      }

      try {
        const fullPath = path.join(resourcesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        // Validate required fields
        if (!data.title || !data.description || !data.type || !data.downloadUrl) {
          console.warn(`Resource ${fileName} is missing required fields, skipping`);
          continue;
        }

        // Create resource object with defaults for optional fields
        const resource: Resource = {
          id: data.id || path.basename(fileName, '.md'),
          title: data.title,
          description: data.description,
          type: data.type,
          fileSize: data.fileSize || 'Unknown',
          pages: data.pages || 0,
          downloadUrl: data.downloadUrl,
          featured: data.featured || false,
          order: data.order || 999,
          publishDate: data.publishDate || new Date().toISOString(),
          tags: data.tags || [],
          slug: data.slug || path.basename(fileName, '.md')
        };

        resources.push(resource);
      } catch (error) {
        console.error(`Error processing resource file ${fileName}:`, error);
        continue;
      }
    }

    // Sort resources by order (ascending), then by publishDate (descending) for duplicate orders
    return sortResources(resources, 'order', 'asc');
  } catch (error) {
    console.error('Error reading resources directory:', error);
    return [];
  }
}

/**
 * Get the featured resource with fallback logic
 * Returns the first resource marked as featured, or the first resource in the list if none are featured
 */
export function getFeaturedResource(): Resource | null {
  try {
    const allResources = getAllResources();
    
    if (allResources.length === 0) {
      return null;
    }

    // Find the first resource marked as featured
    const featuredResource = allResources.find(resource => resource.featured);
    
    // If no featured resource found, return the first resource in the sorted list
    return featuredResource || allResources[0];
  } catch (error) {
    console.error('Error getting featured resource:', error);
    return null;
  }
}

/**
 * Get resources filtered by type
 * @param type - The resource type to filter by
 * @returns Array of resources matching the specified type, sorted by order and publishDate
 */
export function getResourcesByType(type: Resource['type']): Resource[] {
  try {
    const allResources = getAllResources();
    return allResources.filter(resource => resource.type === type);
  } catch (error) {
    console.error(`Error getting resources by type ${type}:`, error);
    return [];
  }
}

/**
 * Get resources filtered by multiple types
 * @param types - Array of resource types to filter by
 * @returns Array of resources matching any of the specified types, sorted by order and publishDate
 */
export function getResourcesByTypes(types: Resource['type'][]): Resource[] {
  try {
    const allResources = getAllResources();
    return allResources.filter(resource => types.includes(resource.type));
  } catch (error) {
    console.error(`Error getting resources by types ${types.join(', ')}:`, error);
    return [];
  }
}

/**
 * Get all unique resource types available
 * @returns Array of unique resource types
 */
export function getResourceTypes(): Resource['type'][] {
  try {
    const allResources = getAllResources();
    const types = allResources.map(resource => resource.type);
    return Array.from(new Set(types));
  } catch (error) {
    console.error('Error getting resource types:', error);
    return [];
  }
}

/**
 * Sort resources with enhanced logic
 * @param resources - Array of resources to sort
 * @param sortBy - Sort criteria: 'order' (default), 'date', 'title', 'type'
 * @param sortOrder - Sort direction: 'asc' or 'desc'
 * @returns Sorted array of resources
 */
export function sortResources(
  resources: Resource[], 
  sortBy: 'order' | 'date' | 'title' | 'type' = 'order',
  sortOrder: 'asc' | 'desc' = 'asc'
): Resource[] {
  try {
    return [...resources].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'order':
          // Primary sort by order, secondary by publishDate (newest first)
          if (a.order !== b.order) {
            comparison = a.order - b.order;
          } else {
            comparison = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
          }
          break;
          
        case 'date':
          comparison = new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
          break;
          
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
          
        case 'type':
          // Sort by type, then by order within each type
          if (a.type !== b.type) {
            comparison = a.type.localeCompare(b.type);
          } else {
            comparison = a.order - b.order;
          }
          break;
          
        default:
          comparison = a.order - b.order;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  } catch (error) {
    console.error('Error sorting resources:', error);
    return resources;
  }
}

/**
 * Filter and sort resources with multiple criteria
 * @param options - Filtering and sorting options
 * @returns Filtered and sorted array of resources
 */
export function getFilteredResources(options: {
  types?: Resource['type'][];
  featured?: boolean;
  sortBy?: 'order' | 'date' | 'title' | 'type';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}): Resource[] {
  try {
    let resources = getAllResources();
    
    // Filter by types if specified
    if (options.types && options.types.length > 0) {
      resources = resources.filter(resource => options.types!.includes(resource.type));
    }
    
    // Filter by featured status if specified
    if (options.featured !== undefined) {
      resources = resources.filter(resource => resource.featured === options.featured);
    }
    
    // Sort resources
    resources = sortResources(resources, options.sortBy, options.sortOrder);
    
    // Limit results if specified
    if (options.limit && options.limit > 0) {
      resources = resources.slice(0, options.limit);
    }
    
    return resources;
  } catch (error) {
    console.error('Error filtering resources:', error);
    return [];
  }
}

/**
 * Get a single resource by its slug
 * @param slug - The resource slug to find
 * @returns The resource if found, null otherwise
 */
export function getResourceBySlug(slug: string): Resource | null {
  try {
    const allResources = getAllResources();
    return allResources.find(resource => resource.slug === slug) || null;
  } catch (error) {
    console.error(`Error getting resource by slug ${slug}:`, error);
    return null;
  }
}

// Persona-specific interfaces and utilities
export interface Persona {
  id: string;
  title: string;
  slug: string;
  icon: string;
  excerpt: string;
  publishDate: string;
  featured: boolean;
  order: number;
  storytelling: {
    everydayStruggle: string;
    whyThisMatters: string;
    howDhimahiHelps: string;
    theJourney: string;
    callToAction: {
      title: string;
      description: string;
      primaryButton: {
        text: string;
        url: string;
      };
      secondaryButton?: {
        text: string;
        url: string;
      };
    };
  };
  tags?: string[];
}

const personasDirectory = path.join(contentDirectory, 'personas');

/**
 * Validate persona data structure with enhanced error handling and fallbacks
 * @param data - Raw persona data from frontmatter
 * @param fileName - File name for error reporting
 * @returns object with validation result and sanitized data
 */
function validatePersonaData(data: any, fileName: string): { isValid: boolean; data?: any; errors: string[] } {
  const errors: string[] = [];
  const sanitizedData = { ...data };

  // Essential fields that must exist
  const essentialFields = ['title', 'slug'];
  
  // Check essential fields
  for (const field of essentialFields) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      errors.push(`Missing or invalid essential field: ${field}`);
      return { isValid: false, errors };
    }
  }

  // Provide fallbacks for optional fields
  if (!sanitizedData.excerpt || typeof sanitizedData.excerpt !== 'string') {
    sanitizedData.excerpt = `Discover how ${sanitizedData.title} overcomes business challenges with our solutions.`;
    console.warn(`Persona ${fileName}: Using fallback excerpt`);
  }

  if (!sanitizedData.icon || typeof sanitizedData.icon !== 'string') {
    sanitizedData.icon = '/uploads/personas/default-persona-icon.svg';
    console.warn(`Persona ${fileName}: Using fallback icon`);
  }

  // Validate and sanitize storytelling structure
  if (!sanitizedData.storytelling || typeof sanitizedData.storytelling !== 'object') {
    errors.push('Missing or invalid storytelling object');
    return { isValid: false, errors };
  }

  const storytelling = sanitizedData.storytelling;
  const storyFields = ['everydayStruggle', 'whyThisMatters', 'howDhimahiHelps', 'theJourney'];
  
  // Check storytelling fields with fallbacks
  for (const field of storyFields) {
    if (!storytelling[field] || typeof storytelling[field] !== 'string' || storytelling[field].trim() === '') {
      storytelling[field] = `This section for ${sanitizedData.title} is currently being developed. Please check back soon for detailed content.`;
      console.warn(`Persona ${fileName}: Using fallback for storytelling.${field}`);
    }
  }

  // Validate and sanitize call to action
  if (!storytelling.callToAction || typeof storytelling.callToAction !== 'object') {
    storytelling.callToAction = {
      title: 'Ready to Transform Your Business?',
      description: `Let's discuss how we can help ${sanitizedData.title} overcome challenges and achieve growth.`,
      primaryButton: {
        text: 'Get Free Consultation',
        url: '/consultation'
      }
    };
    console.warn(`Persona ${fileName}: Using fallback call to action`);
  } else {
    const cta = storytelling.callToAction;
    
    // Sanitize CTA fields
    if (!cta.title || typeof cta.title !== 'string') {
      cta.title = 'Ready to Transform Your Business?';
    }
    
    if (!cta.description || typeof cta.description !== 'string') {
      cta.description = `Let's discuss how we can help ${sanitizedData.title} overcome challenges and achieve growth.`;
    }

    // Validate primary button
    if (!cta.primaryButton || typeof cta.primaryButton !== 'object') {
      cta.primaryButton = {
        text: 'Get Free Consultation',
        url: '/consultation'
      };
      console.warn(`Persona ${fileName}: Using fallback primary button`);
    } else {
      if (!cta.primaryButton.text || typeof cta.primaryButton.text !== 'string') {
        cta.primaryButton.text = 'Get Free Consultation';
      }
      if (!cta.primaryButton.url || typeof cta.primaryButton.url !== 'string') {
        cta.primaryButton.url = '/consultation';
      }
    }

    // Validate secondary button if it exists
    if (cta.secondaryButton && typeof cta.secondaryButton === 'object') {
      if (!cta.secondaryButton.text || typeof cta.secondaryButton.text !== 'string') {
        cta.secondaryButton.text = 'Learn More';
      }
      if (!cta.secondaryButton.url || typeof cta.secondaryButton.url !== 'string') {
        cta.secondaryButton.url = '/services';
      }
    }
  }

  // Sanitize other optional fields
  if (!Array.isArray(sanitizedData.tags)) {
    sanitizedData.tags = [];
  }

  if (typeof sanitizedData.featured !== 'boolean') {
    sanitizedData.featured = false;
  }

  if (typeof sanitizedData.order !== 'number' || sanitizedData.order < 0) {
    sanitizedData.order = 999;
  }

  if (!sanitizedData.publishDate || typeof sanitizedData.publishDate !== 'string') {
    sanitizedData.publishDate = new Date().toISOString();
  }

  // Handle modifiedDate - optional field
  if (sanitizedData.modifiedDate && typeof sanitizedData.modifiedDate !== 'string') {
    sanitizedData.modifiedDate = undefined;
  }

  return { isValid: true, data: sanitizedData, errors };
}

/**
 * Get all personas from the content/personas directory
 * Returns personas sorted by order (ascending) and then by publishDate (descending)
 */
export function getAllPersonas(): Persona[] {
  try {
    // Check if personas directory exists
    if (!fs.existsSync(personasDirectory)) {
      console.warn('Personas directory does not exist:', personasDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(personasDirectory);
    const personas: Persona[] = [];

    for (const fileName of fileNames) {
      // Skip non-markdown files and hidden files
      if (!fileName.endsWith('.md') || fileName.startsWith('.')) {
        continue;
      }

      try {
        const fullPath = path.join(personasDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        // Validate and sanitize persona data structure
        const validation = validatePersonaData(data, fileName);
        if (!validation.isValid) {
          console.error(`Skipping invalid persona ${fileName}:`, validation.errors);
          continue;
        }
        
        // Use sanitized data
        const sanitizedData = validation.data;

        // Create persona object with sanitized data
        const persona: Persona = {
          id: sanitizedData.id || path.basename(fileName, '.md'),
          title: sanitizedData.title,
          slug: sanitizedData.slug,
          icon: sanitizedData.icon,
          excerpt: sanitizedData.excerpt,
          publishDate: sanitizedData.publishDate,
          ...(sanitizedData.modifiedDate && { modifiedDate: sanitizedData.modifiedDate }),
          featured: sanitizedData.featured,
          order: sanitizedData.order,
          storytelling: {
            everydayStruggle: sanitizedData.storytelling.everydayStruggle,
            whyThisMatters: sanitizedData.storytelling.whyThisMatters,
            howDhimahiHelps: sanitizedData.storytelling.howDhimahiHelps,
            theJourney: sanitizedData.storytelling.theJourney,
            callToAction: {
              title: sanitizedData.storytelling.callToAction.title,
              description: sanitizedData.storytelling.callToAction.description,
              primaryButton: {
                text: sanitizedData.storytelling.callToAction.primaryButton.text,
                url: sanitizedData.storytelling.callToAction.primaryButton.url,
              },
              secondaryButton: sanitizedData.storytelling.callToAction.secondaryButton ? {
                text: sanitizedData.storytelling.callToAction.secondaryButton.text,
                url: sanitizedData.storytelling.callToAction.secondaryButton.url,
              } : undefined,
            },
          },
          tags: sanitizedData.tags,
        };

        personas.push(persona);
      } catch (error) {
        console.error(`Error processing persona file ${fileName}:`, error);
        continue;
      }
    }

    // Sort personas by order (ascending), then by publishDate (descending) for duplicate orders
    return sortPersonas(personas, 'order', 'asc');
  } catch (error) {
    console.error('Error reading personas directory:', error);
    return [];
  }
}

/**
 * Get a single persona by its slug
 * @param slug - The persona slug to find
 * @returns The persona if found, null otherwise
 */
export function getPersonaBySlug(slug: string): Persona | null {
  try {
    const allPersonas = getAllPersonas();
    return allPersonas.find(persona => persona.slug === slug) || null;
  } catch (error) {
    console.error(`Error getting persona by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get featured personas
 * Returns personas marked as featured, sorted by order and publishDate
 */
export function getFeaturedPersonas(): Persona[] {
  try {
    const allPersonas = getAllPersonas();
    return allPersonas.filter(persona => persona.featured);
  } catch (error) {
    console.error('Error getting featured personas:', error);
    return [];
  }
}

/**
 * Sort personas with enhanced logic
 * @param personas - Array of personas to sort
 * @param sortBy - Sort criteria: 'order' (default), 'date', 'title'
 * @param sortOrder - Sort direction: 'asc' or 'desc'
 * @returns Sorted array of personas
 */
export function sortPersonas(
  personas: Persona[], 
  sortBy: 'order' | 'date' | 'title' = 'order',
  sortOrder: 'asc' | 'desc' = 'asc'
): Persona[] {
  try {
    return [...personas].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'order':
          // Primary sort by order, secondary by publishDate (newest first)
          if (a.order !== b.order) {
            comparison = a.order - b.order;
          } else {
            comparison = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
          }
          break;
          
        case 'date':
          comparison = new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
          break;
          
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
          
        default:
          comparison = a.order - b.order;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  } catch (error) {
    console.error('Error sorting personas:', error);
    return personas;
  }
}

/**
 * Filter and sort personas with multiple criteria
 * @param options - Filtering and sorting options
 * @returns Filtered and sorted array of personas
 */
export function getFilteredPersonas(options: {
  featured?: boolean;
  tags?: string[];
  sortBy?: 'order' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}): Persona[] {
  try {
    let personas = getAllPersonas();
    
    // Filter by featured status if specified
    if (options.featured !== undefined) {
      personas = personas.filter(persona => persona.featured === options.featured);
    }
    
    // Filter by tags if specified
    if (options.tags && options.tags.length > 0) {
      personas = personas.filter(persona => 
        persona.tags && persona.tags.some(tag => options.tags!.includes(tag))
      );
    }
    
    // Sort personas
    personas = sortPersonas(personas, options.sortBy, options.sortOrder);
    
    // Limit results if specified
    if (options.limit && options.limit > 0) {
      personas = personas.slice(0, options.limit);
    }
    
    return personas;
  } catch (error) {
    console.error('Error filtering personas:', error);
    return [];
  }
}

/**
 * Get insights relevant to a specific persona
 * @param personaSlug - The persona slug to find insights for
 * @param personaTags - The persona's tags for additional matching
 * @param limit - Maximum number of insights to return
 * @returns Array of relevant insights
 */
export function getPersonaSpecificInsights(personaSlug: string, personaTags: string[] = [], limit: number = 4) {
  try {
    // Import here to avoid circular dependency
    const { getAllCMSInsights } = require('./cms-content');
    const allInsights = getAllCMSInsights();
    
    // Mapping of persona slugs to relevant insight tags and categories
    const personaInsightMapping: Record<string, { tags: string[]; categories: string[] }> = {
      'small-business-owner': {
        tags: ['SME', 'Digital Marketing', 'Business Strategy', 'Growth', 'Automation', 'CRM', 'Lead Generation'],
        categories: ['Digital Marketing', 'Business Strategy', 'AI & Automation']
      },
      'doctors': {
        tags: ['Healthcare', 'Medical', 'Patient Management', 'Appointment Booking', 'Customer Service', 'Automation'],
        categories: ['AI & Automation', 'Business Strategy', 'Digital Marketing']
      },
      'builders': {
        tags: ['Real Estate', 'Construction', 'Digital Marketing', 'Lead Generation', 'Project Management', 'SME'],
        categories: ['Digital Marketing', 'Business Strategy', 'Web Development']
      },
      'retail-entrepreneur': {
        tags: ['E-commerce', 'Retail', 'Inventory Management', 'Customer Retention', 'Digital Marketing', 'SME'],
        categories: ['Digital Marketing', 'Business Strategy', 'Web Development']
      },
      'chartered-accountants': {
        tags: ['Financial Management', 'Accounting Software', 'GST', 'Compliance', 'Automation', 'SME'],
        categories: ['AI & Automation', 'Business Strategy', 'IT Strategy']
      },
      'physiotherapists': {
        tags: ['Healthcare', 'Medical', 'Patient Management', 'Appointment Booking', 'Customer Service', 'SME'],
        categories: ['AI & Automation', 'Business Strategy', 'Digital Marketing']
      },
      'it-colleagues': {
        tags: ['IT Strategy', 'Technology Adoption', 'Digital Transformation', 'Cybersecurity', 'Cloud Migration'],
        categories: ['IT Strategy', 'AI & Automation', 'Business Strategy']
      },
      'digital-media-house': {
        tags: ['Digital Marketing', 'Content Marketing', 'Social Media', 'Brand Building', 'Creative Services'],
        categories: ['Digital Marketing', 'Web Development', 'Business Strategy']
      },
      'friends-family-members': {
        tags: ['SME', 'Business Strategy', 'Digital Transformation', 'Technology Adoption', 'Growth'],
        categories: ['Business Strategy', 'Digital Marketing', 'IT Strategy']
      },
      'jewelry-store-owner': {
        tags: ['E-commerce', 'Retail', 'Digital Marketing', 'Customer Retention', 'Local SEO', 'SME'],
        categories: ['Digital Marketing', 'Web Development', 'Business Strategy']
      },
      'restaurant-owner': {
        tags: ['Local SEO', 'Customer Service', 'Digital Marketing', 'Online Ordering', 'Social Media', 'SME'],
        categories: ['Digital Marketing', 'AI & Automation', 'Business Strategy']
      },
      'textile-manufacturer': {
        tags: ['Manufacturing', 'Supply Chain', 'Inventory Management', 'Quality Control', 'ERP', 'SME'],
        categories: ['AI & Automation', 'Business Strategy', 'IT Strategy']
      },
      'ecommerce-business-owners': {
        tags: ['E-commerce', 'Online Sales', 'Digital Marketing', 'Customer Analytics', 'Automation', 'SME'],
        categories: ['Digital Marketing', 'Web Development', 'AI & Automation']
      }
    };
    
    // Get relevant tags and categories for this persona
    const personaMapping = personaInsightMapping[personaSlug] || { tags: [], categories: [] };
    const allTags = [...personaTags, ...personaMapping.tags];
    const relevantTags = Array.from(new Set(allTags));
    const relevantCategories = personaMapping.categories;
    
    // Score insights based on relevance
    const scoredInsights = allInsights.map((insight: any) => {
      let score = 0;
      
      // Score based on tag matches
      const tagMatches = insight.tags.filter((tag: string) => 
        relevantTags.some(relevantTag => 
          tag.toLowerCase().includes(relevantTag.toLowerCase()) ||
          relevantTag.toLowerCase().includes(tag.toLowerCase())
        )
      ).length;
      score += tagMatches * 3;
      
      // Score based on category matches
      if (relevantCategories.includes(insight.category)) {
        score += 2;
      }
      
      // Boost score for SME-related content
      if (insight.tags.some((tag: string) => tag.toLowerCase().includes('sme'))) {
        score += 1;
      }
      
      return { insight, score };
    });
    
    // Filter and sort by score, then take the top results
    return scoredInsights
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.insight);
  } catch (error) {
    console.error(`Error getting persona-specific insights for ${personaSlug}:`, error);
    return [];
  }
}

/**
 * Get personas by tags
 * @param tags - Array of tags to filter by
 * @returns Array of personas that have any of the specified tags
 */
export function getPersonasByTags(tags: string[]): Persona[] {
  try {
    const allPersonas = getAllPersonas();
    return allPersonas.filter(persona => 
      persona.tags && persona.tags.some(tag => tags.includes(tag))
    );
  } catch (error) {
    console.error(`Error getting personas by tags ${tags.join(', ')}:`, error);
    return [];
  }
}

/**
 * Get all unique persona tags
 * @returns Array of unique tags from all personas
 */
export function getPersonaTags(): string[] {
  try {
    const allPersonas = getAllPersonas();
    const tags = allPersonas.flatMap(persona => persona.tags || []);
    return Array.from(new Set(tags)).sort();
  } catch (error) {
    console.error('Error getting persona tags:', error);
    return [];
  }
}