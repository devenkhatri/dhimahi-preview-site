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
          availableLanguage: ['English', 'Gujarati', 'Hindi'],
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