'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Search results component that handles client-side search
function SearchResults({ query }: { query: string }) {
  if (!query || query.trim().length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Our Content</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Enter a search term to find relevant services, insights, and solutions.
        </p>
      </div>
    );
  }

  // Static search data - in a real implementation, this would come from an API
  const searchableContent = [
    // Services
    {
      type: 'service',
      title: 'Web Development',
      excerpt: 'Custom websites and web applications built with modern technologies',
      href: '/services/web-development',
      icon: '🌐',
      tags: ['web', 'development', 'website', 'react', 'nextjs']
    },
    {
      type: 'service', 
      title: 'Digital Marketing',
      excerpt: 'SEO, social media marketing, and digital advertising solutions',
      href: '/services/digital-marketing',
      icon: '📈',
      tags: ['marketing', 'seo', 'social media', 'advertising', 'digital']
    },
    {
      type: 'service',
      title: 'AI & Automation',
      excerpt: 'AI solutions and business process automation for SMEs',
      href: '/services/ai-automation',
      icon: '🤖',
      tags: ['ai', 'automation', 'artificial intelligence', 'chatbots', 'workflow']
    },
    // Sample insights
    {
      type: 'insight',
      title: 'AI Chatbots for Customer Service',
      excerpt: 'How AI chatbots can transform customer service for small businesses',
      href: '/insights/ai-chatbots-customer-service-sme',
      tags: ['ai', 'chatbots', 'customer service', 'automation']
    },
    {
      type: 'insight',
      title: 'Digital Marketing Budget Guide',
      excerpt: 'How to allocate your digital marketing budget effectively',
      href: '/insights/digital-marketing-budget-sme-gujarat',
      tags: ['marketing', 'budget', 'digital', 'sme', 'gujarat']
    }
  ];

  // Simple search implementation
  const searchTerm = query.toLowerCase();
  
  const matchingContent = searchableContent.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.excerpt.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  const matchingServices = matchingContent.filter(item => item.type === 'service');
  const matchingInsights = matchingContent.filter(item => item.type === 'insight');
  const totalResults = matchingContent.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            We couldn't find any content matching your search. Try different keywords or browse our services and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="bg-[#215b6f] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition-colors duration-200 font-medium"
            >
              Browse Services
            </Link>
            <Link
              href="/insights"
              className="border border-[#215b6f] text-[#215b6f] px-6 py-3 rounded-lg hover:bg-[#215b6f] hover:text-white transition-colors duration-200 font-medium"
            >
              Read Insights
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Services Results */}
          {matchingServices.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#7cc0ba]">🛠️</span>
                Services ({matchingServices.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {matchingServices.map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-[#215b6f]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{service.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.excerpt}
                        </p>
                        <div className="mt-3 text-[#215b6f] text-sm font-medium">
                          Learn more →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Insights Results */}
          {matchingInsights.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#7cc0ba]">💡</span>
                Insights ({matchingInsights.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matchingInsights.map((insight, index) => (
                  <Link
                    key={index}
                    href={insight.href}
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-[#215b6f]"
                  >
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {insight.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#e8f5f3] text-[#215b6f] text-xs rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {insight.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {insight.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="text-[#215b6f] font-medium">Read more →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get search query from URL on client side
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    setQuery(searchQuery);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#215b6f] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <SearchResults query={query} />
      </div>
    </main>
  );
}

