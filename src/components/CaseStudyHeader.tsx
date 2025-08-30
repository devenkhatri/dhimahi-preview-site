'use client';

import { CaseStudy } from '@/lib/case-studies';

interface CaseStudyHeaderProps {
  caseStudy: CaseStudy;
}

const categoryColors = {
  'web-development': 'bg-blue-100 text-blue-800',
  'digital-marketing': 'bg-green-100 text-green-800',
  'ai-automation': 'bg-purple-100 text-purple-800',
};

const categoryLabels = {
  'web-development': 'Web Development',
  'digital-marketing': 'Digital Marketing',
  'ai-automation': 'AI & Automation',
};

export default function CaseStudyHeader({ caseStudy }: CaseStudyHeaderProps) {
  return (
    <section className="bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-blue-100">
            <li>
              <a href="/" className="hover:text-white transition-colors">Home</a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <a href="/portfolio" className="hover:text-white transition-colors">Portfolio</a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-white">{caseStudy.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Category Badge */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${categoryColors[caseStudy.category]} bg-white/20 text-white`}>
                {categoryLabels[caseStudy.category]}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {caseStudy.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-blue-100 mb-8">
              {caseStudy.excerpt}
            </p>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[#7cc0ba] mb-2">Client</h3>
                <p className="text-blue-100">{caseStudy.client.name}</p>
                <p className="text-sm text-blue-200">{caseStudy.client.industry}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#7cc0ba] mb-2">Duration</h3>
                <p className="text-blue-100">{caseStudy.duration}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#7cc0ba] mb-2">Team Size</h3>
                <p className="text-blue-100">{caseStudy.teamSize} specialists</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#7cc0ba] mb-2">Location</h3>
                <p className="text-blue-100">{caseStudy.client.location}</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative">
            {caseStudy.images.length > 0 && (
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={caseStudy.images[0].src}
                  alt={caseStudy.images[0].alt}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}