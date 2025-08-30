import { Metadata } from 'next';
import { getAllCaseStudies, CaseStudyMeta } from '@/lib/case-studies';
import { COMPANY_NAME } from '@/lib/constants';
import CaseStudyCard from '@/components/CaseStudyCard';
import PortfolioFilters from '@/components/PortfolioFilters';

export const metadata: Metadata = {
  title: `Portfolio & Case Studies | ${COMPANY_NAME}`,
  description: 'Explore our successful IT consulting projects, digital marketing campaigns, and AI automation implementations for SMEs across Gujarat. Real results, real clients.',
  keywords: [
    'IT consulting portfolio',
    'case studies Gujarat',
    'digital marketing results',
    'AI automation projects',
    'SME success stories',
    'Ahmedabad IT projects',
    'business transformation',
    'client testimonials'
  ],
  openGraph: {
    title: `Portfolio & Case Studies | ${COMPANY_NAME}`,
    description: 'Discover how we\'ve helped SMEs across Gujarat transform their businesses through strategic IT consulting, digital marketing, and AI automation.',
    type: 'website',
  },
};

export default function PortfolioPage() {
  const caseStudies = getAllCaseStudies();
  const featuredCaseStudies = caseStudies.filter(cs => cs.featured);
  const categories = ['all', 'web-development', 'digital-marketing', 'ai-automation'];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Portfolio & Case Studies
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Real results for real businesses. Discover how we've helped SMEs across Gujarat 
              transform their operations through strategic IT consulting and digital innovation.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-[#7cc0ba]">{caseStudies.length}+</div>
                <div className="text-blue-100">Successful Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-[#7cc0ba]">25+</div>
                <div className="text-blue-100">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-[#7cc0ba]">100%</div>
                <div className="text-blue-100">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredCaseStudies.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Success Stories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Highlighting our most impactful projects that delivered exceptional results 
                for our clients across different industries.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCaseStudies.map((caseStudy) => (
                <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Case Studies with Filters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Case Studies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our complete portfolio of successful projects across web development, 
              digital marketing, and AI automation.
            </p>
          </div>

          {/* Portfolio Filters */}
          <PortfolioFilters categories={categories} caseStudies={caseStudies} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#215b6f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Success Story?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join the growing list of successful SMEs who have transformed their businesses 
            with our strategic IT consulting and digital solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-[#7cc0ba] text-[#215b6f] px-8 py-4 rounded-lg font-semibold hover:bg-[#6bb0aa] transition-colors"
            >
              Start Your Project
            </a>
            <a
              href="/services"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#215b6f] transition-colors"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}