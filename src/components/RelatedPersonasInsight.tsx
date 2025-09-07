import Link from 'next/link';
import { getAllPersonas } from '@/lib/content';

interface RelatedPersonasInsightProps {
  tags: string[];
  category?: string;
  className?: string;
}

// Mapping of insight tags/categories to relevant personas
const tagPersonaMapping: Record<string, string[]> = {
  'ai': ['small-business-owner', 'doctors', 'chartered-accountants'],
  'automation': ['small-business-owner', 'doctors', 'physiotherapists'],
  'chatbots': ['small-business-owner', 'doctors', 'retail-entrepreneur'],
  'customer service': ['small-business-owner', 'retail-entrepreneur', 'doctors'],
  'marketing': ['small-business-owner', 'retail-entrepreneur', 'builders'],
  'digital marketing': ['small-business-owner', 'retail-entrepreneur', 'builders'],
  'seo': ['small-business-owner', 'retail-entrepreneur', 'builders'],
  'e-commerce': ['retail-entrepreneur', 'small-business-owner'],
  'healthcare': ['doctors', 'physiotherapists'],
  'medical': ['doctors', 'physiotherapists'],
  'business': ['small-business-owner', 'chartered-accountants', 'retail-entrepreneur'],
  'sme': ['small-business-owner', 'retail-entrepreneur', 'chartered-accountants'],
  'technology': ['it-colleagues', 'small-business-owner'],
  'it': ['it-colleagues', 'small-business-owner'],
};

export default function RelatedPersonasInsight({ tags, category, className = '' }: RelatedPersonasInsightProps) {
  const allPersonas = getAllPersonas();
  
  // Find relevant personas based on tags and category
  const relevantPersonaSlugs = new Set<string>();
  
  // Add personas based on tags
  tags.forEach(tag => {
    const tagLower = tag.toLowerCase();
    if (tagPersonaMapping[tagLower]) {
      tagPersonaMapping[tagLower].forEach(slug => relevantPersonaSlugs.add(slug));
    }
  });
  
  // Add personas based on category
  if (category) {
    const categoryLower = category.toLowerCase();
    if (tagPersonaMapping[categoryLower]) {
      tagPersonaMapping[categoryLower].forEach(slug => relevantPersonaSlugs.add(slug));
    }
  }
  
  const relatedPersonas = allPersonas.filter(persona => 
    relevantPersonaSlugs.has(persona.slug)
  ).slice(0, 2);

  if (relatedPersonas.length === 0) {
    return null;
  }

  return (
    <section className={`mt-12 ${className}`}>
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Who Can Benefit from This?
          </h3>
          <p className="text-gray-600 text-sm">
            See how businesses like these are implementing similar solutions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {relatedPersonas.map((persona) => (
            <Link
              key={persona.slug}
              href={`/personas/${persona.slug}`}
              className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <img 
                  src={persona.icon} 
                  alt={`${persona.title} icon`}
                  className="w-6 h-6"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {persona.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {persona.excerpt}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-primary text-xs font-medium">See their story</span>
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Personas CTA */}
        <div className="mt-6 text-center">
          <Link
            href="/personas"
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
          >
            <span>Explore all business personas</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}