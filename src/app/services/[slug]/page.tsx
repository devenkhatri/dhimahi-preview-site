import { getCMSServiceData, getAllCMSServices } from "@/lib/cms-content";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProcessSteps from "@/components/ProcessSteps";
import TechnologyStackComponent from "@/components/TechnologyStack";
import ServiceFAQ from "@/components/ServiceFAQ";
import RelatedPersonas from "@/components/RelatedPersonas";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/constants";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const services = getAllCMSServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const service = await getCMSServiceData(slug);
    const canonicalUrl = `https://www.dhimahitechnolabs.com/services/${slug}`;
    
    return generateSEOMetadata({
      title: `${service.title} Services`,
      description: service.excerpt,
      keywords: [
        service.title.toLowerCase(),
        `${service.title.toLowerCase()} services`,
        `${service.title.toLowerCase()} Gujarat`,
        `${service.title.toLowerCase()} Ahmedabad`,
        'IT consulting',
        'SME solutions',
        'business automation',
        ...service.features.slice(0, 5).map(f => f.toLowerCase()),
      ],
      canonicalUrl,
      ogType: 'website',
    });
  } catch {
    return {
      title: "Service Not Found",
    };
  }
}

export default async function ServicePage({ params }: Props) {
  let service;
  const { slug } = await params;
  
  try {
    service = await getCMSServiceData(slug);
  } catch {
    notFound();
  }

  const serviceStructuredData = generateStructuredData({
    type: 'Service',
    data: {
      name: service.title,
      description: service.excerpt,
      serviceType: service.title,
      category: service.title,
      url: `https://www.dhimahitechnolabs.com/services/${slug}`,
      offers: service.startingPrice ? {
        price: service.startingPrice,
      } : undefined,
    },
  });

  const faqStructuredData = service.faqs && service.faqs.length > 0 ? generateStructuredData({
    type: 'FAQPage',
    data: {
      faqs: service.faqs,
    },
  }) : null;

  const breadcrumbStructuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.dhimahitechnolabs.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.dhimahitechnolabs.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://www.dhimahitechnolabs.com/services/${slug}`,
      },
    ],
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serviceStructuredData }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbStructuredData }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqStructuredData }}
        />
      )}

      <main className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/services" className="text-primary hover:underline">Services</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{service.title}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {service.excerpt}
          </p>
          
          {/* Quick Info */}
          {(service.startingPrice || service.timeline) && (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {service.startingPrice && (
                <div className="bg-primary/10 text-primary px-6 py-3 rounded-full font-medium">
                  Starting from {service.startingPrice}
                </div>
              )}
              {service.timeline && (
                <div className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium">
                  ⏱️ Typical timeline: {service.timeline}
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/#contact-form"
              className="rounded-2xl bg-primary px-8 py-4 font-medium text-white shadow-soft hover:bg-primary-dark text-center"
            >
              Get Free Consultation
            </Link>
            <button className="rounded-2xl border border-gray-300 px-8 py-4 font-medium hover:bg-gray-50 text-center">
              Download Service Guide
            </button>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">What We Offer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <article 
          className="service-content prose prose-slate max-w-none 
            prose-headings:font-semibold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:first:mt-0
            prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-primary
            prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-h4:font-semibold
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-ul:space-y-3 prose-ul:mb-6
            prose-ol:space-y-3 prose-ol:mb-6
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-6
            prose-hr:border-0 prose-hr:border-t prose-hr:border-gray-200 prose-hr:my-8
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />

        {/* Process Steps */}
        {service.processSteps && service.processSteps.length > 0 && (
          <ProcessSteps steps={service.processSteps} serviceName={service.title} />
        )}

        {/* Technology Stack */}
        {service.technologyStack && service.technologyStack.length > 0 && (
          <TechnologyStackComponent stack={service.technologyStack} serviceName={service.title} />
        )}

        {/* FAQ Section */}
        {service.faqs && service.faqs.length > 0 && (
          <ServiceFAQ faqs={service.faqs} serviceName={service.title} />
        )}

        {/* Related Personas */}
        <RelatedPersonas serviceName={service.title} />

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how our {service.title.toLowerCase()} services can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/#contact-form"
              className="rounded-2xl bg-primary px-8 py-4 font-medium text-white shadow-soft hover:bg-primary-dark text-center"
            >
              Get Free Consultation
            </Link>
            <Link 
              href="/services"
              className="rounded-2xl border border-gray-300 px-8 py-4 font-medium hover:bg-gray-50 text-center"
            >
              View All Services
            </Link>
          </div>
        </div>

        {/* Back to Services */}
        <div className="mt-12 text-center">
          <Link href="/services" className="inline-flex items-center text-primary hover:underline">
            ← Back to all services
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}