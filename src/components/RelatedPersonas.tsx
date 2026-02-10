import Link from 'next/link';
import { getAllPersonas } from '@/lib/content';

interface RelatedPersonasProps {
  serviceName: string;
  className?: string;
}

// Mapping of services to relevant personas
const servicePersonaMapping: Record<string, string[]> = {
  'application-portfolio-rationalisation': ['small-business-owner', 'retail-entrepreneur', 'doctors', 'builders'],
  'digital-marketing': ['small-business-owner', 'retail-entrepreneur', 'chartered-accountants'],
  'ai-automation': ['small-business-owner', 'doctors', 'chartered-accountants', 'physiotherapists'],
};

export default function RelatedPersonas({ serviceName, className = '' }: RelatedPersonasProps) {
  const allPersonas = getAllPersonas();
  const serviceSlug = serviceName.toLowerCase().replace(/\s+/g, '-');
  const relevantPersonaSlugs = servicePersonaMapping[serviceSlug] || [];

  const relatedPersonas = allPersonas.filter(persona =>
    relevantPersonaSlugs.includes(persona.slug)
  ).slice(0, 3);

  if (relatedPersonas.length === 0) {
    return null;
  }

  return (
    <section className={`mt-16 ${className}`}>
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Who Benefits from {serviceName}?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how businesses like yours are using our {serviceName.toLowerCase()} services to achieve their goals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPersonas.map((persona) => (
            <Link
              key={persona.slug}
              href={`/personas/${persona.slug}`}
              className="group block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-primary/30 transition-all duration-200"
            >
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <img
                    src={persona.icon}
                    alt={`${persona.title} icon`}
                    className="w-8 h-8"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {persona.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {persona.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {persona.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-primary text-sm font-medium group-hover:underline">
                  See their story →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Personas CTA */}
        <div className="text-center mt-8">
          <Link
            href="/personas"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <span>Explore all personas</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}