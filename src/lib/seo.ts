import { Metadata } from 'next';
import { COMPANY_NAME } from './constants';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata(seoData: SEOData): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonicalUrl,
    ogImage = '/og-image.png',
    ogType = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
  } = seoData;

  const fullTitle = title.includes(COMPANY_NAME) ? title : `${title} | ${COMPANY_NAME}`;
  const baseUrl = 'https://www.dhimahitechnolabs.com';
  const fullCanonicalUrl = canonicalUrl || baseUrl;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : [{ name: COMPANY_NAME }],
    creator: COMPANY_NAME,
    publisher: COMPANY_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullCanonicalUrl,
      siteName: COMPANY_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      locale: 'en_IN',
      type: ogType,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@dhimahitechnolabs',
      site: '@dhimahitechnolabs',
    },
    alternates: {
      canonical: fullCanonicalUrl,
    },
  };
}

export interface StructuredDataProps {
  type: 'Article' | 'Service' | 'LocalBusiness' | 'Organization' | 'WebPage' | 'FAQPage';
  data: any;
}

export function generateStructuredData({ type, data }: StructuredDataProps): string {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  let structuredData;

  switch (type) {
    case 'Article':
      structuredData = {
        ...baseData,
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author || COMPANY_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: COMPANY_NAME,
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.dhimahitechnolabs.com/favicon.ico',
          },
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        image: data.image || 'https://www.dhimahitechnolabs.com/og-image.png',
        url: data.url,
        keywords: data.keywords?.join(', '),
        articleSection: data.section,
        wordCount: data.wordCount,
        timeRequired: data.readTime ? `PT${data.readTime}M` : undefined,
      };
      break;

    case 'Service':
      structuredData = {
        ...baseData,
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: COMPANY_NAME,
          url: 'https://www.dhimahitechnolabs.com',
        },
        areaServed: ['Ahmedabad', 'Gandhinagar', 'Gujarat', 'India'],
        serviceType: data.serviceType,
        offers: data.offers ? {
          '@type': 'Offer',
          price: data.offers.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        } : undefined,
        category: data.category,
        url: data.url,
      };
      break;

    case 'LocalBusiness':
      structuredData = {
        ...baseData,
        name: COMPANY_NAME,
        image: 'https://www.dhimahitechnolabs.com/favicon.ico',
        url: 'https://www.dhimahitechnolabs.com',
        telephone: '+91 99999 99999',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ahmedabad',
          addressRegion: 'Gujarat',
          addressCountry: 'IN',
        },
        areaServed: ['Ahmedabad', 'Gandhinagar', 'Gujarat'],
        sameAs: data.socialProfiles || [],
        openingHours: 'Mo-Fr 09:00-18:00',
        priceRange: '₹₹',
        description: data.description,
      };
      break;

    case 'Organization':
      structuredData = {
        ...baseData,
        name: COMPANY_NAME,
        url: 'https://www.dhimahitechnolabs.com',
        logo: 'https://www.dhimahitechnolabs.com/favicon.ico',
        description: data.description,
        foundingDate: data.foundingDate,
        numberOfEmployees: data.numberOfEmployees,
        sameAs: data.socialProfiles || [],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91 99999 99999',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['English'],
        },
      };
      break;

    case 'WebPage':
      structuredData = {
        ...baseData,
        name: data.name,
        description: data.description,
        url: data.url,
        isPartOf: {
          '@type': 'WebSite',
          name: COMPANY_NAME,
          url: 'https://www.dhimahitechnolabs.com',
        },
        about: data.about,
        mainEntity: data.mainEntity,
      };
      break;

    case 'FAQPage':
      structuredData = {
        ...baseData,
        mainEntity: data.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
      break;

    default:
      structuredData = { ...baseData, ...data };
  }

  return JSON.stringify(structuredData);
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  });
}

export const defaultKeywords = [
  'IT consulting SME',
  'AI solutions Gujarat',
  'digital marketing Ahmedabad',
  'business automation',
  'CRM implementation',
  'website development',
  'SEO services',
  'fractional CTO',
  'small business IT',
  'Gandhinagar IT services',
  'digital transformation',
  'cloud migration',
  'cybersecurity',
  'data analytics',
  'mobile app development',
];

// Persona-specific SEO utilities
export interface PersonaSEOData {
  title: string;
  slug: string;
  excerpt: string;
  icon?: string;
  publishDate?: string;
  modifiedDate?: string;
  tags?: string[];
}

export function generatePersonaMetadata(persona: PersonaSEOData): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com';
  const canonicalUrl = `${baseUrl}/personas/${persona.slug}`;
  const ogImageUrl = persona.icon ? `${baseUrl}${persona.icon}` : `${baseUrl}/og-image.png`;
  
  // Generate SEO-optimized title and description
  const seoTitle = `${persona.title} Business Solutions | Customer Success Story | ${COMPANY_NAME}`;
  const seoDescription = persona.excerpt || 
    `Discover how ${persona.title} overcomes business challenges with ${COMPANY_NAME}'s proven solutions. Real success stories, practical strategies, and measurable results for businesses like yours.`;

  // Extract keywords from persona content
  const keywords = [
    persona.title.toLowerCase(),
    'customer persona',
    'business solutions',
    'digital transformation',
    'success story',
    'SME solutions',
    'business automation',
    'IT consulting',
    'Gujarat business',
    'Ahmedabad technology',
    ...defaultKeywords,
    ...(persona.tags || [])
  ];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords.join(', '),
    authors: [{ name: COMPANY_NAME }],
    creator: COMPANY_NAME,
    publisher: COMPANY_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${persona.title} - Customer Success Story`,
      description: seoDescription,
      url: canonicalUrl,
      siteName: COMPANY_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${persona.title} - Customer Persona Icon`,
          type: 'image/png',
        },
      ],
      locale: 'en_IN',
      type: 'article',
      publishedTime: persona.publishDate || new Date().toISOString(),
      modifiedTime: persona.modifiedDate || persona.publishDate || new Date().toISOString(),
      authors: [COMPANY_NAME],
      section: 'Customer Personas',
      tags: keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${persona.title} - Customer Success Story`,
      description: seoDescription,
      images: [ogImageUrl],
      creator: '@dhimahitechnolabs',
      site: '@dhimahitechnolabs',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'article:author': COMPANY_NAME,
      'article:section': 'Customer Personas',
      'article:published_time': persona.publishDate || new Date().toISOString(),
      'article:modified_time': persona.modifiedDate || persona.publishDate || new Date().toISOString(),
      'article:tag': keywords.slice(0, 10).join(','), // Limit to first 10 keywords
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': `${persona.title} - Customer Persona Icon`,
      'og:see_also': `${baseUrl}/personas`,
      'twitter:label1': 'Business Type',
      'twitter:data1': persona.title,
      'twitter:label2': 'Solutions',
      'twitter:data2': 'Digital Transformation',
      // LinkedIn specific meta tags
      'linkedin:owner': 'dhimahi-technolabs',
      // WhatsApp sharing optimization
      'og:image:secure_url': ogImageUrl,
      // Pinterest specific
      'pinterest:description': seoDescription,
      'pinterest:media': ogImageUrl,
    },
  };
}

export function generatePersonaStructuredData(persona: PersonaSEOData): any[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com';
  
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${persona.title} - Customer Success Story`,
    description: persona.excerpt || `Discover how ${persona.title} overcomes business challenges with proven solutions.`,
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`,
        width: 32,
        height: 32,
      },
      sameAs: [
        'https://www.linkedin.com/company/dhimahi-technolabs',
        'https://www.facebook.com/dhimahi.technolabs',
        'https://twitter.com/dhimahitechnolabs'
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`,
        width: 32,
        height: 32,
      },
    },
    datePublished: persona.publishDate || new Date().toISOString(),
    dateModified: persona.modifiedDate || persona.publishDate || new Date().toISOString(),
    image: {
      '@type': 'ImageObject',
      url: persona.icon ? `${baseUrl}${persona.icon}` : `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: `${persona.title} - Customer Persona Icon`,
    },
    url: `${baseUrl}/personas/${persona.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/personas/${persona.slug}`,
      name: `${persona.title} - Customer Success Story`,
      description: persona.excerpt,
      url: `${baseUrl}/personas/${persona.slug}`,
      inLanguage: 'en-IN',
      isPartOf: {
        '@type': 'WebSite',
        name: COMPANY_NAME,
        url: baseUrl,
      },
    },
    articleSection: 'Customer Personas',
    keywords: [
      persona.title,
      'customer persona',
      'business solutions',
      'success story',
      'digital transformation',
      ...(persona.tags || [])
    ].join(', '),
    about: {
      '@type': 'Thing',
      name: persona.title,
      description: persona.excerpt,
      sameAs: `${baseUrl}/personas/${persona.slug}`,
    },
    mentions: [
      {
        '@type': 'Service',
        name: 'Digital Transformation',
        description: 'Comprehensive digital transformation services for businesses',
        provider: {
          '@type': 'Organization',
          name: COMPANY_NAME,
          url: baseUrl,
        },
        areaServed: ['Ahmedabad', 'Gandhinagar', 'Gujarat', 'India'],
        serviceType: 'Technology Consulting',
      },
      {
        '@type': 'Service',
        name: 'Business Automation',
        description: 'Process automation and workflow optimization solutions',
        provider: {
          '@type': 'Organization',
          name: COMPANY_NAME,
          url: baseUrl,
        },
        areaServed: ['Ahmedabad', 'Gandhinagar', 'Gujarat', 'India'],
        serviceType: 'Business Process Automation',
      },
      {
        '@type': 'Service',
        name: 'IT Consulting',
        description: 'Strategic IT consulting and technology advisory services',
        provider: {
          '@type': 'Organization',
          name: COMPANY_NAME,
          url: baseUrl,
        },
        areaServed: ['Ahmedabad', 'Gandhinagar', 'Gujarat', 'India'],
        serviceType: 'IT Consulting',
      },
    ],
    isAccessibleForFree: true,
    genre: ['Business', 'Technology', 'Case Study'],
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Small and Medium Enterprises',
      geographicArea: {
        '@type': 'Place',
        name: 'Gujarat, India',
      },
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: `${baseUrl}/personas/${persona.slug}`,
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Customer Personas',
        item: `${baseUrl}/personas`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: persona.title,
        item: `${baseUrl}/personas/${persona.slug}`,
      },
    ],
  };

  // Add FAQ structured data for common persona questions
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How can ${COMPANY_NAME} help ${persona.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We help ${persona.title} overcome business challenges through digital transformation, process automation, and strategic technology implementation. Our solutions are tailored to address specific pain points and drive measurable results.`,
        },
      },
      {
        '@type': 'Question',
        name: `What makes this persona story relevant to my business?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `This persona represents real patterns we've observed across hundreds of client interactions. If you identify with the challenges described, our proven solutions can help you achieve similar transformation results.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I get started with a similar transformation?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Start with a free consultation where we'll assess your specific situation and create a customized roadmap. We'll use insights from this persona as a foundation while addressing your unique business needs.`,
        },
      },
    ],
  };

  return [articleData, breadcrumbData, faqData];
}