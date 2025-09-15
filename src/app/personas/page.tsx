import { Metadata } from "next";
import { getAllPersonas, getFeaturedPersonas } from "@/lib/content";
import PersonaCard from "@/components/PersonaCard";
import { PersonaErrorBoundary } from "@/components/PersonaErrorBoundary";
import { Suspense } from "react";
import { PersonasGridSkeleton } from "@/components/PersonaLoadingStates";
import { getGeneralSettings } from "@/lib/settings";

const settings = getGeneralSettings();

export const metadata: Metadata = {
  title: `Customer Success Stories & Business Personas | ${settings.brand.companyName}`,
  description: "Discover real customer success stories and business personas. See how Dhīmahi Technolabs helps SMEs, startups, and enterprises overcome challenges through AI solutions, digital marketing, and business automation.",
  keywords: [
    "customer personas",
    "business success stories", 
    "SME digital transformation",
    "startup technology solutions",
    "manufacturing automation",
    "retail digital marketing",
    "business automation Gujarat",
    "IT consulting Ahmedabad",
    "AI solutions for business",
    "customer journey mapping",
    "business case studies",
    "technology transformation stories"
  ],
  authors: [{ name: settings.brand.companyName }],
  creator: settings.brand.companyName,
  publisher: settings.brand.companyName,
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
    title: `Customer Success Stories & Business Personas | ${settings.brand.companyName}`,
    description: "Explore real customer success stories and discover how we help businesses like yours succeed with proven technology solutions.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com'}/personas`,
    siteName: settings.brand.companyName,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com'}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Customer Personas - Dhimahi Technolabs',
        type: 'image/png',
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Customer Success Stories & Business Personas | ${settings.brand.companyName}`,
    description: "Explore real customer success stories and discover how we help businesses like yours succeed.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com'}/og-image.png`],
    creator: '@dhimahitechnolabs',
    site: '@dhimahitechnolabs',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com'}/personas`,
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
  },
};

// Generate enhanced structured data for SEO
function generateStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com';
  const settings = getGeneralSettings();
  
  try {
    const personas = getAllPersonas();
    
    const collectionPageData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Customer Success Stories & Business Personas",
      "description": "Real customer success stories and business personas showcasing digital transformation journeys with Dhīmahi Technolabs",
      "url": `${baseUrl}/personas`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Dhimahi Technolabs",
        "url": baseUrl
      },
      "mainEntity": {
        "@type": "ItemList",
        "name": "Customer Personas",
        "description": "Different business personas and their transformation journeys",
        "numberOfItems": personas.length,
        "itemListElement": personas.map((persona, index) => ({
          "@type": "Article",
          "position": index + 1,
          "name": persona.title,
          "description": persona.excerpt,
          "url": `${baseUrl}/personas/${persona.slug}`,
          "image": persona.icon ? `${baseUrl}${persona.icon}` : `${baseUrl}/og-image.png`,
          "author": {
            "@type": "Organization",
            "name": "Dhimahi Technolabs"
          },
          "publisher": {
            "@type": "Organization", 
            "name": "Dhimahi Technolabs",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/favicon.ico`
            }
          },
          "datePublished": persona.publishDate || new Date().toISOString(),
          "articleSection": "Customer Personas",
          "keywords": [persona.title, "customer persona", "business solutions", ...(persona.tags || [])].join(", ")
        }))
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "name": "Customer Personas",
            "item": `${baseUrl}/personas`
          }
        ]
      }
    };

    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Dhimahi Technolabs",
      "url": baseUrl,
      "logo": `${baseUrl}/favicon.ico`,
      "description": "Leading IT consulting and digital transformation company helping SMEs in Gujarat with AI solutions, digital marketing, and business automation",
      "areaServed": ["Ahmedabad", "Gandhinagar", "Gujarat", "India"],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 23.0225,
          "longitude": 72.5714
        },
        "geoRadius": "100000"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Gujarati"]
      },
      "sameAs": (() => {
        const socialLinks = [];
        if (settings.socialMedia.linkedin) socialLinks.push(settings.socialMedia.linkedin);
        if (settings.socialMedia.facebook) socialLinks.push(settings.socialMedia.facebook);
        if (settings.socialMedia.twitter) socialLinks.push(settings.socialMedia.twitter);
        if (settings.socialMedia.instagram) socialLinks.push(settings.socialMedia.instagram);
        if (settings.socialMedia.youtube) socialLinks.push(settings.socialMedia.youtube);
        return socialLinks;
      })()
    };

    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are customer personas and why are they important?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Customer personas are detailed profiles of your ideal customers based on real data and research. They help us understand your business challenges, goals, and decision-making process so we can provide more targeted and effective solutions."
          }
        },
        {
          "@type": "Question",
          "name": "How do I know which persona matches my business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Read through the 'Everyday Struggle' section of each persona. The one that resonates most with your current challenges and business situation is likely your match. You can also contact us for a personalized assessment."
          }
        },
        {
          "@type": "Question",
          "name": "Are these based on real client experiences?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, these personas are created from patterns we've observed across hundreds of client interactions. While details are anonymized, the challenges, solutions, and outcomes represent real business transformations we've facilitated."
          }
        },
        {
          "@type": "Question",
          "name": "What happens after I identify with a persona?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Once you've identified with a persona, you can book a free consultation where we'll discuss your specific situation and create a customized roadmap for your business transformation. We'll use the persona insights as a starting point for deeper discovery."
          }
        }
      ]
    };

    return [collectionPageData, organizationData, faqData];
  } catch (error) {
    console.error('Error generating structured data:', error);
    return [{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Customer Personas",
      "description": "Customer personas showcasing business transformation journeys",
      "url": `${baseUrl}/personas`
    }];
  }
}

// Component for loading personas with error handling
function PersonasContent() {
  try {
    // Load personas from CMS
    const allPersonas = getAllPersonas();
    const featuredPersonas = getFeaturedPersonas();
    
    // Get non-featured personas for the main grid
    const otherPersonas = allPersonas.filter(persona => 
      !featuredPersonas.some(featured => featured.id === persona.id)
    );

    return (
      <>
        {/* Featured Personas Section */}
        {featuredPersonas.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Featured Personas
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Start with these popular personas that represent the most common business challenges we help solve.
              </p>
            </div>
            
            <PersonaErrorBoundary fallbackType="list">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredPersonas.map((persona) => (
                  <PersonaCard 
                    key={persona.id} 
                    persona={persona}
                    className="transform hover:scale-105"
                  />
                ))}
              </div>
            </PersonaErrorBoundary>
          </section>
        )}

        {/* All Personas Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {featuredPersonas.length > 0 ? 'More Personas' : 'All Personas'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore additional personas to find the one that best matches your business situation and goals.
            </p>
          </div>

          {(featuredPersonas.length > 0 ? otherPersonas : allPersonas).length > 0 ? (
            <PersonaErrorBoundary fallbackType="list">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {(featuredPersonas.length > 0 ? otherPersonas : allPersonas).map((persona) => (
                  <PersonaCard 
                    key={persona.id} 
                    persona={persona}
                  />
                ))}
              </div>
            </PersonaErrorBoundary>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Personas Available</h3>
                <p className="text-gray-600 mb-6">
                  We're currently working on creating compelling persona stories. Check back soon!
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Contact Us
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </section>
      </>
    );
  } catch (error) {
    console.error('Error loading personas:', error);
    throw error; // Let the error boundary handle it
  }
}

export default function PersonasPage() {

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8" aria-label="Breadcrumb">
            <a href="/" className="hover:text-primary transition-colors">
              Home
            </a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Customer Personas</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Customer Personas
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Discover how businesses like yours overcome everyday challenges and achieve growth 
              through digital transformation. Each persona tells a story of struggle, solution, and success.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Real Business Stories
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Proven Solutions
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Measurable Results
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Industry Expertise
              </div>
            </div>
          </div>

          {/* Personas Content with Error Boundary and Loading States */}
          <PersonaErrorBoundary fallbackType="list">
            <Suspense fallback={<PersonasGridSkeleton count={8} />}>
              <PersonasContent />
            </Suspense>
          </PersonaErrorBoundary>

          {/* Call to Action Section */}
          <section className="mt-16 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Don't See Your Business Type?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Every business is unique. Let's discuss your specific challenges and create a custom solution 
              that fits your needs perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/consultation" 
                className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Free Consultation
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
              <a 
                href="/services" 
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                View Our Services
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <details className="bg-white rounded-xl shadow-soft p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    <span>What are customer personas and why are they important?</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Customer personas are detailed profiles of your ideal customers based on real data and research. 
                    They help us understand your business challenges, goals, and decision-making process so we can 
                    provide more targeted and effective solutions.
                  </p>
                </details>
                
                <details className="bg-white rounded-xl shadow-soft p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    <span>How do I know which persona matches my business?</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Read through the "Everyday Struggle" section of each persona. The one that resonates most with 
                    your current challenges and business situation is likely your match. You can also contact us 
                    for a personalized assessment.
                  </p>
                </details>
                
                <details className="bg-white rounded-xl shadow-soft p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    <span>Are these based on real client experiences?</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Yes, these personas are created from patterns we've observed across hundreds of client 
                    interactions. While details are anonymized, the challenges, solutions, and outcomes 
                    represent real business transformations we've facilitated.
                  </p>
                </details>
                
                <details className="bg-white rounded-xl shadow-soft p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    <span>What happens after I identify with a persona?</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Once you've identified with a persona, you can book a free consultation where we'll discuss 
                    your specific situation and create a customized roadmap for your business transformation. 
                    We'll use the persona insights as a starting point for deeper discovery.
                  </p>
                </details>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}