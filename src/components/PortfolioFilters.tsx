'use client';

import { useState } from 'react';
import { CaseStudyMeta } from '@/lib/cms-content';
import CaseStudyCard from './CaseStudyCard';

interface PortfolioFiltersProps {
  categories: string[];
  caseStudies: CaseStudyMeta[];
}

const categoryLabels = {
  all: 'All Projects',
  'web-development': 'Web Development',
  'digital-marketing': 'Digital Marketing',
  'ai-automation': 'AI & Automation',
};

export default function PortfolioFilters({ categories, caseStudies }: PortfolioFiltersProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCaseStudies = caseStudies.filter((caseStudy) => {
    const matchesCategory = activeCategory === 'all' || caseStudy.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      caseStudy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseStudy.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseStudy.client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseStudy.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7cc0ba] focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeCategory === category
                  ? 'bg-[#215b6f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          Showing {filteredCaseStudies.length} of {caseStudies.length} case studies
          {searchTerm && (
            <span className="ml-2">
              for "<span className="font-semibold">{searchTerm}</span>"
            </span>
          )}
        </p>
      </div>

      {/* Case Studies Grid */}
      {filteredCaseStudies.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No case studies found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or category filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
            className="bg-[#215b6f] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}