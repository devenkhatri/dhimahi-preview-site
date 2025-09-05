import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';
import { remark } from 'remark';
import html from 'remark-html';

// Import validation and fallback functions
import { 
  validateHomepageContent,
  validateServiceData,
  validateCaseStudy,
  validateInsight,
  validateAboutContent,
  logValidationErrors,
  type ValidationResult
} from './cms-validation';
import { 
  getDefaultHomepageContent,
  getDefaultAboutContent,
  getDefaultServiceMeta,
  getDefaultServiceData,
  getDefaultCaseStudyMeta,
  getDefaultCaseStudyData,
  getDefaultInsightMeta,
  getDefaultInsightData,
  ERROR_MESSAGES,
  logContentError,
  logContentWarning
} from './cms-fallbacks';

// Import existing interfaces
import type { HomepageContent, AboutContent } from './content';
import type { 
  ServiceData, 
  ServiceMeta, 
  ProcessStep, 
  TechnologyStack, 
  FAQ 
} from './services';
import type { 
  CaseStudy, 
  CaseStudyMeta, 
  ClientInfo, 
  ResultMetric, 
  Testimonial, 
  ImageAsset, 
  Technology 
} from './case-studies';

// Re-export interfaces for external use
export type { 
  HomepageContent, 
  AboutContent, 
  ServiceData, 
  ServiceMeta, 
  CaseStudy, 
  CaseStudyMeta, 
  ProcessStep, 
  TechnologyStack, 
  FAQ, 
  ClientInfo, 
  ResultMetric, 
  Testimonial, 
  ImageAsset, 
  Technology 
};

// CMS content directories
const cmsContentDirectory = path.join(process.cwd(), 'content');
const cmsPagesDirectory = path.join(cmsContentDirectory, 'pages');
const cmsServicesDirectory = path.join(cmsContentDirectory, 'services');
const cmsCaseStudiesDirectory = path.join(cmsContentDirectory, 'case-studies');
const cmsInsightsDirectory = path.join(cmsContentDirectory, 'insights');
const cmsSettingsDirectory = path.join(cmsContentDirectory, 'settings');

// Insights interface (not in existing files)
export interface InsightMeta {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: Date;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
}

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: Date;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

// CMS Homepage Content Function with comprehensive error handling
export function getCMSHomepageContent(): HomepageContent {
  try {
    const fullPath = path.join(cmsPagesDirectory, 'homepage.yml');
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      logContentWarning(ERROR_MESSAGES.FILE_READ_ERROR(fullPath, 'File does not exist'));
      return getDefaultHomepageContent();
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Parse YAML with error handling
    let data: any;
    try {
      data = yaml.load(fileContents);
    } catch (yamlError) {
      logContentError(ERROR_MESSAGES.YAML_PARSE_ERROR(fullPath, String(yamlError)));
      return getDefaultHomepageContent();
    }

    // Transform data to expected format
    const transformedData: HomepageContent = {
      hero: {
        mainHeadline: data?.hero?.mainHeadline || '',
        subheadline: data?.hero?.subheadline || '',
        trustBadge: data?.hero?.trustBadge || '',
        statistics: (data?.hero?.statistics || []).map((stat: any) => ({
          value: stat?.value || 0,
          suffix: stat?.suffix || '',
          label: stat?.label || ''
        })),
        ctaButtons: {
          primary: data?.hero?.ctaButton?.text || "Get Free AI Consultation",
          secondary: "Explore Our Services"
        },
        trustIndicators: data?.hero?.trustIndicators || [],
        floatingBadges: (data?.hero?.floatingTrustBadges || []).map((badge: string) => {
          const [icon, ...textParts] = badge.split(' ');
          return {
            icon: icon || '🚀',
            text: textParts.join(' ') || badge
          };
        })
      },
      services: {
        title: data?.servicesOverview?.title || 'Our Services',
        subtitle: data?.servicesOverview?.description || 'Professional services for your business'
      },
      whyChooseUs: {
        title: data?.whyChooseUs?.title || 'Why Choose Us',
        subtitle: data?.whyChooseUs?.subtitle || 'We deliver results',
        reasons: (data?.whyChooseUs?.reasons || []).map((reason: any) => ({
          icon: reason?.icon || '✓',
          title: reason?.title || '',
          description: reason?.description || ''
        }))
      },
      testimonials: {
        title: "Client Success Stories",
        subtitle: "We've helped SMEs across Gujarat streamline operations, grow online, and adopt future-ready IT solutions.",
        items: (data?.testimonials || []).map((testimonial: any) => ({
          quote: testimonial?.testimonial || '',
          author: `${testimonial?.clientName || 'Anonymous'}, ${testimonial?.company || 'Company'}`
        }))
      },
      contactCta: {
        title: data?.contactCTA?.title || 'Get In Touch',
        description: data?.contactCTA?.description || 'Contact us today',
        buttons: {
          primary: data?.contactCTA?.primaryButton?.text || 'Contact Us',
          secondary: data?.contactCTA?.secondaryButton?.text || 'Learn More'
        }
      },
      contactForm: {
        title: data?.contactForm?.title || 'Send us a message',
        description: data?.contactForm?.description || 'We\'ll get back to you soon',
        email: data?.contactForm?.contactEmail || 'hello@dhimahitechnolabs.com'
      }
    };

    // Validate the transformed data
    const validation = validateHomepageContent(transformedData);
    if (!validation.success) {
      logValidationErrors('Homepage', validation.errors);
      logContentWarning(ERROR_MESSAGES.CONTENT_INVALID('Homepage', validation.errors.map(e => e.message)));
      return getDefaultHomepageContent();
    }

    return transformedData;
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR('homepage.yml', String(error)));
    return getDefaultHomepageContent();
  }
}

// CMS Service Functions with error handling
export function getAllCMSServices(): ServiceMeta[] {
  try {
    if (!fs.existsSync(cmsServicesDirectory)) {
      logContentWarning(ERROR_MESSAGES.DIRECTORY_NOT_FOUND(cmsServicesDirectory));
      return getDefaultServiceMeta();
    }

    const fileNames = fs.readdirSync(cmsServicesDirectory);
    const allServicesData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.md$/, '');
          const fullPath = path.join(cmsServicesDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);

          return {
            slug,
            title: matterResult.data.title || `Service ${slug}`,
            icon: matterResult.data.icon || '🔧',
            excerpt: matterResult.data.excerpt || 'Professional service',
            order: matterResult.data.order || 999,
            features: matterResult.data.features || [],
            timeline: matterResult.data.timeline || 'Contact for timeline',
          };
        } catch (fileError) {
          logContentError(ERROR_MESSAGES.FILE_READ_ERROR(fileName, String(fileError)));
          return null;
        }
      })
      .filter((service): service is NonNullable<typeof service> => service !== null);

    if (allServicesData.length === 0) {
      logContentWarning('No valid service files found, using fallback services');
      return getDefaultServiceMeta();
    }

    return allServicesData.sort((a, b) => a.order - b.order);
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR('services directory', String(error)));
    return getDefaultServiceMeta();
  }
}

export async function getCMSServiceData(slug: string): Promise<ServiceData> {
  try {
    const fullPath = path.join(cmsServicesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      logContentWarning(ERROR_MESSAGES.CONTENT_NOT_FOUND('Service', slug));
      return getDefaultServiceData(slug);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    let contentHtml = '';
    try {
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      contentHtml = processedContent.toString();
    } catch (markdownError) {
      logContentError(ERROR_MESSAGES.MARKDOWN_PARSE_ERROR(fullPath, String(markdownError)));
      contentHtml = '<p>Content processing error. Please contact support.</p>';
    }

    const serviceData: ServiceData = {
      slug,
      title: matterResult.data.title || `Service ${slug}`,
      icon: matterResult.data.icon || '🔧',
      excerpt: matterResult.data.excerpt || 'Professional service',
      order: matterResult.data.order || 999,
      features: matterResult.data.features || [],
      content: contentHtml,
      processSteps: matterResult.data.processSteps || [],
      technologyStack: matterResult.data.technologyStack || [],
      faqs: matterResult.data.faqs || [],
      timeline: matterResult.data.timeline || 'Contact for timeline',
      startingPrice: matterResult.data.startingPrice,
    };

    // Validate the service data
    const validation = validateServiceData(serviceData);
    if (!validation.success) {
      logValidationErrors(`Service ${slug}`, validation.errors);
      logContentWarning(ERROR_MESSAGES.CONTENT_INVALID(`Service ${slug}`, validation.errors.map(e => e.message)));
      return getDefaultServiceData(slug);
    }

    return serviceData;
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR(`service ${slug}`, String(error)));
    return getDefaultServiceData(slug);
  }
}

// CMS Case Studies Functions with error handling
export function getAllCMSCaseStudies(): CaseStudyMeta[] {
  try {
    if (!fs.existsSync(cmsCaseStudiesDirectory)) {
      logContentWarning(ERROR_MESSAGES.DIRECTORY_NOT_FOUND(cmsCaseStudiesDirectory));
      return getDefaultCaseStudyMeta();
    }

    const fileNames = fs.readdirSync(cmsCaseStudiesDirectory);
    const allCaseStudies = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.md$/, '');
          const fullPath = path.join(cmsCaseStudiesDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);

          return {
            slug,
            title: matterResult.data.title || `Case Study ${slug}`,
            client: matterResult.data.client || {
              name: 'Confidential Client',
              industry: 'Various',
              size: 'SME',
              location: 'Gujarat'
            },
            projectType: matterResult.data.projectType || 'Project',
            duration: matterResult.data.duration || 'Variable',
            excerpt: matterResult.data.excerpt || 'Professional project delivery',
            publishDate: matterResult.data.publishDate ? new Date(matterResult.data.publishDate) : new Date(),
            featured: matterResult.data.featured || false,
            category: matterResult.data.category || 'general',
            services: matterResult.data.services || [],
            images: matterResult.data.images || [],
          };
        } catch (fileError) {
          logContentError(ERROR_MESSAGES.FILE_READ_ERROR(fileName, String(fileError)));
          return null;
        }
      })
      .filter((caseStudy): caseStudy is NonNullable<typeof caseStudy> => caseStudy !== null);

    if (allCaseStudies.length === 0) {
      logContentWarning('No valid case study files found, using fallback case studies');
      return getDefaultCaseStudyMeta();
    }

    return allCaseStudies.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR('case studies directory', String(error)));
    return getDefaultCaseStudyMeta();
  }
}

export async function getCMSCaseStudyData(slug: string): Promise<CaseStudy> {
  try {
    const fullPath = path.join(cmsCaseStudiesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      logContentWarning(ERROR_MESSAGES.CONTENT_NOT_FOUND('Case Study', slug));
      return getDefaultCaseStudyData(slug);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    let contentHtml = '';
    try {
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      contentHtml = processedContent.toString();
    } catch (markdownError) {
      logContentError(ERROR_MESSAGES.MARKDOWN_PARSE_ERROR(fullPath, String(markdownError)));
      contentHtml = '<p>Content processing error. Please contact support.</p>';
    }

    const caseStudyData: CaseStudy = {
      slug,
      title: matterResult.data.title || `Case Study ${slug}`,
      client: matterResult.data.client || {
        name: 'Confidential Client',
        industry: 'Various',
        size: 'SME',
        location: 'Gujarat'
      },
      projectType: matterResult.data.projectType || 'Project',
      duration: matterResult.data.duration || 'Variable',
      teamSize: matterResult.data.teamSize,
      challenge: matterResult.data.challenge || 'Business challenge addressed',
      solution: matterResult.data.solution || ['Professional solution delivered'],
      results: matterResult.data.results || [{
        metric: 'Success',
        value: '100%',
        description: 'Project completed successfully'
      }],
      testimonial: matterResult.data.testimonial,
      images: matterResult.data.images || [],
      technologies: matterResult.data.technologies || [],
      services: matterResult.data.services || [],
      publishDate: matterResult.data.publishDate ? new Date(matterResult.data.publishDate) : new Date(),
      featured: matterResult.data.featured || false,
      content: contentHtml,
      excerpt: matterResult.data.excerpt || 'Professional project delivery',
      category: matterResult.data.category || 'general',
    };

    // Validate the case study data
    const validation = validateCaseStudy(caseStudyData);
    if (!validation.success) {
      logValidationErrors(`Case Study ${slug}`, validation.errors);
      logContentWarning(ERROR_MESSAGES.CONTENT_INVALID(`Case Study ${slug}`, validation.errors.map(e => e.message)));
      return getDefaultCaseStudyData(slug);
    }

    return caseStudyData;
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR(`case study ${slug}`, String(error)));
    return getDefaultCaseStudyData(slug);
  }
}

// CMS Insights Functions with error handling
export function getAllCMSInsights(): InsightMeta[] {
  try {
    if (!fs.existsSync(cmsInsightsDirectory)) {
      logContentWarning(ERROR_MESSAGES.DIRECTORY_NOT_FOUND(cmsInsightsDirectory));
      return getDefaultInsightMeta();
    }

    const fileNames = fs.readdirSync(cmsInsightsDirectory);
    const allInsights = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.md$/, '');
          const fullPath = path.join(cmsInsightsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);

          return {
            slug,
            title: matterResult.data.title || `Insight ${slug}`,
            excerpt: matterResult.data.excerpt || 'Professional insights and expertise',
            publishDate: matterResult.data.publishDate ? new Date(matterResult.data.publishDate) : new Date(),
            author: matterResult.data.author || 'Dhimahi Team',
            category: matterResult.data.category || 'General',
            tags: matterResult.data.tags || ['Business'],
            featuredImage: matterResult.data.featuredImage,
          };
        } catch (fileError) {
          logContentError(ERROR_MESSAGES.FILE_READ_ERROR(fileName, String(fileError)));
          return null;
        }
      })
      .filter((insight): insight is NonNullable<typeof insight> => insight !== null);

    if (allInsights.length === 0) {
      logContentWarning('No valid insight files found, using fallback insights');
      return getDefaultInsightMeta();
    }

    return allInsights.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR('insights directory', String(error)));
    return getDefaultInsightMeta();
  }
}

export async function getCMSInsightData(slug: string): Promise<Insight> {
  try {
    const fullPath = path.join(cmsInsightsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      logContentWarning(ERROR_MESSAGES.CONTENT_NOT_FOUND('Insight', slug));
      return getDefaultInsightData(slug);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    let contentHtml = '';
    try {
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      contentHtml = processedContent.toString();
    } catch (markdownError) {
      logContentError(ERROR_MESSAGES.MARKDOWN_PARSE_ERROR(fullPath, String(markdownError)));
      contentHtml = '<p>Content processing error. Please contact support.</p>';
    }

    const insightData: Insight = {
      slug,
      title: matterResult.data.title || `Insight ${slug}`,
      excerpt: matterResult.data.excerpt || 'Professional insights and expertise',
      content: contentHtml,
      publishDate: matterResult.data.publishDate ? new Date(matterResult.data.publishDate) : new Date(),
      author: matterResult.data.author || 'Dhimahi Team',
      category: matterResult.data.category || 'General',
      tags: matterResult.data.tags || ['Business'],
      featuredImage: matterResult.data.featuredImage,
      seo: matterResult.data.seo || {
        metaTitle: matterResult.data.title || `Insight ${slug}`,
        metaDescription: matterResult.data.excerpt || 'Professional insights and expertise',
        keywords: (matterResult.data.tags || ['Business']).join(', ')
      }
    };

    // Validate the insight data
    const validation = validateInsight(insightData);
    if (!validation.success) {
      logValidationErrors(`Insight ${slug}`, validation.errors);
      logContentWarning(ERROR_MESSAGES.CONTENT_INVALID(`Insight ${slug}`, validation.errors.map(e => e.message)));
      return getDefaultInsightData(slug);
    }

    return insightData;
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR(`insight ${slug}`, String(error)));
    return getDefaultInsightData(slug);
  }
}

// Additional utility functions for CMS case studies
export function getFeaturedCMSCaseStudies(limit: number = 3): CaseStudyMeta[] {
  const allCaseStudies = getAllCMSCaseStudies();
  return allCaseStudies.filter(caseStudy => caseStudy.featured).slice(0, limit);
}

export function getCMSCaseStudiesByCategory(category: string): CaseStudyMeta[] {
  const allCaseStudies = getAllCMSCaseStudies();
  return allCaseStudies.filter(caseStudy => caseStudy.category === category);
}

export function getCMSCaseStudiesByService(serviceSlug: string): CaseStudyMeta[] {
  const allCaseStudies = getAllCMSCaseStudies();
  return allCaseStudies.filter(caseStudy => 
    caseStudy.services.includes(serviceSlug)
  );
}

export function getRelatedCMSCaseStudies(currentSlug: string, category: string, limit: number = 3): CaseStudyMeta[] {
  const allCaseStudies = getAllCMSCaseStudies();
  return allCaseStudies
    .filter(caseStudy => 
      caseStudy.slug !== currentSlug && 
      caseStudy.category === category
    )
    .slice(0, limit);
}

// Additional utility functions for CMS insights
export function getFeaturedCMSInsights(limit: number = 3): InsightMeta[] {
  const allInsights = getAllCMSInsights();
  return allInsights.slice(0, limit);
}

export function getCMSInsightsByCategory(category: string): InsightMeta[] {
  const allInsights = getAllCMSInsights();
  return allInsights.filter(insight => insight.category === category);
}

export function getCMSInsightsByTag(tag: string): InsightMeta[] {
  const allInsights = getAllCMSInsights();
  return allInsights.filter(insight => insight.tags.includes(tag));
}

export function getRelatedCMSInsights(currentSlug: string, tags: string[], limit: number = 3): InsightMeta[] {
  const allInsights = getAllCMSInsights();
  return allInsights
    .filter(insight => 
      insight.slug !== currentSlug && 
      insight.tags.some(tag => tags.includes(tag))
    )
    .slice(0, limit);
}

// CMS About Content Function with error handling
export function getCMSAboutContent(): AboutContent {
  try {
    const fullPath = path.join(cmsPagesDirectory, 'about.yml');
    
    if (!fs.existsSync(fullPath)) {
      logContentWarning(ERROR_MESSAGES.FILE_READ_ERROR(fullPath, 'File does not exist'));
      return getDefaultAboutContent();
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    let data: any;
    try {
      data = yaml.load(fileContents);
    } catch (yamlError) {
      logContentError(ERROR_MESSAGES.YAML_PARSE_ERROR(fullPath, String(yamlError)));
      return getDefaultAboutContent();
    }

    const aboutData: AboutContent = {
      title: data?.title || 'About Us',
      subtitle: data?.introduction || 'Learn more about our company',
      mission: {
        title: data?.mission?.title || 'Our Mission',
        description: data?.mission?.statement || 'We deliver exceptional results',
        vision: data?.vision?.statement || 'To be the leading technology partner'
      },
      values: (data?.values || []).map((value: any) => ({
        icon: value?.icon || '✓',
        title: value?.title || 'Our Value',
        description: value?.description || 'We believe in excellence'
      })),
      timeline: (data?.timeline || []).map((item: any) => ({
        year: item?.year || '2024',
        title: item?.title || 'Milestone',
        description: item?.description || 'Important achievement'
      })),
      team: (data?.team || []).map((member: any) => ({
        name: member?.name || 'Team Member',
        role: member?.role || 'Professional',
        bio: member?.bio || 'Experienced professional',
        expertise: member?.expertise || ['General']
      }))
    };

    // Validate the about data
    const validation = validateAboutContent(aboutData);
    if (!validation.success) {
      logValidationErrors('About', validation.errors);
      logContentWarning(ERROR_MESSAGES.CONTENT_INVALID('About', validation.errors.map(e => e.message)));
      return getDefaultAboutContent();
    }

    return aboutData;
  } catch (error) {
    logContentError(ERROR_MESSAGES.FILE_READ_ERROR('about.yml', String(error)));
    return getDefaultAboutContent();
  }
}

