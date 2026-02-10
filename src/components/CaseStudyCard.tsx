'use client';

import Link from 'next/link';
import { CaseStudyMeta } from '@/lib/cms-content';

interface CaseStudyCardProps {
  caseStudy: CaseStudyMeta;
  featured?: boolean;
}

const categoryColors = {
  'application-portfolio-rationalisation': 'bg-blue-100 text-blue-800',
  'digital-marketing': 'bg-green-100 text-green-800',
  'ai-automation': 'bg-purple-100 text-purple-800',
};

const categoryLabels = {
  'application-portfolio-rationalisation': 'Application Portfolio Rationalisation',
  'digital-marketing': 'Digital Marketing',
  'ai-automation': 'AI & Automation',
};

export default function CaseStudyCard({ caseStudy, featured = false }: CaseStudyCardProps) {
  const cardImage = caseStudy.images.find(img => img.type === 'after') || caseStudy.images[0];

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${featured ? 'ring-2 ring-[#7cc0ba]' : ''}`}>
      {/* Image */}
      {cardImage && (
        <div className="relative h-48 bg-gray-200">
          <img
            src={cardImage.src}
            alt={cardImage.alt}
            className="w-full h-full object-cover"
          />
          {featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#7cc0ba] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[caseStudy.category]}`}>
              {categoryLabels[caseStudy.category]}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Client Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{caseStudy.client.name}</span>
            <span className="mx-2">•</span>
            <span>{caseStudy.client.industry}</span>
          </div>
          <div className="text-sm text-gray-500">
            {caseStudy.duration}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {caseStudy.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {caseStudy.excerpt}
        </p>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {caseStudy.services.slice(0, 2).map((service) => (
            <span
              key={service}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
            >
              {service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
          {caseStudy.services.length > 2 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
              +{caseStudy.services.length - 2} more
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/portfolio/${caseStudy.slug}`}
          className="inline-flex items-center text-[#215b6f] font-semibold hover:text-[#7cc0ba] transition-colors"
        >
          Read Case Study
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}