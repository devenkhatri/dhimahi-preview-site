import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPersonas, getPersonaBySlug } from '@/lib/content';
import { generatePersonaMetadata, generatePersonaStructuredData } from '@/lib/seo';
import { PersonaStorySection } from '@/components/PersonaStorySection';
import PersonaCard from '@/components/PersonaCard';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { PersonaErrorBoundary } from '@/components/PersonaErrorBoundary';
import SocialShare from '@/components/SocialShare';
import RelatedInsightsPersona from '@/components/RelatedInsightsPersona';

interface PersonaPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const personas = await getAllPersonas();
    return personas.map((persona) => ({
      slug: persona.slug,
    }));
  } catch (error) {
    console.warn('Error generating static params for personas:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PersonaPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const persona = await getPersonaBySlug(slug);
    
    if (!persona) {
      return {
        title: 'Persona Not Found | Dhimahi Technolabs',
        description: 'The requested persona could not be found.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    return generatePersonaMetadata({
      title: persona.title,
      slug: persona.slug,
      excerpt: persona.excerpt,
      icon: persona.icon,
      publishDate: persona.publishDate,
      modifiedDate: (persona as any).modifiedDate,
      tags: persona.tags,
    });
  } catch (error) {
    console.error('Error generating metadata for persona:', error);
    return {
      title: 'Persona Error | Dhimahi Technolabs',
      description: 'There was an error loading this persona.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

// Component for persona content with error handling
async function PersonaContent({ slug }: { slug: string }) {
  try {
    const persona = await getPersonaBySlug(slug);
    
    if (!persona) {
      notFound();
    }

    // Validate persona data structure
    if (!persona.storytelling || typeof persona.storytelling !== 'object') {
      throw new Error('Invalid persona storytelling data');
    }

    // Calculate estimated reading time
    const calculateReadingTime = (text: string): number => {
      const wordsPerMinute = 200;
      const wordCount = text.split(/\s+/).length;
      return Math.ceil(wordCount / wordsPerMinute);
    };

    const totalContent = [
      persona.storytelling.everydayStruggle,
      persona.storytelling.whyThisMatters,
      persona.storytelling.howDhimahiHelps,
      persona.storytelling.theJourney,
      persona.storytelling.callToAction?.description || ''
    ].join(' ');

    const readingTime = calculateReadingTime(totalContent);

    // Get related personas (excluding current one)
    const allPersonas = await getAllPersonas();
    const relatedPersonas = allPersonas
      .filter(p => p.slug !== persona.slug)
      .slice(0, 3);

    return (
      <>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Breadcrumb */}
              <nav className="mb-8">
                <ol className="flex items-center justify-center space-x-2 text-sm opacity-90">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li className="text-white/60">/</li>
                  <li>
                    <Link href="/personas" className="hover:text-white transition-colors">
                      Personas
                    </Link>
                  </li>
                  <li className="text-white/60">/</li>
                  <li className="text-white">{persona.title}</li>
                </ol>
              </nav>

              {/* Persona Icon */}
              {persona.icon && (
                <div className="mb-6">
                  <PersonaErrorBoundary fallbackType="section">
                    <OptimizedImage
                      src={persona.icon}
                      alt={`${persona.title} icon`}
                      width={80}
                      height={80}
                      className="mx-auto"
                    />
                  </PersonaErrorBoundary>
                </div>
              )}

              {/* Title and Excerpt */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {persona.title}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-6">
                {persona.excerpt || `Discover how ${persona.title} overcomes business challenges with our solutions.`}
              </p>

              {/* Reading time and metadata */}
              <div className="flex items-center justify-center gap-6 text-sm opacity-75 mb-8">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime} min read
                </span>
                {persona.publishDate && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(persona.publishDate).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                )}
                {persona.tags && persona.tags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {persona.tags.slice(0, 2).join(', ')}
                  </span>
                )}
              </div>

              {/* Social Sharing */}
              <div className="flex justify-center">
                <SocialShare
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com'}/personas/${persona.slug}`}
                  title={`${persona.title} - Customer Success Story`}
                  description={persona.excerpt || `Discover how ${persona.title} overcomes business challenges with proven solutions.`}
                  className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Storytelling Content */}
        <main className="py-16" itemScope itemType="https://schema.org/Article">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Article metadata for microdata */}
              <meta itemProp="headline" content={`${persona.title} - Customer Success Story`} />
              <meta itemProp="description" content={persona.excerpt || `Discover how ${persona.title} overcomes business challenges with proven solutions.`} />
              <meta itemProp="datePublished" content={persona.publishDate || new Date().toISOString()} />
              <meta itemProp="dateModified" content={(persona as any).modifiedDate || persona.publishDate || new Date().toISOString()} />
              <meta itemProp="author" content="Dhīmahi Technolabs" />
              <meta itemProp="publisher" content="Dhīmahi Technolabs" />
              {persona.icon && <meta itemProp="image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dhimahitechnolabs.com'}${persona.icon}`} />}
              
              {/* Progressive Content Disclosure */}
              <div className="space-y-16" itemProp="articleBody">
                {/* Everyday Struggle */}
                {persona.storytelling.everydayStruggle && (
                  <PersonaStorySection
                    title="The Everyday Struggle"
                    content={persona.storytelling.everydayStruggle}
                    sectionType="struggle"
                  />
                )}

                {/* Why This Matters */}
                {persona.storytelling.whyThisMatters && (
                  <PersonaStorySection
                    title="Why This Matters"
                    content={persona.storytelling.whyThisMatters}
                    sectionType="matters"
                  />
                )}

                {/* How Dhimahi Helps */}
                {persona.storytelling.howDhimahiHelps && (
                  <PersonaStorySection
                    title="How Dhimahi Helps"
                    content={persona.storytelling.howDhimahiHelps}
                    sectionType="helps"
                  />
                )}

                {/* The Journey */}
                {persona.storytelling.theJourney && (
                  <PersonaStorySection
                    title="The Journey"
                    content={persona.storytelling.theJourney}
                    sectionType="journey"
                  />
                )}

                {/* Call to Action */}
                {persona.storytelling.callToAction && (
                  <section className="bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                      {persona.storytelling.callToAction.title || 'Ready to Transform Your Business?'}
                    </h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                      {persona.storytelling.callToAction.description || 'Let\'s discuss how we can help you overcome your challenges and achieve your goals.'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {/* Primary Button */}
                      {persona.storytelling.callToAction.primaryButton && (
                        <Link
                          href={persona.storytelling.callToAction.primaryButton.url || '/consultation'}
                          className="bg-white text-[#215b6f] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                        >
                          {persona.storytelling.callToAction.primaryButton.text || 'Get Started'}
                        </Link>
                      )}
                      
                      {/* Secondary Button */}
                      {persona.storytelling.callToAction.secondaryButton && (
                        <Link
                          href={persona.storytelling.callToAction.secondaryButton.url || '/services'}
                          className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#215b6f] transition-colors inline-block"
                        >
                          {persona.storytelling.callToAction.secondaryButton.text || 'Learn More'}
                        </Link>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Related Insights */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <PersonaErrorBoundary fallbackType="section">
                <RelatedInsightsPersona
                  personaSlug={persona.slug}
                  personaTags={persona.tags || []}
                />
              </PersonaErrorBoundary>
            </div>
          </div>
        </section>

        {/* Related Personas */}
        {relatedPersonas.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  Explore Other Personas
                </h2>
                <PersonaErrorBoundary fallbackType="list">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedPersonas.map((relatedPersona) => (
                      <PersonaCard
                        key={relatedPersona.slug}
                        persona={relatedPersona}
                      />
                    ))}
                  </div>
                </PersonaErrorBoundary>
                <div className="text-center mt-12">
                  <Link
                    href="/personas"
                    className="inline-flex items-center px-6 py-3 bg-[#215b6f] text-white rounded-lg hover:bg-[#1a4a5a] transition-colors"
                  >
                    View All Personas
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
    );
  } catch (error) {
    console.error('Error loading persona content:', error);
    throw error; // Let the error boundary handle it
  }
}

export default async function PersonaPage({ params }: PersonaPageProps) {
  const { slug } = await params;

  // Generate structured data for the persona
  let structuredDataArray: any[] = [];
  try {
    const persona = await getPersonaBySlug(slug);
    if (persona) {
      structuredDataArray = generatePersonaStructuredData({
        title: persona.title,
        slug: persona.slug,
        excerpt: persona.excerpt,
        icon: persona.icon,
        publishDate: persona.publishDate,
        modifiedDate: (persona as any).modifiedDate,
        tags: persona.tags,
      });
    }
  } catch (error) {
    console.error('Error generating structured data for persona:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      {structuredDataArray.map((structuredData, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(structuredData)
          }}
        />
      ))}
      
      <PersonaErrorBoundary fallbackType="page" personaTitle={slug}>
        <PersonaContent slug={slug} />
      </PersonaErrorBoundary>
    </div>
  );
}