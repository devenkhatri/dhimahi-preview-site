'use client';

import { CaseStudy } from '@/lib/case-studies';

interface CaseStudyContentProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyContent({ caseStudy }: CaseStudyContentProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Challenge Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed text-lg">
              {caseStudy.challenge}
            </p>
          </div>
        </div>

        {/* Solution Section */}
        {caseStudy.solution.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
            <div className="bg-blue-50 border-l-4 border-[#215b6f] p-6 rounded-r-lg">
              <ul className="space-y-4">
                {caseStudy.solution.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#7cc0ba] rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: caseStudy.content }}
          />
        </div>

        {/* Services Used */}
        {caseStudy.services.length > 0 && (
          <div className="mt-12 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Services Utilized</h3>
            <div className="flex flex-wrap gap-3">
              {caseStudy.services.map((service) => (
                <span
                  key={service}
                  className="bg-[#215b6f] text-white px-4 py-2 rounded-lg font-semibold"
                >
                  {service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Images */}
        {caseStudy.images.filter(img => img.type === 'process' || img.type === 'result').length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.images
                .filter(img => img.type === 'process' || img.type === 'result')
                .map((image, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-64 object-cover"
                    />
                    {image.caption && (
                      <div className="p-4">
                        <p className="text-gray-600 text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}