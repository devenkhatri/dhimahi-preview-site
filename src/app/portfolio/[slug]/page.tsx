import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCMSCaseStudyData, getAllCMSCaseStudies, getRelatedCMSCaseStudies } from '@/lib/cms-content';
import { getGeneralSettings } from '@/lib/settings';

const settings = getGeneralSettings();

import CaseStudyHeader from '@/components/CaseStudyHeader';
import CaseStudyContent from '@/components/CaseStudyContent';
import ResultMetrics from '@/components/ResultMetrics';
import ClientTestimonial from '@/components/ClientTestimonial';

import RelatedCaseStudies from '@/components/RelatedCaseStudies';
import BeforeAfterShowcase from '@/components/BeforeAfterShowcase';

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const caseStudies = getAllCMSCaseStudies();
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const caseStudy = await getCMSCaseStudyData(slug);
    
    return {
      title: `${caseStudy.title} | ${settings.brand.companyName}`,
      description: caseStudy.excerpt,
      keywords: [
        caseStudy.client.industry,
        caseStudy.projectType,
        caseStudy.category,
        'case study',
        'success story',
        'Gujarat',
        'SME transformation'
      ],
      openGraph: {
        title: caseStudy.title,
        description: caseStudy.excerpt,
        type: 'article',
        publishedTime: caseStudy.publishDate.toISOString(),
        authors: [settings.brand.companyName],
        images: caseStudy.images.length > 0 ? [
          {
            url: caseStudy.images[0].src,
            alt: caseStudy.images[0].alt,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: caseStudy.title,
        description: caseStudy.excerpt,
        images: caseStudy.images.length > 0 ? [caseStudy.images[0].src] : [],
      },
    };
  } catch (error) {
    return {
      title: `Case Study Not Found | ${settings.brand.companyName}`,
      description: 'The requested case study could not be found.',
    };
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  try {
    const { slug } = await params;
    const caseStudy = await getCMSCaseStudyData(slug);
    const relatedCaseStudies = getRelatedCMSCaseStudies(slug, caseStudy.category, 3);

    return (
      <main className="min-h-screen bg-white">
        {/* Case Study Header */}
        <CaseStudyHeader caseStudy={caseStudy} />

        {/* Before/After Showcase */}
        {caseStudy.images.some(img => img.type === 'before' || img.type === 'after') && (
          <BeforeAfterShowcase images={caseStudy.images} />
        )}

        {/* Result Metrics */}
        {caseStudy.results.length > 0 && (
          <ResultMetrics results={caseStudy.results} />
        )}

        {/* Main Content */}
        <CaseStudyContent caseStudy={caseStudy} />

        {/* Client Testimonial */}
        {caseStudy.testimonial && (
          <ClientTestimonial testimonial={caseStudy.testimonial} />
        )}

        {/* Technology Stack */}
        {caseStudy.technologies.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Technology Stack
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Modern, reliable technologies used in this project
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudy.technologies.map((tech, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center mb-4">
                      {tech.icon && (
                        <div className="text-2xl mr-3">{tech.icon}</div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{tech.name}</h3>
                        <p className="text-sm text-gray-600">{tech.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Case Studies */}
        {relatedCaseStudies.length > 0 && (
          <RelatedCaseStudies caseStudies={relatedCaseStudies} />
        )}

        {/* CTA Section */}
        <section className="py-16 bg-[#215b6f] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for Similar Results?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Let's discuss how we can help transform your business with proven strategies 
              and cutting-edge technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-[#7cc0ba] text-[#215b6f] px-8 py-4 rounded-lg font-semibold hover:bg-[#6bb0aa] transition-colors"
              >
                Get Free Consultation
              </a>
              <a
                href="/portfolio"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#215b6f] transition-colors"
              >
                View More Case Studies
              </a>
            </div>
          </div>
        </section>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": caseStudy.title,
              "description": caseStudy.excerpt,
              "author": {
                "@type": "Organization",
                "name": settings.brand.companyName
              },
              "publisher": {
                "@type": "Organization",
                "name": settings.brand.companyName
              },
              "datePublished": caseStudy.publishDate.toISOString(),
              "dateModified": caseStudy.publishDate.toISOString(),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.dhimahitechnolabs.com/portfolio/${slug}`
              },
              "image": caseStudy.images.length > 0 ? caseStudy.images[0].src : "",
              "articleSection": "Case Study",
              "keywords": [caseStudy.category, caseStudy.client.industry, caseStudy.projectType]
            })
          }}
        />
      </main>
    );
  } catch (error) {
    notFound();
  }
}