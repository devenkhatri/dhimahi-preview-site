'use client';

import { CaseStudyMeta } from '@/lib/case-studies';
import CaseStudyCard from './CaseStudyCard';

interface RelatedCaseStudiesProps {
  caseStudies: CaseStudyMeta[];
}

export default function RelatedCaseStudies({ caseStudies }: RelatedCaseStudiesProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Related Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore more examples of how we've helped businesses achieve similar transformations 
            and drive measurable growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <a
            href="/portfolio"
            className="inline-flex items-center bg-[#215b6f] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1a4a5a] transition-colors"
          >
            View All Case Studies
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}