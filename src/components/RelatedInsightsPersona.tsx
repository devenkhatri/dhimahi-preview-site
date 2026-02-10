import Link from 'next/link';
import { getAllCMSInsights } from '@/lib/cms-content';
import type { InsightMeta } from '@/lib/cms-content';

interface RelatedInsightsPersonaProps {
  personaSlug: string;
  personaTags: string[];
  className?: string;
  limit?: number;
}

// Mapping of persona slugs to relevant insight tags and categories
const personaInsightMapping: Record<string, { tags: string[]; categories: string[] }> = {
  'small-business-owner': {
    tags: ['SME', 'Digital Marketing', 'Business Strategy', 'Growth', 'Automation', 'CRM', 'Lead Generation'],
    categories: ['Digital Marketing', 'Business Strategy', 'AI & Automation']
  },
  'doctors': {
    tags: ['Healthcare', 'Medical', 'Patient Management', 'Appointment Booking', 'Customer Service', 'Automation'],
    categories: ['AI & Automation', 'Business Strategy', 'Digital Marketing']
  },
  'builders': {
    tags: ['Real Estate', 'Construction', 'Digital Marketing', 'Lead Generation', 'Project Management', 'SME'],
    categories: ['Digital Marketing', 'Business Strategy', 'Application Portfolio Rationalisation']
  },
  'retail-entrepreneur': {
    tags: ['E-commerce', 'Retail', 'Inventory Management', 'Customer Retention', 'Digital Marketing', 'SME'],
    categories: ['Digital Marketing', 'Business Strategy', 'Application Portfolio Rationalisation']
  },
  'chartered-accountants': {
    tags: ['Financial Management', 'Accounting Software', 'GST', 'Compliance', 'Automation', 'SME'],
    categories: ['AI & Automation', 'Business Strategy', 'IT Strategy']
  },
  'physiotherapists': {
    tags: ['Healthcare', 'Medical', 'Patient Management', 'Appointment Booking', 'Customer Service', 'SME'],
    categories: ['AI & Automation', 'Business Strategy', 'Digital Marketing']
  },
  'it-colleagues': {
    tags: ['IT Strategy', 'Technology Adoption', 'Digital Transformation', 'Cybersecurity', 'Cloud Migration'],
    categories: ['IT Strategy', 'AI & Automation', 'Business Strategy']
  },
  'digital-media-house': {
    tags: ['Digital Marketing', 'Content Marketing', 'Social Media', 'Brand Building', 'Creative Services'],
    categories: ['Digital Marketing', 'Application Portfolio Rationalisation', 'Business Strategy']
  },
  'friends-family-members': {
    tags: ['SME', 'Business Strategy', 'Digital Transformation', 'Technology Adoption', 'Growth'],
    categories: ['Business Strategy', 'Digital Marketing', 'IT Strategy']
  },
  'jewelry-store-owner': {
    tags: ['E-commerce', 'Retail', 'Digital Marketing', 'Customer Retention', 'Local SEO', 'SME'],
    categories: ['Digital Marketing', 'Application Portfolio Rationalisation', 'Business Strategy']
  },
  'restaurant-owner': {
    tags: ['Local SEO', 'Customer Service', 'Digital Marketing', 'Online Ordering', 'Social Media', 'SME'],
    categories: ['Digital Marketing', 'AI & Automation', 'Business Strategy']
  },
  'textile-manufacturer': {
    tags: ['Manufacturing', 'Supply Chain', 'Inventory Management', 'Quality Control', 'ERP', 'SME'],
    categories: ['AI & Automation', 'Business Strategy', 'IT Strategy']
  },
  'ecommerce-business-owners': {
    tags: ['E-commerce', 'Online Sales', 'Digital Marketing', 'Customer Analytics', 'Automation', 'SME'],
    categories: ['Digital Marketing', 'Application Portfolio Rationalisation', 'AI & Automation']
  }
};

export default function RelatedInsightsPersona({
  personaSlug,
  personaTags,
  className = '',
  limit = 4
}: RelatedInsightsPersonaProps) {
  const allInsights = getAllCMSInsights();

  // Get relevant tags and categories for this persona
  const personaMapping = personaInsightMapping[personaSlug] || { tags: [], categories: [] };
  const allTags = [...personaTags, ...personaMapping.tags];
  const relevantTags = Array.from(new Set(allTags));
  const relevantCategories = personaMapping.categories;

  // Score insights based on relevance
  const scoredInsights = allInsights.map(insight => {
    let score = 0;

    // Score based on tag matches
    const tagMatches = insight.tags.filter(tag =>
      relevantTags.some(relevantTag =>
        tag.toLowerCase().includes(relevantTag.toLowerCase()) ||
        relevantTag.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;
    score += tagMatches * 3;

    // Score based on category matches
    if (relevantCategories.includes(insight.category)) {
      score += 2;
    }

    // Boost score for SME-related content
    if (insight.tags.some(tag => tag.toLowerCase().includes('sme'))) {
      score += 1;
    }

    return { insight, score };
  });

  // Filter and sort by score, then take the top results
  const relatedInsights = scoredInsights
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.insight);

  if (relatedInsights.length === 0) {
    return null;
  }

  return (
    <section className={`mt-16 ${className}`}>
      <div className="bg-gray-50 rounded-2xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Relevant Insights & Resources
          </h2>
          <p className="text-gray-600">
            Discover actionable insights and strategies that can help your business grow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {relatedInsights.map((insight) => (
            <Link
              key={insight.slug}
              href={`/insights/${insight.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200"
            >
              {/* Category Badge */}
              <div className="mb-3">
                <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {insight.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {insight.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {insight.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span>{insight.publishDate.toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span>{Math.ceil(insight.excerpt.split(' ').length / 50)} min read</span>
                </div>

                <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                  <span className="font-medium">Read more</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {insight.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {insight.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{insight.tags.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Insights CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <span>Explore all insights</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}